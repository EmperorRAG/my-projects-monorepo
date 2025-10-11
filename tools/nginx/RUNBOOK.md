# NGINX Operations Runbook

This runbook provides step-by-step procedures for common operational tasks related to the NGINX infrastructure.

## 📚 Table of Contents

1. [Daily Operations](#daily-operations)
2. [Certificate Management](#certificate-management)
3. [Configuration Changes](#configuration-changes)
4. [Incident Response](#incident-response)
5. [Scaling Operations](#scaling-operations)
6. [Backup and Recovery](#backup-and-recovery)
7. [Performance Issues](#performance-issues)

---

## Daily Operations

### Morning Health Check

**Frequency**: Daily (automated recommended)

**Steps**:

1. Check service status:
   ```bash
   nx run nginx:docker:compose-ps
   ```

2. Verify health endpoints:
   ```bash
   nx run nginx:health-check
   ```

3. Review logs for errors:
   ```bash
   docker compose -f tools/nginx/docker-compose.yaml logs --since 24h | grep -i error
   ```

4. Check resource usage:
   ```bash
   docker stats --no-stream nginx-proxy-edge nginx-lb-frontend nginx-lb-api nginx-lb-email
   ```

**Expected Results**:
- All services showing "Up" status
- Health checks returning 200 OK
- No critical errors in logs
- Resource usage within normal ranges

**Actions if Failed**:
- If service is down: [Service Recovery Procedure](#service-recovery)
- If health check fails: [Health Check Failure](#health-check-failure)
- If errors found: [Error Investigation](#error-investigation)

---

## Certificate Management

### Certificate Rotation

**Frequency**: Before certificate expiration (recommended: 30 days before)

**Prerequisites**:
- New TLS certificate and private key
- Certificate is valid and trusted
- Private key matches the certificate

**Steps**:

1. **Backup existing certificates**:
   ```bash
   cd tools/nginx/secrets/tls
   mkdir -p ../backup/$(date +%Y%m%d)
   cp *.pem ../backup/$(date +%Y%m%d)/
   ```

2. **Verify new certificate**:
   ```bash
   # Check certificate validity
   openssl x509 -in new-cert.pem -text -noout
   
   # Verify certificate and key match
   openssl x509 -noout -modulus -in new-cert.pem | openssl md5
   openssl rsa -noout -modulus -in new-key.pem | openssl md5
   # These should produce identical hashes
   ```

3. **Update certificates**:
   ```bash
   cp new-cert.pem tools/nginx/secrets/tls/cert.pem
   cp new-key.pem tools/nginx/secrets/tls/key.pem
   chmod 600 tools/nginx/secrets/tls/*.pem
   ```

4. **Test configuration**:
   ```bash
   docker compose -f tools/nginx/docker-compose.yaml exec proxy-edge nginx -t
   ```

5. **Reload NGINX** (zero-downtime):
   ```bash
   docker compose -f tools/nginx/docker-compose.yaml exec proxy-edge nginx -s reload
   ```

6. **Verify HTTPS**:
   ```bash
   curl -I https://your-domain.com
   openssl s_client -connect your-domain.com:443 -servername your-domain.com
   ```

**Rollback Procedure** (if issues occur):
```bash
# Restore backup certificates
cp tools/nginx/secrets/backup/YYYYMMDD/*.pem tools/nginx/secrets/tls/
docker compose -f tools/nginx/docker-compose.yaml exec proxy-edge nginx -s reload
```

### Let's Encrypt Certificate Automation

**Using Certbot** (recommended for production):

1. **Install Certbot**:
   ```bash
   # Add Certbot container to docker-compose.yaml
   # Or install on host system
   ```

2. **Obtain certificate**:
   ```bash
   certbot certonly --webroot -w /var/www/html -d your-domain.com
   ```

3. **Create renewal hook**:
   ```bash
   # In /etc/letsencrypt/renewal-hooks/deploy/nginx-reload.sh
   #!/bin/bash
   docker compose -f /path/to/tools/nginx/docker-compose.yaml exec proxy-edge nginx -s reload
   ```

4. **Test renewal**:
   ```bash
   certbot renew --dry-run
   ```

---

## Configuration Changes

### Deploying Configuration Updates

**When to use**: After modifying any `.conf` files

**Steps**:

1. **Edit configuration files** in the appropriate location:
   - Base config: `tools/nginx/common/base.nginx.conf`
   - Service config: `tools/nginx/{service}/nginx.conf`
   - Environment overlay: `tools/nginx/{service}/overlays/{env}.conf`

2. **Validate syntax locally** (optional but recommended):
   ```bash
   # Install nginx locally for validation
   nginx -t -c tools/nginx/proxy-edge/nginx.conf
   ```

3. **Validate in container**:
   ```bash
   nx run nginx:validate-config
   ```

4. **Apply changes** (choose one method):

   **Method A: Hot Reload (zero downtime)**:
   ```bash
   nx run nginx:reload-config
   ```
   
   **Method B: Full Restart (if structural changes)**:
   ```bash
   nx run nginx:restart
   ```

5. **Verify changes**:
   ```bash
   # Check logs for errors
   docker compose -f tools/nginx/docker-compose.yaml logs --tail=50 proxy-edge
   
   # Test endpoints
   curl -I http://localhost/
   ```

**Rollback Procedure**:
```bash
# Revert configuration files using git
git checkout HEAD -- tools/nginx/
nx run nginx:reload-config
```

### Adding a New Upstream Server

**Scenario**: Adding a new application instance to load balancer pool

**Steps**:

1. **Identify target load balancer** (frontend, API, or email)

2. **Edit upstream configuration**:
   ```bash
   # Example: Adding to frontend load balancer
   vim tools/nginx/load-balancers/lb-frontend/nginx.conf
   ```

3. **Add server to upstream block**:
   ```nginx
   upstream frontend_apps {
       # ... existing servers ...
       server my-programs-app-3:3000 max_fails=3 fail_timeout=30s weight=1;
   }
   ```

4. **Validate and reload**:
   ```bash
   nx run nginx:validate-config
   nx run nginx:reload-config
   ```

5. **Monitor traffic distribution**:
   ```bash
   # Watch access logs
   docker compose -f tools/nginx/docker-compose.yaml logs -f lb-frontend | grep upstream
   ```

---

## Incident Response

### Service Recovery

**Trigger**: Service is down or unresponsive

**Steps**:

1. **Check service status**:
   ```bash
   docker compose -f tools/nginx/docker-compose.yaml ps
   docker compose -f tools/nginx/docker-compose.yaml logs --tail=100 <service-name>
   ```

2. **Attempt restart**:
   ```bash
   docker compose -f tools/nginx/docker-compose.yaml restart <service-name>
   ```

3. **If restart fails, check**:
   - Configuration errors: `docker compose -f tools/nginx/docker-compose.yaml exec <service> nginx -t`
   - Resource limits: `docker stats <service>`
   - Network issues: `docker network inspect nginx-internal`

4. **Force recreation** if needed:
   ```bash
   docker compose -f tools/nginx/docker-compose.yaml up -d --force-recreate <service-name>
   ```

5. **Document incident**:
   - Time of occurrence
   - Symptoms observed
   - Actions taken
   - Root cause (if identified)
   - Prevention measures

### Health Check Failure

**Trigger**: Health check endpoint returns non-200 status

**Steps**:

1. **Verify endpoint directly**:
   ```bash
   curl -v http://localhost/health
   docker compose -f tools/nginx/docker-compose.yaml exec proxy-edge curl -f http://localhost/health
   ```

2. **Check upstream connectivity**:
   ```bash
   # Test from load balancer to app
   docker compose -f tools/nginx/docker-compose.yaml exec lb-frontend curl -f http://my-programs-app:3000/health
   ```

3. **Review recent changes**:
   ```bash
   git log --oneline --since="24 hours ago" -- tools/nginx/
   ```

4. **Check for resource exhaustion**:
   ```bash
   docker stats --no-stream
   ```

5. **Escalate** if issue persists beyond 5 minutes

### DDoS Attack Response

**Trigger**: Abnormal traffic spike, rate limit violations

**Immediate Actions**:

1. **Enable aggressive rate limiting**:
   ```nginx
   # Edit production overlay
   limit_req_zone $binary_remote_addr zone=emergency:10m rate=1r/s;
   ```

2. **Block malicious IPs**:
   ```nginx
   # Add to proxy-edge/nginx.conf
   deny 192.0.2.0/24;  # Example IP range
   ```

3. **Enable connection limits**:
   ```nginx
   limit_conn_zone $binary_remote_addr zone=ddos_limit:10m;
   limit_conn ddos_limit 5;
   ```

4. **Reload configuration**:
   ```bash
   nx run nginx:reload-config
   ```

5. **Monitor**:
   ```bash
   docker compose -f tools/nginx/docker-compose.yaml logs -f proxy-edge | grep "limiting requests"
   ```

---

## Scaling Operations

### Horizontal Scaling - Adding Load Balancer Instances

**When**: Traffic exceeds single LB capacity

**Steps**:

1. **Update docker-compose.yaml**:
   ```yaml
   lb-frontend-2:
     image: my-org/nginx-lb-frontend:latest
     # Same config as lb-frontend
   ```

2. **Update edge proxy upstream**:
   ```nginx
   upstream lb_frontend {
       server lb-frontend:8080;
       server lb-frontend-2:8080;
   }
   ```

3. **Deploy changes**:
   ```bash
   docker compose -f tools/nginx/docker-compose.yaml up -d
   ```

### Vertical Scaling - Increasing Resources

**When**: Container hitting resource limits

**Steps**:

1. **Edit docker-compose.prod.yaml**:
   ```yaml
   deploy:
     resources:
       limits:
         cpus: '2.0'      # Increase from 1.0
         memory: 1024M    # Increase from 512M
   ```

2. **Recreate service**:
   ```bash
   docker compose -f tools/nginx/docker-compose.yaml -f tools/nginx/docker-compose.prod.yaml up -d <service>
   ```

---

## Backup and Recovery

### Backup Procedure

**Frequency**: Daily (automated)

**What to backup**:
- Configuration files (already in Git)
- TLS certificates
- Custom modifications

**Steps**:

1. **Backup certificates**:
   ```bash
   tar -czf nginx-certs-$(date +%Y%m%d).tar.gz tools/nginx/secrets/tls/
   ```

2. **Backup configuration** (if not in Git):
   ```bash
   tar -czf nginx-config-$(date +%Y%m%d).tar.gz tools/nginx/
   ```

3. **Store in secure location**:
   ```bash
   # Upload to S3, backup server, etc.
   aws s3 cp nginx-certs-*.tar.gz s3://backups/nginx/
   ```

### Recovery Procedure

**Trigger**: Configuration corruption, accidental deletion

**Steps**:

1. **Restore from Git**:
   ```bash
   git checkout HEAD -- tools/nginx/
   ```

2. **Restore certificates**:
   ```bash
   tar -xzf nginx-certs-YYYYMMDD.tar.gz -C /
   ```

3. **Rebuild and restart**:
   ```bash
   nx run nginx:restart
   ```

4. **Verify functionality**:
   ```bash
   nx run nginx:health-check
   ```

---

## Performance Issues

### High Latency Investigation

**Trigger**: Response times exceed SLA

**Steps**:

1. **Check NGINX metrics**:
   ```bash
   # View access logs with timing
   docker compose -f tools/nginx/docker-compose.yaml logs proxy-edge | grep "request_time"
   ```

2. **Identify slow upstreams**:
   ```bash
   # Parse logs for upstream_response_time
   docker compose -f tools/nginx/docker-compose.yaml logs lb-frontend | awk '{print $NF}' | sort -n
   ```

3. **Check upstream health**:
   ```bash
   # Directly test upstream
   docker compose exec my-programs-app curl -w "@curl-format.txt" http://localhost:3000/
   ```

4. **Optimize configuration**:
   - Increase keepalive connections
   - Adjust buffer sizes
   - Enable caching where appropriate

### High Memory Usage

**Trigger**: Container approaching memory limit

**Steps**:

1. **Identify memory hogs**:
   ```bash
   docker stats --no-stream --format "table {{.Name}}\t{{.MemUsage}}"
   ```

2. **Review buffer configuration**:
   ```nginx
   # Reduce if needed
   proxy_buffers 4 4k;  # Down from 8 8k
   ```

3. **Check for connection leaks**:
   ```bash
   docker compose -f tools/nginx/docker-compose.yaml exec proxy-edge netstat -an | grep ESTABLISHED | wc -l
   ```

4. **Increase memory limit** if justified:
   ```yaml
   # In docker-compose.prod.yaml
   memory: 1024M  # Increase as needed
   ```

---

## Contact Information

**On-Call Rotation**: [Link to PagerDuty/OpsGenie schedule]
**Escalation Path**:
1. DevOps Team Lead
2. Infrastructure Manager
3. CTO

**Related Systems**:
- Application Services: [Link to runbook]
- Database: [Link to runbook]
- Monitoring: [Link to Grafana/Datadog]

---

**Last Updated**: 2024
**Next Review Date**: Quarterly
**Document Owner**: DevOps Team
