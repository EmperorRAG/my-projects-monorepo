# =================================================================================================
# Certbot-NGINX Integration Guide
# =================================================================================================
#
# Complete, comprehensive guide for integrating Certbot with NGINX for automated SSL/TLS
# certificate management in production environments.
#
# This guide covers everything from initial setup to advanced configurations, troubleshooting,
# and best practices for maintaining a secure, highly-available HTTPS infrastructure.
#
# =================================================================================================

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Prerequisites](#prerequisites)
4. [Quick Start](#quick-start)
5. [Detailed Setup](#detailed-setup)
6. [Configuration](#configuration)
7. [Certificate Management](#certificate-management)
8. [Automation & Renewal](#automation--renewal)
9. [Monitoring & Alerts](#monitoring--alerts)
10. [Troubleshooting](#troubleshooting)
11. [Best Practices](#best-practices)
12. [Advanced Topics](#advanced-topics)
13. [Security Hardening](#security-hardening)
14. [Performance Optimization](#performance-optimization)
15. [Disaster Recovery](#disaster-recovery)

---

## Overview

### What is This Integration?

This comprehensive integration combines:
- **Certbot**: Free, automated SSL/TLS certificate management from Let's Encrypt
- **NGINX**: High-performance web server and reverse proxy with TLS termination
- **Docker**: Containerized deployment for consistency and portability
- **Nx**: Monorepo task runner for streamlined operations

### Key Features

✅ **Fully Automated** - Zero-touch certificate acquisition and renewal  
✅ **Production Ready** - Battle-tested configuration for high-traffic sites  
✅ **Highly Available** - Graceful certificate rotation with zero downtime  
✅ **Secure by Default** - Modern TLS 1.2/1.3, strong ciphers, HSTS, OCSP stapling  
✅ **Docker Native** - Containerized services with shared volumes  
✅ **Nx Integrated** - Simple commands for all operations  
✅ **Well Documented** - Comprehensive guides, examples, and troubleshooting  

### How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                       Internet Traffic                          │
│                              ↓                                   │
│                      Port 80 (HTTP)                             │
│                      Port 443 (HTTPS)                           │
└─────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                     NGINX Edge Proxy                            │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  • TLS Termination                                   │      │
│  │  • ACME Challenge Handling (/.well-known/)           │      │
│  │  • HTTP → HTTPS Redirect                             │      │
│  │  • Certificate Loading from Shared Volume            │      │
│  └──────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
                               ↓
                    Shared Volumes (Docker)
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                        Certbot Service                          │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  • Certificate Acquisition (Initial)                 │      │
│  │  • Automatic Renewal (Twice Daily)                   │      │
│  │  • ACME Challenge Response                           │      │
│  │  • Post-Renewal NGINX Reload                         │      │
│  └──────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
                               ↓
                        Let's Encrypt CA
```

---

## Architecture

### Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          Docker Network: certbot-nginx                  │
│                                                                           │
│  ┌─────────────────────┐              ┌──────────────────────────────┐  │
│  │   NGINX Container   │              │      Certbot Containers      │  │
│  │                     │              │                              │  │
│  │  • Port 80 (HTTP)   │◄────────────►│  ┌────────────────────────┐ │  │
│  │  • Port 443 (HTTPS) │              │  │  certbot-acquire       │ │  │
│  │  • TLS Termination  │              │  │  (One-time)            │ │  │
│  │  • Certificate Read │              │  └────────────────────────┘ │  │
│  └─────────────────────┘              │                              │  │
│           │                            │  ┌────────────────────────┐ │  │
│           │                            │  │  certbot-renew         │ │  │
│           │                            │  │  (Continuous)          │ │  │
│           │                            │  │  • Renewal checks      │ │  │
│           │                            │  │  • NGINX reload hook   │ │  │
│           │                            │  └────────────────────────┘ │  │
│           │                            └──────────────────────────────┘  │
│           │                                         │                     │
│           │                                         │                     │
│           ▼                                         ▼                     │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                    Shared Docker Volumes                         │    │
│  │                                                                   │    │
│  │  • letsencrypt-config: /etc/letsencrypt (certificates)          │    │
│  │  • letsencrypt-lib: /var/lib/letsencrypt (runtime data)         │    │
│  │  • certbot-webroot: /var/www/certbot (ACME challenges)          │    │
│  │  • nginx-logs: /var/log/nginx (access & error logs)             │    │
│  └─────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
```

### Data Flow: Certificate Acquisition

1. **Initial Request**: Certbot requests certificate from Let's Encrypt
2. **ACME Challenge**: Let's Encrypt issues HTTP-01 challenge
3. **Challenge File**: Certbot writes challenge file to `/var/www/certbot/.well-known/acme-challenge/`
4. **Validation**: Let's Encrypt accesses `http://yourdomain.com/.well-known/acme-challenge/<token>`
5. **NGINX Serves**: NGINX serves the challenge file from shared volume
6. **Verification**: Let's Encrypt verifies domain ownership
7. **Issuance**: Certificate issued and stored in `/etc/letsencrypt/live/<domain>/`
8. **NGINX Reload**: NGINX reloaded to use new certificate

### Data Flow: Certificate Renewal

1. **Scheduled Check**: Certbot runs renewal check (twice daily)
2. **Expiry Check**: Checks if certificate expires within 30 days
3. **Renewal Request**: If needed, initiates renewal process (same as acquisition)
4. **Post-Hook**: After successful renewal, runs deploy hook
5. **NGINX Reload**: Hook executes `docker exec nginx-certbot-proxy nginx -s reload`
6. **Zero Downtime**: NGINX gracefully reloads with new certificate

---

## Prerequisites

### System Requirements

| Requirement | Minimum | Recommended |
|------------|---------|-------------|
| **OS** | Linux (any distribution) | Ubuntu 22.04 LTS |
| **Docker** | 20.10+ | Latest stable |
| **Docker Compose** | 2.0+ | Latest stable |
| **RAM** | 512 MB | 1 GB+ |
| **Disk Space** | 1 GB | 5 GB+ |
| **Network** | Ports 80, 443 open | Firewall configured |

### Domain Requirements

- ✅ **Domain Name**: Fully qualified domain name (FQDN)
- ✅ **DNS Configuration**: A/AAAA records pointing to your server
- ✅ **Propagation**: DNS changes fully propagated (use `dig` or `nslookup` to verify)
- ✅ **Accessibility**: Ports 80 and 443 accessible from the internet
- ✅ **No Conflicts**: No other services using ports 80/443

### Software Requirements

- ✅ **Docker**: Installed and running (`docker --version`)
- ✅ **Docker Compose**: Installed (`docker compose version`)
- ✅ **Git**: For repository access
- ✅ **Nx** (optional): For simplified commands (`nx --version`)
- ✅ **curl**: For testing (`curl --version`)

### Validation Checklist

Before proceeding, verify:

```bash
# Check Docker
docker --version && docker info

# Check Docker Compose
docker compose version

# Check DNS resolution
dig yourdomain.com +short
nslookup yourdomain.com

# Check port accessibility (from external machine)
curl http://yourdomain.com
curl https://yourdomain.com

# Check firewall rules
sudo ufw status  # Ubuntu/Debian
sudo firewall-cmd --list-all  # CentOS/RHEL
```

---

## Quick Start

### One-Command Setup

For the impatient (production setup in 5 minutes):

```bash
# Navigate to workspace root
cd /path/to/my-projects-monorepo

# Run automated setup
bash tools/certbot/scripts/setup-integration.sh \
  --domain yourdomain.com \
  --email your@email.com
```

That's it! The script will:
1. ✅ Validate prerequisites
2. ✅ Create necessary directories
3. ✅ Start NGINX (HTTP only)
4. ✅ Acquire certificates from Let's Encrypt
5. ✅ Configure NGINX with TLS
6. ✅ Setup automatic renewal
7. ✅ Run validation tests

### Verify It Works

```bash
# Test HTTP
curl http://yourdomain.com/health

# Test HTTPS
curl https://yourdomain.com/health

# Check certificate
echo | openssl s_client -connect yourdomain.com:443 -servername yourdomain.com 2>/dev/null | openssl x509 -noout -dates
```

---

## Detailed Setup

### Step 1: Prepare Environment

```bash
# Clone repository (if not already done)
git clone https://github.com/EmperorRAG/my-projects-monorepo.git
cd my-projects-monorepo

# Create volume directories
mkdir -p volumes/{letsencrypt,letsencrypt-lib,certbot-webroot,nginx-logs}

# Set permissions
chmod -R 755 volumes/certbot-webroot
```

### Step 2: Configure Environment Variables

Create `.env.certbot` file:

```bash
cat > .env.certbot << EOF
# Let's Encrypt Configuration
CERTBOT_EMAIL=your@email.com
CERTBOT_DOMAINS=yourdomain.com,www.yourdomain.com
CERTBOT_STAGING=false  # Set to true for testing

# Certificate Configuration
CERTBOT_RSA_KEY_SIZE=4096
CERTBOT_RENEW_HOOK=docker exec nginx-certbot-proxy nginx -s reload

# Paths
LETSENCRYPT_DIR=/etc/letsencrypt
WEBROOT_PATH=/var/www/certbot
EOF
```

### Step 3: Start NGINX (HTTP Only)

```bash
# Start NGINX without TLS (for initial ACME challenge)
docker compose -f docker-compose.certbot-nginx.yaml up -d nginx

# Verify NGINX is running
docker ps | grep nginx-certbot-proxy

# Test HTTP access
curl http://localhost/health
```

### Step 4: Acquire Initial Certificates

```bash
# Obtain certificate using HTTP-01 challenge
CERTBOT_EMAIL=your@email.com \
CERTBOT_DOMAINS=yourdomain.com,www.yourdomain.com \
docker compose -f docker-compose.certbot-nginx.yaml run --rm certbot-acquire

# Verify certificates
ls -la volumes/letsencrypt/live/yourdomain.com/
```

Expected output:
```
cert.pem -> ../../archive/yourdomain.com/cert1.pem
chain.pem -> ../../archive/yourdomain.com/chain1.pem
fullchain.pem -> ../../archive/yourdomain.com/fullchain1.pem
privkey.pem -> ../../archive/yourdomain.com/privkey1.pem
```

### Step 5: Configure NGINX for TLS

```bash
# Restart NGINX to load TLS configuration
docker compose -f docker-compose.certbot-nginx.yaml restart nginx

# Wait for NGINX to reload
sleep 3

# Test HTTPS
curl -k https://localhost/health
```

### Step 6: Setup Automatic Renewal

```bash
# Start renewal service
docker compose -f docker-compose.certbot-nginx.yaml up -d certbot-renew

# Verify renewal service is running
docker ps | grep certbot-renew

# Check renewal logs
docker compose -f docker-compose.certbot-nginx.yaml logs -f certbot-renew
```

### Step 7: Validation

```bash
# Test certificate
echo | openssl s_client -connect localhost:443 -servername yourdomain.com 2>/dev/null | openssl x509 -noout -text

# Check expiration
docker compose -f docker-compose.certbot-nginx.yaml exec certbot-renew certbot certificates

# Test renewal (dry run)
docker compose -f docker-compose.certbot-nginx.yaml exec certbot-renew certbot renew --dry-run
```

---

## Configuration

### NGINX Configuration

#### Enable ACME Challenge Support

Add to your NGINX server block:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    # Include ACME challenge configuration
    include /etc/nginx/common/acme-challenge.conf;
    
    # Redirect all other HTTP traffic to HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}
```

#### TLS Server Block

```nginx
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yourdomain.com;
    
    # Let's Encrypt Certificates
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # SSL Configuration (Modern, Secure)
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers off;
    
    # OCSP Stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    ssl_trusted_certificate /etc/letsencrypt/live/yourdomain.com/chain.pem;
    resolver 8.8.8.8 8.8.4.4 valid=300s;
    resolver_timeout 5s;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Your application configuration
    location / {
        proxy_pass http://backend;
        include /etc/nginx/common/proxy.conf;
    }
}
```

### Certbot Configuration

#### Custom Renewal Hooks

Create custom hooks for deployment:

```bash
# Create post-renewal hook
cat > tools/certbot/scripts/renewal-hook.sh << 'EOF'
#!/bin/bash
# Post-renewal hook

# Reload NGINX
docker exec nginx-certbot-proxy nginx -s reload

# Send notification (optional)
curl -X POST https://hooks.slack.com/... \
  -d '{"text":"SSL certificate renewed successfully"}'

# Log renewal
echo "$(date): Certificate renewed" >> /var/log/certbot-renewals.log
EOF

chmod +x tools/certbot/scripts/renewal-hook.sh
```

#### Environment-Specific Configuration

```bash
# Development (.env.development)
CERTBOT_STAGING=true
CERTBOT_DOMAINS=dev.yourdomain.com

# Staging (.env.staging)
CERTBOT_STAGING=true
CERTBOT_DOMAINS=staging.yourdomain.com

# Production (.env.production)
CERTBOT_STAGING=false
CERTBOT_DOMAINS=yourdomain.com,www.yourdomain.com,api.yourdomain.com
```

---

## Certificate Management

### View Certificate Information

```bash
# List all certificates
docker compose -f docker-compose.certbot-nginx.yaml exec certbot-renew certbot certificates

# View specific certificate details
openssl x509 -in volumes/letsencrypt/live/yourdomain.com/cert.pem -text -noout

# Check expiration date
openssl x509 -in volumes/letsencrypt/live/yourdomain.com/cert.pem -noout -dates
```

### Manual Renewal

```bash
# Force renewal (even if not due)
docker compose -f docker-compose.certbot-nginx.yaml exec certbot-renew certbot renew --force-renewal

# Renew specific domain
docker compose -f docker-compose.certbot-nginx.yaml exec certbot-renew certbot renew --cert-name yourdomain.com
```

### Add Additional Domains

```bash
# Expand existing certificate
docker compose -f docker-compose.certbot-nginx.yaml run --rm certbot-acquire \
  certonly --webroot --webroot-path=/var/www/certbot \
  --email your@email.com \
  --agree-tos \
  --expand \
  -d yourdomain.com \
  -d www.yourdomain.com \
  -d api.yourdomain.com \
  -d new-subdomain.yourdomain.com
```

### Certificate Backup

```bash
# Backup certificates
tar -czf letsencrypt-backup-$(date +%Y%m%d).tar.gz volumes/letsencrypt

# Restore from backup
tar -xzf letsencrypt-backup-20241012.tar.gz

# Sync to remote backup
rsync -avz volumes/letsencrypt/ backup-server:/backups/letsencrypt/
```

---

## Automation & Renewal

### Renewal Schedule

Certificates are checked twice daily:
- **Midnight (00:00)**: First renewal check
- **Noon (12:00)**: Second renewal check

Renewals occur automatically when certificates are within 30 days of expiration.

### Customize Renewal Schedule

Edit `docker-compose.certbot-nginx.yaml`:

```yaml
certbot-renew:
  command: >
    -c "
    trap exit TERM;
    while :; do
      certbot renew --webroot --webroot-path=/var/www/certbot --deploy-hook 'docker exec nginx-certbot-proxy nginx -s reload';
      sleep 6h &  # Change to desired interval (e.g., 6h, 12h, 24h)
      wait $${!};
    done"
```

### Monitoring Renewal

```bash
# View renewal service logs
docker compose -f docker-compose.certbot-nginx.yaml logs -f certbot-renew

# Check last renewal attempt
grep -i "renew" volumes/letsencrypt/renewal/*.conf

# Test renewal without making changes
docker compose -f docker-compose.certbot-nginx.yaml exec certbot-renew certbot renew --dry-run
```

---

## Monitoring & Alerts

### Health Checks

```bash
# NGINX health
curl -f http://localhost/health && echo "NGINX OK" || echo "NGINX FAIL"

# Certificate expiration check
openssl x509 -checkend 2592000 -noout -in volumes/letsencrypt/live/yourdomain.com/cert.pem && echo "Valid for 30+ days" || echo "Expires soon!"
```

### Prometheus Metrics

Create `/etc/nginx/metrics.conf`:

```nginx
location /metrics {
    stub_status on;
    access_log off;
    allow 127.0.0.1;
    deny all;
}
```

### Alert Script

```bash
#!/bin/bash
# Certificate expiration alert

CERT_FILE="volumes/letsencrypt/live/yourdomain.com/cert.pem"
DAYS_THRESHOLD=14

EXPIRE_DATE=$(openssl x509 -enddate -noout -in "$CERT_FILE" | cut -d= -f2)
EXPIRE_SECONDS=$(date -d "$EXPIRE_DATE" +%s)
NOW_SECONDS=$(date +%s)
DAYS_LEFT=$(( (EXPIRE_SECONDS - NOW_SECONDS) / 86400 ))

if [ $DAYS_LEFT -lt $DAYS_THRESHOLD ]; then
    echo "WARNING: Certificate expires in $DAYS_LEFT days!"
    # Send alert (email, Slack, PagerDuty, etc.)
fi
```

---

## Troubleshooting

### Common Issues

#### Issue 1: ACME Challenge Fails

**Symptoms:**
```
Failed authorization procedure. yourdomain.com (http-01): urn:ietf:params:acme:error:unauthorized
```

**Solutions:**
1. Verify domain DNS points to your server:
   ```bash
   dig yourdomain.com +short
   ```

2. Check port 80 is accessible:
   ```bash
   curl -I http://yourdomain.com/.well-known/acme-challenge/test
   ```

3. Verify webroot permissions:
   ```bash
   ls -la volumes/certbot-webroot/.well-known/acme-challenge/
   chmod -R 755 volumes/certbot-webroot
   ```

4. Check NGINX configuration:
   ```bash
   docker compose -f docker-compose.certbot-nginx.yaml exec nginx nginx -t
   ```

#### Issue 2: Certificate Not Loading in NGINX

**Symptoms:**
```
nginx: [emerg] cannot load certificate "/etc/letsencrypt/live/yourdomain.com/fullchain.pem"
```

**Solutions:**
1. Verify certificate files exist:
   ```bash
   docker compose -f docker-compose.certbot-nginx.yaml exec nginx ls -la /etc/letsencrypt/live/yourdomain.com/
   ```

2. Check volume mounts:
   ```bash
   docker inspect nginx-certbot-proxy | grep -A 10 Mounts
   ```

3. Restart NGINX:
   ```bash
   docker compose -f docker-compose.certbot-nginx.yaml restart nginx
   ```

#### Issue 3: Renewal Not Working

**Symptoms:**
```
certbot renew fails silently
```

**Solutions:**
1. Check renewal service logs:
   ```bash
   docker compose -f docker-compose.certbot-nginx.yaml logs certbot-renew
   ```

2. Test renewal manually:
   ```bash
   docker compose -f docker-compose.certbot-nginx.yaml exec certbot-renew certbot renew --dry-run
   ```

3. Verify renewal hook:
   ```bash
   docker compose -f docker-compose.certbot-nginx.yaml exec certbot-renew cat /etc/letsencrypt/renewal/yourdomain.com.conf
   ```

#### Issue 4: Rate Limit Exceeded

**Symptoms:**
```
Error: urn:ietf:params:acme:error:rateLimited
```

**Solutions:**
1. Use staging for testing:
   ```bash
   CERTBOT_STAGING=true docker compose -f docker-compose.certbot-nginx.yaml run --rm certbot-acquire
   ```

2. Wait for rate limit reset (1 week for production)

3. Check current limits:
   - 50 certificates per registered domain per week
   - 5 duplicate certificates per week

### Debug Mode

Enable verbose logging:

```bash
# Run certbot with debug output
docker compose -f docker-compose.certbot-nginx.yaml run --rm certbot-acquire certonly \
  --webroot --webroot-path=/var/www/certbot \
  -d yourdomain.com \
  --debug \
  --verbose
```

---

## Best Practices

### Security

1. **Always use HTTPS in production**
   - Redirect HTTP to HTTPS
   - Enable HSTS with preload
   - Use strong cipher suites

2. **Certificate Management**
   - Use 4096-bit RSA keys
   - Enable OCSP stapling
   - Backup certificates regularly

3. **Access Control**
   - Restrict NGINX metrics endpoint
   - Limit Docker socket access
   - Use read-only volume mounts where possible

### Reliability

1. **Monitor certificate expiration**
   - Set up alerts for certificates expiring in < 30 days
   - Test renewal process regularly
   - Maintain certificate backups

2. **High Availability**
   - Use health checks
   - Implement graceful shutdown
   - Test failover scenarios

3. **Logging**
   - Centralize logs
   - Set up log rotation
   - Monitor for errors

### Performance

1. **TLS Optimization**
   - Enable HTTP/2
   - Use session resumption
   - Implement OCSP stapling

2. **Caching**
   - Cache static assets
   - Use CDN for global distribution
   - Implement browser caching

---

## Advanced Topics

### Wildcard Certificates

Requires DNS-01 challenge:

```bash
# Install DNS plugin (example: Cloudflare)
docker compose -f docker-compose.certbot-nginx.yaml run --rm certbot-acquire \
  certonly \
  --dns-cloudflare \
  --dns-cloudflare-credentials /path/to/cloudflare.ini \
  -d "*.yourdomain.com" \
  -d yourdomain.com
```

### Multi-Domain Setup

```bash
# Single certificate for multiple domains
docker compose -f docker-compose.certbot-nginx.yaml run --rm certbot-acquire \
  certonly --webroot --webroot-path=/var/www/certbot \
  -d domain1.com -d www.domain1.com \
  -d domain2.com -d www.domain2.com \
  -d domain3.com
```

### Load Balancing with Multiple NGINX Instances

```yaml
# docker-compose.yaml
services:
  nginx-1:
    extends:
      file: docker-compose.certbot-nginx.yaml
      service: nginx
    volumes:
      - letsencrypt-config:/etc/letsencrypt:ro

  nginx-2:
    extends:
      file: docker-compose.certbot-nginx.yaml
      service: nginx
    volumes:
      - letsencrypt-config:/etc/letsencrypt:ro

  load-balancer:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - nginx-1
      - nginx-2
```

---

## Security Hardening

### TLS Configuration

```nginx
# Modern TLS configuration (2024 standards)
ssl_protocols TLSv1.3;
ssl_ciphers 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
ssl_prefer_server_ciphers off;

# Session settings
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;
ssl_session_tickets off;

# OCSP Stapling
ssl_stapling on;
ssl_stapling_verify on;

# DH Parameters
ssl_dhparam /etc/nginx/tls/dhparam.pem;
```

### Security Headers

```nginx
# Security headers
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;
```

---

## Performance Optimization

### HTTP/2 and HTTP/3

```nginx
# Enable HTTP/2
listen 443 ssl http2;

# Enable HTTP/3 (if supported)
listen 443 quic reuseport;
add_header Alt-Svc 'h3=":443"; ma=86400';
```

### Connection Optimization

```nginx
# Keepalive
keepalive_timeout 65;
keepalive_requests 100;

# Buffers
client_body_buffer_size 16K;
client_max_body_size 16M;
```

---

## Disaster Recovery

### Backup Strategy

```bash
#!/bin/bash
# Backup script

BACKUP_DIR="/backups/certbot-nginx/$(date +%Y%m%d)"
mkdir -p "$BACKUP_DIR"

# Backup certificates
tar -czf "$BACKUP_DIR/letsencrypt.tar.gz" volumes/letsencrypt

# Backup NGINX config
tar -czf "$BACKUP_DIR/nginx-config.tar.gz" tools/nginx

# Backup environment files
cp .env.certbot "$BACKUP_DIR/"

# Upload to S3 (optional)
aws s3 sync "$BACKUP_DIR" s3://my-backup-bucket/certbot-nginx/$(date +%Y%m%d)/
```

### Recovery Procedure

```bash
#!/bin/bash
# Recovery script

# Stop services
docker compose -f docker-compose.certbot-nginx.yaml down

# Restore certificates
tar -xzf letsencrypt-backup.tar.gz -C volumes/

# Restore NGINX config
tar -xzf nginx-config-backup.tar.gz -C tools/

# Restart services
docker compose -f docker-compose.certbot-nginx.yaml up -d

# Verify
curl https://yourdomain.com/health
```

---

## Nx Integration

### Available Commands

```bash
# Installation
nx run certbot:install                    # Install certbot
nx run certbot:install:dry-run            # Preview installation

# Certificate Management
nx run certbot:setup-integration          # Full setup with NGINX
nx run certbot:setup-letsencrypt          # Setup Let's Encrypt
nx run certbot:validate-config            # Validate configuration

# Docker Operations
nx run certbot:docker:build               # Build Docker image
nx run certbot:docker:certonly            # Obtain certificates
nx run certbot:docker:renew               # Renew certificates
nx run certbot:docker:up                  # Start services
nx run certbot:docker:down                # Stop services
nx run certbot:docker:logs                # View logs

# Testing
nx run certbot:test                       # Run test suite
```

---

## Conclusion

This comprehensive guide covers all aspects of Certbot-NGINX integration. For additional help:

- 📖 **Documentation**: See `tools/certbot/README.md`
- 🔧 **Scripts**: Check `tools/certbot/scripts/`
- 🐛 **Issues**: Report on GitHub
- 💬 **Support**: Community forums

**Remember**: Always test in staging before deploying to production!

---

*Last Updated: October 2024*  
*Version: 2.0*  
*Maintained by: DevOps Team*
