# NGINX MVP Documentation Index

This index provides a curated path through the documentation to implement the **Minimal Viable Product (MVP)** only.

## 🎯 MVP Requirements

The MVP delivers:
1. ✅ **1 NGINX Reverse Proxy** - Edge proxy with TLS termination
2. ✅ **2 NGINX Load Balancers** - Frontend and Email services
3. ✅ **3 Instances Per Service** - High availability (6 total app containers)
4. ✅ **TLS/HTTPS** - Let's Encrypt with Certbot automation
5. ✅ **Nx Integration** - Build and deployment targets
6. ✅ **Docker Compose** - Single-command deployment

## 📚 MVP Documentation Path

Follow this order to implement the MVP:

### 1. Start Here - Quick Setup
- **[MVP-QUICKSTART.md](./MVP-QUICKSTART.md)** ⭐ START HERE
  - 10-minute setup guide
  - Development and production paths
  - Common commands and troubleshooting

### 2. MVP Reference Guide
- **[MVP-README.md](./MVP-README.md)**
  - Complete MVP architecture
  - All Nx targets
  - Configuration details
  - Health checks and monitoring

### 3. Detailed Integration Guide
- **[integration/nginx-integration.md](./integration/nginx-integration.md)**
  - MVP topology explanation
  - Configuration examples (2 LBs + 3 instances each)
  - TLS setup with Certbot
  - Docker Compose configuration
  - Deployment steps

### 4. Architecture Overview
- **[architecture/overview.md](./architecture/overview.md)**
  - System architecture (MVP-focused)
  - Technology stack
  - Design patterns

## 🚫 Non-MVP Documentation (Skip for MVP)

The following documentation is NOT required for the MVP:

### Epics (Advanced Features)
- ❌ `epics/automated-tls-management/` - Advanced TLS automation
- ❌ `epics/edge-traffic-platform/` - Advanced edge features
- ❌ `epics/unified-health-monitoring/` - Advanced monitoring

### ADRs (Architectural Decisions)
- ❌ `architecture/decisions/adr-*.md` - Historical decisions (reference only)

### Extended Features
- ❌ 3rd Load Balancer (API) - Not in MVP
- ❌ Kubernetes deployment - Not in MVP
- ❌ Advanced monitoring - Not in MVP
- ❌ Advanced rate limiting - Not in MVP
- ❌ WAF integration - Not in MVP

## 🛠️ Implementation Workflow

### Phase 1: Prerequisites (5 min)
```bash
# Verify requirements
node --version    # v18+
docker --version  # 20+
nx --version      # 17+

# Install Certbot
nx run certbot:install
```

### Phase 2: Development Setup (5 min)
```bash
# Generate dev certificates
nx run nginx:tls:generate-dev-certs

# Build application images (if not already built)
nx run my-programs-app:docker-build
nx run my-nest-js-email-microservice:docker-build

# Start NGINX infrastructure
nx run nginx:up

# Verify
curl -k https://localhost
```

### Phase 3: Production Setup (10 min)
```bash
# Configure Let's Encrypt
nx run certbot:setup-letsencrypt \
  --domain yourdomain.com \
  --email your@email.com

# Update DNS to point to server
# (yourdomain.com → server IP)

# Deploy
nx run nginx:up

# Verify
curl https://yourdomain.com
```

## 📋 MVP Checklist

Use this to track your implementation:

### Infrastructure Setup
- [ ] Nx workspace configured
- [ ] Docker and Docker Compose installed
- [ ] Certbot installed (`nx run certbot:install`)

### TLS/HTTPS
- [ ] Dev certificates generated (OR)
- [ ] Let's Encrypt configured for production
- [ ] Certificates validated (`nx run nginx:tls:validate-certs`)
- [ ] Auto-renewal configured

### Application Services
- [ ] my-programs-app Docker image built
- [ ] my-nest-js-email-microservice Docker image built
- [ ] 3 instances configured per service in docker-compose

### NGINX Services
- [ ] Edge proxy built (`nx run nginx:docker-build-edge`)
- [ ] Frontend LB built (`nx run nginx:docker-build-lb-frontend`)
- [ ] Email LB built (`nx run nginx:docker-build-lb-email`)
- [ ] All services started (`nx run nginx:up`)

### Verification
- [ ] All 9 containers running (1 edge + 2 LB + 6 apps)
- [ ] HTTPS works on port 443
- [ ] HTTP redirects to HTTPS
- [ ] Load balancing distributes traffic
- [ ] Health checks pass (`/health` endpoints)
- [ ] Logs accessible (`nx run nginx:logs`)

### Production Readiness
- [ ] DNS configured correctly
- [ ] Firewall rules allow ports 80/443
- [ ] Certificate auto-renewal working
- [ ] Backup procedures documented
- [ ] Monitoring setup (optional for MVP)

## 🔧 Essential Commands Reference

```bash
# Start/Stop
nx run nginx:up                    # Start all services
nx run nginx:down                  # Stop all services
nx run nginx:logs                  # View logs

# Build
nx run nginx:docker-build-edge          # Build edge proxy
nx run nginx:docker-build-lb-frontend   # Build frontend LB
nx run nginx:docker-build-lb-email      # Build email LB

# TLS
nx run certbot:install                  # Install Certbot
nx run nginx:tls:generate-dev-certs     # Dev certificates
nx run nginx:tls:validate-certs         # Validate certs
nx run certbot:setup-letsencrypt        # Production certs

# Validation
nx run nginx:validate-config       # Validate NGINX configs
nx run nginx:health-check          # Check service health

# Operations
docker exec nginx-proxy-edge nginx -s reload     # Reload edge
docker exec nginx-lb-frontend nginx -s reload    # Reload frontend LB
docker exec nginx-lb-email nginx -s reload       # Reload email LB
```

## 📊 Architecture Diagram

```text
┌─────────────────────────────────────────────┐
│              Internet/Users                  │
└──────────────────┬──────────────────────────┘
                   │ HTTPS (443)
                   ▼
        ┌──────────────────────┐
        │   NGINX Edge Proxy   │
        │   - TLS Termination  │
        │   - Host Routing     │
        │   - Security Headers │
        └──────────┬───────────┘
                   │
      ┌────────────┴────────────┐
      │                         │
      ▼                         ▼
┌──────────────┐        ┌──────────────┐
│ Frontend LB  │        │  Email LB    │
│ (8080)       │        │  (8080)      │
└──────┬───────┘        └──────┬───────┘
       │                       │
   ┌───┼───┬───┐          ┌────┼───┬───┐
   ▼   ▼   ▼   ▼          ▼    ▼   ▼   ▼
  ┌─┐ ┌─┐ ┌─┐            ┌─┐  ┌─┐ ┌─┐
  │1│ │2│ │3│            │1│  │2│ │3│
  └─┘ └─┘ └─┘            └─┘  └─┘ └─┘
  App Instances          Email Instances
  (3000)                 (3000)
```

## 🎓 Learning Path

If you're new to NGINX or need to understand the architecture:

1. **Start**: [MVP-QUICKSTART.md](./MVP-QUICKSTART.md)
2. **Understand**: [architecture/overview.md](./architecture/overview.md)
3. **Implement**: [integration/nginx-integration.md](./integration/nginx-integration.md)
4. **Reference**: [MVP-README.md](./MVP-README.md)
5. **Troubleshoot**: See troubleshooting sections in all above docs

## 🆘 Getting Help

### Quick Troubleshooting
1. Check service status: `docker compose -f tools/nginx/docker-compose.yaml ps`
2. View logs: `nx run nginx:logs`
3. Validate configs: `nx run nginx:validate-config`
4. Check certificates: `nx run nginx:tls:validate-certs`

### Common Issues
- **Port conflicts**: Check with `lsof -i :80` and `lsof -i :443`
- **TLS errors**: Regenerate dev certs or check Let's Encrypt setup
- **Load balancer issues**: Verify upstream services are running
- **Permission errors**: Ensure Docker has necessary permissions

### Documentation
- **Operations**: `tools/nginx/RUNBOOK.md` (if needed)
- **TLS Details**: `tools/nginx/TLS_SETUP.md` (if needed)
- **Full Docs**: `tools/nginx/README.md` (comprehensive, beyond MVP)

## ✅ Success Criteria

Your MVP is complete and working when:

1. ✅ All 9 containers are healthy
2. ✅ HTTPS works: `curl https://yourdomain.com` (or localhost with -k)
3. ✅ Load balancing works: Traffic distributed across 3 instances
4. ✅ Health checks pass: `curl http://localhost/health`
5. ✅ Certificates valid and auto-renewing
6. ✅ Zero-downtime reloads work
7. ✅ Logs are accessible and useful
8. ✅ Services restart automatically on failure

## 🚀 What's Next?

After MVP is working:
- Add monitoring (Prometheus/Grafana)
- Setup log aggregation
- Configure rate limiting
- Add WAF rules
- Implement blue/green deployment
- Explore Kubernetes deployment

But for now, **focus on the MVP!** 🎯

---

**Ready to start?** → [MVP-QUICKSTART.md](./MVP-QUICKSTART.md)
