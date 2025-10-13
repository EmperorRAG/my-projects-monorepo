# NGINX MVP - Minimal Viable Product Setup

This folder contains the MVP configuration for a production-ready NGINX infrastructure.

## 📋 MVP Features

### ✅ Implemented (Non-Negotiable)

1. **1 NGINX Reverse Proxy**
   - TLS termination (HTTPS)
   - Host-based routing
   - Security headers

2. **2 NGINX Load Balancers**
   - Frontend LB (my-programs-app)
   - Email LB (my-nest-js-email-microservice)

3. **3 Instances Per Service**
   - my-programs-app: 3 instances
   - my-nest-js-email-microservice: 3 instances
   - Total: 6 application containers

4. **TLS/HTTPS**
   - Let's Encrypt integration
   - Certbot automation
   - Auto-renewal

5. **Nx Monorepo Integration**
   - Build targets
   - Deploy targets
   - Management targets

6. **Docker Compose Deployment**
   - Single command deployment
   - Service orchestration
   - Network isolation

## 🏗️ Architecture

```text
┌──────────────────────────────────────────────────┐
│                   Internet                        │
└─────────────────────┬────────────────────────────┘
                      │ HTTPS (443)
                      ▼
           ┌──────────────────────┐
           │  NGINX Edge Proxy    │
           │  - TLS Termination   │
           │  - Host Routing      │
           └──────────┬───────────┘
                      │
         ┌────────────┴────────────┐
         │                         │
         ▼                         ▼
┌─────────────────┐       ┌─────────────────┐
│ Frontend LB     │       │ Email LB        │
│ (lb-frontend)   │       │ (lb-email)      │
└────────┬────────┘       └────────┬────────┘
         │                         │
    ┌────┼────┬────┐          ┌────┼────┬────┐
    ▼    ▼    ▼    ▼          ▼    ▼    ▼    ▼
  ┌───┐┌───┐┌───┐          ┌───┐┌───┐┌───┐
  │#1 ││#2 ││#3 │          │#1 ││#2 ││#3 │
  │App││App││App│          │Eml││Eml││Eml│
  └───┘└───┘└───┘          └───┘└───┘└───┘
  my-programs-app          email-microservice
```

## 📁 Directory Structure

```
tools/nginx/
├── common/                    # Shared configuration
│   ├── base.nginx.conf       # Base settings
│   └── snippets/
│       ├── headers.conf      # Security headers
│       └── logging.conf      # Logging config
├── proxy-edge/               # Edge reverse proxy
│   ├── nginx.conf           # Main configuration
│   ├── Dockerfile
│   └── overlays/
│       ├── development.conf
│       └── production.conf
├── load-balancers/
│   ├── lb-frontend/         # Frontend load balancer
│   │   ├── nginx.conf       # 3 upstream instances
│   │   └── Dockerfile
│   └── lb-email/            # Email load balancer
│       ├── nginx.conf       # 3 upstream instances
│       └── Dockerfile
├── docker-compose.yaml       # Main orchestration
├── project.json             # Nx targets
└── secrets/
    └── tls/                 # TLS certificates (gitignored)
```

## 🚀 Quick Start

See [MVP-QUICKSTART.md](./MVP-QUICKSTART.md) for detailed setup instructions.

### One-Command Setup (Development)

```bash
# 1. Install Certbot
nx run certbot:install

# 2. Generate dev certificates
nx run nginx:tls:generate-dev-certs

# 3. Build and start everything
nx run nginx:up
```

### Production Setup

```bash
# 1. Setup Let's Encrypt
nx run certbot:setup-letsencrypt \
  --domain yourdomain.com \
  --email your@email.com

# 2. Build and deploy
nx run nginx:up
```

## 🎯 Nx Targets

All available commands:

```bash
# Build Images
nx run nginx:docker-build-edge          # Build edge proxy
nx run nginx:docker-build-lb-frontend   # Build frontend LB
nx run nginx:docker-build-lb-email      # Build email LB

# Deployment
nx run nginx:up                         # Start all services
nx run nginx:down                       # Stop all services
nx run nginx:logs                       # View logs

# TLS Management
nx run nginx:tls:generate-dev-certs     # Generate dev certificates
nx run nginx:tls:validate-certs         # Validate certificates
nx run nginx:tls:rotate-certs           # Rotate certificates

# Validation
nx run nginx:validate-config            # Validate all configs
nx run nginx:health-check               # Check service health
```

## 📝 Configuration

### Load Balancer Upstreams

**Frontend LB** (`load-balancers/lb-frontend/nginx.conf`):
```nginx
upstream frontend_apps {
  least_conn;
  server my-programs-app-1:3000;
  server my-programs-app-2:3000;
  server my-programs-app-3:3000;
}
```

**Email LB** (`load-balancers/lb-email/nginx.conf`):
```nginx
upstream email_service {
  least_conn;
  server my-nest-js-email-microservice-1:3000;
  server my-nest-js-email-microservice-2:3000;
  server my-nest-js-email-microservice-3:3000;
}
```

### Edge Proxy Routing

**Host-Based Routing** (`proxy-edge/nginx.conf`):
```nginx
map $host $lb_upstream {
  default lb_frontend;
  email.yourdomain.com lb_email;
}
```

## 🔐 TLS/HTTPS Setup

### Development (Self-Signed)

```bash
nx run nginx:tls:generate-dev-certs
```

Certificates location: `tools/nginx/secrets/tls/`

### Production (Let's Encrypt)

```bash
# Install Certbot (one-time)
nx run certbot:install

# Setup Let's Encrypt
nx run certbot:setup-letsencrypt \
  --domain yourdomain.com \
  --email your@email.com

# Verify auto-renewal
certbot renew --dry-run
```

## 🐳 Docker Compose

### Start Services

```bash
# Start all services
docker compose -f tools/nginx/docker-compose.yaml up -d

# Start with production overlay
docker compose -f tools/nginx/docker-compose.yaml \
  -f tools/nginx/docker-compose.prod.yaml up -d
```

### Service Status

```bash
# Check status
docker compose -f tools/nginx/docker-compose.yaml ps

# View logs
docker compose -f tools/nginx/docker-compose.yaml logs -f

# Stop services
docker compose -f tools/nginx/docker-compose.yaml down
```

## 🧪 Testing

### Validate Configuration

```bash
# Validate NGINX configs
docker exec nginx-proxy-edge nginx -t
docker exec nginx-lb-frontend nginx -t
docker exec nginx-lb-email nginx -t
```

### Test Endpoints

```bash
# Test HTTPS
curl -k https://localhost

# Test health endpoints
curl http://localhost/health

# Test load balancer distribution
for i in {1..10}; do curl -s http://localhost/ | grep "server"; done
```

## 🔧 Troubleshooting

### Common Issues

**Services won't start:**
```bash
docker compose -f tools/nginx/docker-compose.yaml logs
docker ps -a
```

**Port conflicts:**
```bash
lsof -i :80
lsof -i :443
```

**TLS issues:**
```bash
nx run nginx:tls:validate-certs
openssl x509 -in tools/nginx/secrets/tls/fullchain.pem -noout -dates
```

### Reload Configuration

```bash
# Zero-downtime reload
docker exec nginx-proxy-edge nginx -s reload
docker exec nginx-lb-frontend nginx -s reload
docker exec nginx-lb-email nginx -s reload
```

## 📚 Documentation

- [MVP Quick Start](./MVP-QUICKSTART.md) - 10-minute setup guide
- [Integration Guide](../../docs/tools/nginx/integration/nginx-integration.md) - Complete MVP integration
- [Architecture Overview](../../docs/tools/nginx/architecture/overview.md) - System architecture
- [TLS Setup](./TLS_SETUP.md) - Detailed TLS configuration
- [Runbook](./RUNBOOK.md) - Operations guide

## 🔄 Maintenance

### Certificate Renewal

```bash
# Manual renewal
certbot renew

# Auto-renewal is configured via systemd timer
systemctl status certbot.timer
```

### Scaling

To add more instances, edit `docker-compose.yaml` and load balancer configs:

```yaml
# Add instance
my-programs-app-4:
  image: my-programs-app:latest
  container_name: my-programs-app-4
  # ... config
```

```nginx
# Update upstream
upstream frontend_apps {
  server my-programs-app-1:3000;
  server my-programs-app-2:3000;
  server my-programs-app-3:3000;
  server my-programs-app-4:3000;  # New
}
```

## 🚦 Health Checks

All services have health check endpoints:

- Edge Proxy: `http://localhost/health`
- Frontend LB: `http://lb-frontend:8080/health`
- Email LB: `http://lb-email:8080/health`

## 📊 Monitoring

### View Metrics

```bash
# Access logs
docker exec nginx-proxy-edge tail -f /var/log/nginx/access.log

# Error logs
docker exec nginx-proxy-edge tail -f /var/log/nginx/error.log

# Resource usage
docker stats
```

## ✅ MVP Checklist

- [x] 1 NGINX reverse proxy
- [x] 2 NGINX load balancers
- [x] 3 instances per service (6 total)
- [x] TLS/HTTPS with Certbot
- [x] Nx monorepo integration
- [x] Docker Compose deployment
- [x] Health checks
- [x] Zero-downtime reloads
- [x] Auto certificate renewal
- [x] Documentation complete

## 🎉 Success Criteria

Your MVP is successful when:

1. ✅ All 9 containers are running (1 edge + 2 LB + 6 apps)
2. ✅ HTTPS works on port 443
3. ✅ Load balancing distributes traffic evenly
4. ✅ Health checks pass
5. ✅ Certificates auto-renew
6. ✅ Zero-downtime config reloads work

---

**MVP Ready!** 🚀 Start with `nx run nginx:up`
