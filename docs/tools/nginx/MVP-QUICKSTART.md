# NGINX MVP Quick Start Guide

Get the MVP NGINX infrastructure running in under 10 minutes.

## What You Get

- ✅ 1 NGINX reverse proxy (TLS termination)
- ✅ 2 NGINX load balancers (frontend + email)
- ✅ 3 instances per service (6 app containers total)
- ✅ TLS/HTTPS with Certbot
- ✅ Docker Compose deployment
- ✅ Nx integration

## Prerequisites

```bash
# Check requirements
node --version    # v18+ required
docker --version  # 20+ required
nx --version      # 17+ required
```

## Quick Start (Development)

### Step 1: Install Certbot (One-time)

```bash
nx run certbot:install
```

### Step 2: Generate Dev Certificates

```bash
nx run nginx:tls:generate-dev-certs
```

### Step 3: Build Application Images

```bash
# Build frontend (adjust if needed)
nx run my-programs-app:docker-build

# Build email service (adjust if needed)
nx run my-nest-js-email-microservice:docker-build
```

### Step 4: Start NGINX Infrastructure

```bash
nx run nginx:up
```

### Step 5: Verify

```bash
# Check all services are running
docker compose -f tools/nginx/docker-compose.yaml ps

# Test endpoints
curl -k https://localhost
curl http://localhost/health
```

## Quick Start (Production)

### Step 1: Setup Let's Encrypt

```bash
nx run certbot:setup-letsencrypt \
  --domain yourdomain.com \
  --email your@email.com
```

### Step 2: Update DNS

Point your domain to the server:
```
yourdomain.com        → <your-server-ip>
email.yourdomain.com  → <your-server-ip>
```

### Step 3: Build & Deploy

```bash
# Build all images
nx run my-programs-app:docker-build
nx run my-nest-js-email-microservice:docker-build
nx run nginx:up
```

### Step 4: Verify Production

```bash
# Test HTTPS
curl https://yourdomain.com

# Check certificate
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com
```

## Architecture

```text
Internet → NGINX Edge (TLS) → Load Balancers → App Instances

                    ┌─ Frontend LB ─┐
                    │  - App #1     │
Edge Proxy (443) ───┤  - App #2     │
                    │  - App #3     │
                    └───────────────┘
                    
                    ┌─ Email LB ────┐
Edge Proxy (443) ───┤  - Email #1   │
                    │  - Email #2   │
                    │  - Email #3   │
                    └───────────────┘
```

## Common Commands

```bash
# Start services
nx run nginx:up

# Stop services
nx run nginx:down

# View logs
nx run nginx:logs

# Validate configuration
docker exec nginx-proxy-edge nginx -t

# Reload configuration (zero downtime)
docker exec nginx-proxy-edge nginx -s reload

# Check certificate status
nx run nginx:tls:validate-certs
```

## Customization

### Add More Instances

Edit `tools/nginx/docker-compose.yaml`:

```yaml
# Add instance #4
my-programs-app-4:
  image: my-programs-app:latest
  container_name: my-programs-app-4
  environment:
    - NODE_ENV=production
    - PORT=3000
  networks:
    - app-network
```

Update load balancer config `tools/nginx/load-balancers/lb-frontend/nginx.conf`:

```nginx
upstream frontend_apps {
  server my-programs-app-1:3000;
  server my-programs-app-2:3000;
  server my-programs-app-3:3000;
  server my-programs-app-4:3000;  # Add new instance
}
```

### Change Ports

Edit `tools/nginx/docker-compose.yaml`:

```yaml
proxy-edge:
  ports:
    - "8080:80"   # HTTP on port 8080
    - "8443:443"  # HTTPS on port 8443
```

### Configure Domain Routing

Edit `tools/nginx/proxy-edge/nginx.conf`:

```nginx
map $host $lb_upstream {
  default lb_frontend;
  yourdomain.com lb_frontend;
  email.yourdomain.com lb_email;
  api.yourdomain.com lb_email;  # Add more routes
}
```

## Troubleshooting

### Services Won't Start

```bash
# Check logs
docker compose -f tools/nginx/docker-compose.yaml logs

# Check for port conflicts
lsof -i :80
lsof -i :443

# Rebuild images
nx run nginx:docker-build-edge --force
```

### TLS Issues

```bash
# Validate certificates
nx run nginx:tls:validate-certs

# Check certificate expiration
openssl x509 -in tools/nginx/secrets/tls/fullchain.pem -noout -dates

# Regenerate dev certs
rm -rf tools/nginx/secrets/tls/*
nx run nginx:tls:generate-dev-certs
```

### Load Balancer Issues

```bash
# Check upstream health
docker compose -f tools/nginx/docker-compose.yaml logs lb-frontend
docker compose -f tools/nginx/docker-compose.yaml logs lb-email

# Test upstream directly
docker exec -it my-programs-app-1 curl localhost:3000
docker exec -it my-nest-js-email-microservice-1 curl localhost:3000
```

### Performance Issues

```bash
# Check resource usage
docker stats

# Scale services
docker compose -f tools/nginx/docker-compose.yaml up -d --scale my-programs-app-1=5

# View NGINX access logs
docker exec nginx-proxy-edge tail -f /var/log/nginx/access.log
```

## Next Steps

- [ ] Configure monitoring (Prometheus/Grafana)
- [ ] Setup log aggregation
- [ ] Add WAF rules
- [ ] Configure rate limiting
- [ ] Setup backup/restore procedures
- [ ] Implement blue/green deployment

## Support

- Documentation: `docs/tools/nginx/`
- Issues: GitHub Issues
- Runbook: `tools/nginx/RUNBOOK.md`

---

**Ready in 10 minutes!** 🚀
