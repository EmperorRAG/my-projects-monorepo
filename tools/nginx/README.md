# NGINX Infrastructure for Nx Monorepo

This directory contains the complete NGINX infrastructure setup for the Nx monorepo, implementing a scalable reverse proxy and load balancing architecture.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Directory Structure](#directory-structure)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Operations](#operations)
- [Monitoring & Health Checks](#monitoring--health-checks)
- [Troubleshooting](#troubleshooting)
- [Security](#security)
- [Performance Tuning](#performance-tuning)
- [Advanced Topics](#advanced-topics)

## Overview

The NGINX infrastructure consists of:

- **1 Edge Proxy**: Entry point for all external traffic, handling TLS termination and routing
- **3 Load Balancers**: Distribute traffic to application services
  - `lb-frontend`: Next.js application traffic
  - `lb-api`: API service traffic
  - `lb-email`: Email microservice traffic

### Key Features

- 🔒 **Security**: Security headers, rate limiting, DDoS protection
- 🚀 **Performance**: Gzip compression, caching, connection pooling
- 📊 **Observability**: Structured logging, health checks, metrics-ready
- 🔄 **Scalability**: Horizontal scaling support, load balancing
- 🛠️ **Developer Experience**: Easy local development with hot reload support

## Architecture

```
                    ┌──────────────┐
                    │   Internet   │
                    └──────┬───────┘
                           │ :80, :443
                    ┌──────▼───────┐
                    │  Edge Proxy  │  (TLS termination, routing)
                    └──────┬───────┘
                           │ :8080
         ┌─────────────────┼─────────────────┐
         │                 │                 │
    ┌────▼─────┐     ┌────▼─────┐     ┌────▼─────┐
    │lb-frontend│     │  lb-api  │     │ lb-email │
    └────┬─────┘     └────┬─────┘     └────┬─────┘
         │ :3000           │ :3000           │ :3000
    ┌────▼─────┐     ┌────▼─────┐     ┌────▼─────┐
    │Next.js App│     │  NestJS  │     │  Email   │
    │           │     │  API     │     │  Service │
    └──────────┘     └──────────┘     └──────────┘
```

### Traffic Flow

1. **External Request** → Edge Proxy (:80 or :443)
2. **Edge Proxy** routes based on hostname/path → Load Balancer (:8080)
3. **Load Balancer** distributes → Application Instance (:3000)
4. **Response** follows reverse path back to client

## Directory Structure

```
tools/nginx/
├── common/                       # Shared configuration
│   ├── base.nginx.conf          # Global NGINX settings
│   └── snippets/
│       ├── headers.conf         # Security headers
│       └── logging.conf         # Logging configuration
│
├── proxy-edge/                  # Edge reverse proxy
│   ├── nginx.conf              # Main configuration
│   ├── overlays/
│   │   ├── development.conf    # Dev-specific settings
│   │   └── production.conf     # Prod-specific settings
│   └── Dockerfile
│
├── load-balancers/
│   ├── lb-frontend/            # Frontend load balancer
│   │   ├── nginx.conf
│   │   ├── overlays/
│   │   │   ├── development.conf
│   │   │   └── production.conf
│   │   └── Dockerfile
│   │
│   ├── lb-api/                 # API load balancer
│   │   ├── nginx.conf
│   │   ├── overlays/
│   │   │   ├── development.conf
│   │   │   └── production.conf
│   │   └── Dockerfile
│   │
│   └── lb-email/               # Email service load balancer
│       ├── nginx.conf
│       ├── overlays/
│       │   ├── development.conf
│       │   └── production.conf
│       └── Dockerfile
│
├── docker-compose.yaml          # Main compose file
├── docker-compose.prod.yaml     # Production overrides
├── project.json                 # Nx targets configuration
├── README.md                    # This file
└── secrets/                     # TLS certificates (gitignored)
    └── tls/
        ├── cert.pem
        └── key.pem
```

## Scripts

The NGINX infrastructure includes several utility scripts for validation and management:

### Validation Scripts

#### `validate-nginx-config.sh` (Bash)

Cross-platform Bash script for validating NGINX configurations using Docker.

**Location**: `tools/nginx/scripts/validate-nginx-config.sh`

**Usage**:
```bash
# Validate specific scenario
bash tools/nginx/scripts/validate-nginx-config.sh proxy-edge

# Validate multiple scenarios
bash tools/nginx/scripts/validate-nginx-config.sh proxy-edge lb-frontend lb-api lb-email

# Validate all scenarios
bash tools/nginx/scripts/validate-nginx-config.sh all
```

**Via Nx**:
```bash
nx run nginx:validate-config
```

**Features**:
- ✅ Cross-platform (Linux, macOS, Windows with Git Bash/WSL)
- ✅ Validates configuration syntax using Docker
- ✅ Supports multiple scenarios (proxy-edge, lb-frontend, lb-api, lb-email)
- ✅ Color-coded output for easy reading
- ✅ Detailed error reporting

**Scenarios**:
- `proxy-edge` - Validates edge proxy configuration
- `lb-frontend` - Validates frontend load balancer configuration
- `lb-api` - Validates API load balancer configuration
- `lb-email` - Validates email load balancer configuration
- `all` - Validates all scenarios

#### `validate-nginx-config.ps1` (PowerShell) [Deprecated]

The PowerShell version of the validation script is still available for backward compatibility but is deprecated in favor of the Bash version for better cross-platform support.

**Location**: `tools/nginx/scripts/validate-nginx-config.ps1`

**Note**: This script will be removed in a future version. Please migrate to the Bash version.

### Validation Script

The validation script is also available as a standalone bash script:

**Location**: `tools/nginx/validate.sh`

This script performs comprehensive infrastructure validation including:
- Directory structure checks
- Required files validation
- Docker configuration verification
- Configuration syntax validation (if Docker is available)
- Overlay structure validation

**Usage**:
```bash
bash tools/nginx/validate.sh
```

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Nx CLI installed (`npm i -g nx`)
- Monorepo dependencies installed (`pnpm install`)

### Development Setup

1. **Build all NGINX images:**
   ```bash
   nx run nginx:docker:build-all
   ```

2. **Start NGINX infrastructure:**
   ```bash
   nx run nginx:serve
   ```

3. **Verify health:**
   ```bash
   nx run nginx:health-check
   ```

4. **View logs:**
   ```bash
   nx run nginx:docker:compose-logs
   ```

### Production Setup

1. **Add TLS certificates:**
   ```bash
   mkdir -p tools/nginx/secrets/tls
   # Add your cert.pem and key.pem files
   ```

2. **Build production images:**
   ```bash
   nx run nginx:docker:build-all --configuration=production
   ```

3. **Start with production configuration:**
   ```bash
   nx run nginx:serve --configuration=production
   ```

## Configuration

### Environment Variables

Each NGINX service supports the following environment variables:

- `NGINX_ENV`: Set to `development` or `production` (default: `development`)

### Configuration Overlays

Configuration is layered using overlays:

1. **Base Configuration** (`common/base.nginx.conf`): Global settings
2. **Service Configuration** (e.g., `proxy-edge/nginx.conf`): Service-specific settings
3. **Environment Overlay** (e.g., `overlays/production.conf`): Environment-specific overrides

### Customizing Configuration

To modify configuration:

1. Edit the appropriate `.conf` file
2. Validate configuration:
   ```bash
   nx run nginx:validate-config
   ```
3. Reload without downtime:
   ```bash
   nx run nginx:reload-config
   ```

## Operations

### Nx Targets

The following Nx targets are available:

#### Build Targets
- `nx run nginx:docker:build-edge` - Build edge proxy image
- `nx run nginx:docker:build-lb-frontend` - Build frontend LB image
- `nx run nginx:docker:build-lb-api` - Build API LB image
- `nx run nginx:docker:build-lb-email` - Build email LB image
- `nx run nginx:docker:build-all` - Build all images

#### Compose Targets
- `nx run nginx:docker:compose-up` - Start all services
- `nx run nginx:docker:compose-down` - Stop all services
- `nx run nginx:docker:compose-logs` - View logs
- `nx run nginx:docker:compose-ps` - List running services

#### Management Targets
- `nx run nginx:serve` - Build and start all services
- `nx run nginx:stop` - Stop all services
- `nx run nginx:restart` - Restart all services
- `nx run nginx:validate-config` - Validate configurations
- `nx run nginx:health-check` - Check service health
- `nx run nginx:reload-config` - Reload config without downtime

### Common Operations

#### Start Infrastructure
```bash
nx run nginx:serve
```

#### Stop Infrastructure
```bash
nx run nginx:stop
```

#### Rebuild and Restart
```bash
nx run nginx:restart
```

#### View Logs (Follow Mode)
```bash
docker compose -f tools/nginx/docker-compose.yaml logs -f proxy-edge
```

#### Execute Commands in Container
```bash
# Check NGINX version
docker compose -f tools/nginx/docker-compose.yaml exec proxy-edge nginx -v

# Test configuration
docker compose -f tools/nginx/docker-compose.yaml exec proxy-edge nginx -t

# Reload configuration
docker compose -f tools/nginx/docker-compose.yaml exec proxy-edge nginx -s reload
```

## Monitoring & Health Checks

### Health Check Endpoints

Each service exposes health check endpoints:

- **Edge Proxy**: `http://localhost/health`
- **Frontend LB**: Exposed internally at `:8080/health`
- **API LB**: Exposed internally at `:8080/health`
- **Email LB**: Exposed internally at `:8080/health`

### Development Health Endpoints

In development mode, enhanced health endpoints are available:

- **Edge Proxy**: `http://localhost/dev/health` (JSON response with details)
- **Load Balancers**: Similar `/dev/health` endpoints on their respective ports

### Checking Service Status

```bash
# Quick health check
nx run nginx:health-check

# Detailed Docker status
docker compose -f tools/nginx/docker-compose.yaml ps

# Container stats
docker stats nginx-proxy-edge nginx-lb-frontend nginx-lb-api nginx-lb-email
```

### Logging

Logs are output in different formats based on environment:

- **Development**: Detailed text format to stdout/stderr
- **Production**: JSON format for log aggregation

Access logs:
```bash
# All services
docker compose -f tools/nginx/docker-compose.yaml logs -f

# Specific service
docker compose -f tools/nginx/docker-compose.yaml logs -f proxy-edge
```

## Troubleshooting

### Common Issues

#### 1. Port Already in Use

**Problem**: Error binding to port 80 or 443

**Solution**:
```bash
# Find process using port
sudo lsof -i :80
sudo lsof -i :443

# Stop the process or change NGINX port mapping in docker-compose.yaml
```

#### 2. Configuration Invalid

**Problem**: NGINX fails to start due to configuration error

**Solution**:
```bash
# Validate configuration
nx run nginx:validate-config

# Check specific service
docker compose -f tools/nginx/docker-compose.yaml exec proxy-edge nginx -t

# View error logs
docker compose -f tools/nginx/docker-compose.yaml logs proxy-edge
```

#### 3. Upstream Connection Refused

**Problem**: Load balancer cannot connect to application services

**Solution**:
- Ensure application services are running
- Verify network configuration in `docker-compose.yaml`
- Check service names match in configuration files
- Verify applications are listening on expected ports

```bash
# Check network connectivity
docker compose -f tools/nginx/docker-compose.yaml exec lb-frontend ping my-programs-app

# Verify application is listening
docker compose exec my-programs-app netstat -tuln | grep 3000
```

#### 4. SSL/TLS Issues

**Problem**: HTTPS not working or certificate errors

**Solution**:
- Ensure certificates are in `tools/nginx/secrets/tls/`
- Verify certificate paths in configuration
- Check certificate validity:
  ```bash
  openssl x509 -in tools/nginx/secrets/tls/cert.pem -text -noout
  ```
- Uncomment HTTPS server block in `proxy-edge/nginx.conf`

### Debug Mode

Enable detailed debugging:

1. Set environment to development:
   ```bash
   NGINX_ENV=development nx run nginx:serve
   ```

2. Enable debug logging by editing configuration:
   ```nginx
   error_log /dev/stderr debug;
   ```

3. Restart service:
   ```bash
   nx run nginx:restart
   ```

## Security

### Security Features

✅ **Implemented:**
- Security headers (X-Frame-Options, X-Content-Type-Options, CSP, etc.)
- Rate limiting (configurable per endpoint)
- Connection limits
- Non-root user execution
- Minimal base images (Alpine)
- Request size limits

🔒 **TLS/SSL Configuration:**
- TLS 1.2 and 1.3 only
- Strong cipher suites
- OCSP stapling
- Session tickets disabled

### Security Checklist

Before production deployment:

- [ ] Add valid TLS certificates to `tools/nginx/secrets/tls/`
- [ ] Enable HTTPS redirect in production overlay
- [ ] Configure HSTS headers (after HTTPS is stable)
- [ ] Review and adjust rate limits for your traffic patterns
- [ ] Set up firewall rules (only allow 80/443 from outside)
- [ ] Configure fail2ban or similar for additional DDoS protection
- [ ] Enable security scanning for Docker images
- [ ] Set up log monitoring and alerting
- [ ] Document incident response procedures
- [ ] Configure backup for TLS certificates

### Secrets Management

**Never commit secrets to Git!**

The `tools/nginx/secrets/` directory is gitignored. For production:

1. Use environment variables or secret management tools (Vault, AWS Secrets Manager)
2. Mount secrets as read-only volumes
3. Rotate TLS certificates regularly
4. Use certificate automation (Let's Encrypt, cert-manager)

## Performance Tuning

### Optimization Strategies

1. **Connection Pooling**
   - Keep-alive connections to upstreams (configured)
   - Connection reuse reduces overhead

2. **Caching**
   - Static assets cached aggressively
   - API responses can be cached selectively
   - Configure cache zones in production overlay

3. **Compression**
   - Gzip enabled for text-based responses
   - Adjust compression level in `base.nginx.conf`

4. **Buffer Sizes**
   - Tuned for typical request/response sizes
   - Adjust in production for your workload

### Performance Monitoring

Monitor these metrics:
- Request latency (via access logs)
- Upstream response time
- Connection count
- Cache hit ratio
- Error rates

### Resource Limits

Current Docker resource limits:

**Development:**
- CPU: 0.25-0.50 cores per service
- Memory: 128-256MB per service

**Production:**
- CPU: 0.50-1.0 cores per service
- Memory: 256-512MB per service

Adjust in `docker-compose.prod.yaml` based on traffic.

## Advanced Topics

### Horizontal Scaling

To add more application instances:

1. **Update upstream configuration** (e.g., `lb-frontend/nginx.conf`):
   ```nginx
   upstream frontend_apps {
       server my-programs-app-1:3000;
       server my-programs-app-2:3000;  # Add new instance
       server my-programs-app-3:3000;  # Add another
   }
   ```

2. **Reload configuration**:
   ```bash
   nx run nginx:reload-config
   ```

### Kubernetes Migration

To migrate to Kubernetes (future):

1. Use the same configuration files
2. Create ConfigMaps from `.conf` files
3. Create Secrets for TLS certificates
4. Convert Docker Compose services to Deployments
5. Use Ingress for external traffic routing

Reference: See `docs/nx-monorepo/nginx-integration.md` for Kubernetes setup guidance.

### Custom Logging Format

To add custom log formats, edit `common/snippets/logging.conf`:

```nginx
log_format custom '$remote_addr - $request - $status - $request_time';
access_log /dev/stdout custom;
```

### A/B Testing & Canary Deployments

Use upstream weights for traffic splitting:

```nginx
upstream frontend_apps {
    server app-v1:3000 weight=9;  # 90% traffic
    server app-v2:3000 weight=1;  # 10% traffic
}
```

### Websocket Support

WebSocket support is pre-configured in the edge proxy and load balancers:

```nginx
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection $connection_upgrade;
```

## Additional Resources

- [NGINX Official Documentation](https://nginx.org/en/docs/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nx Documentation](https://nx.dev)
- [nginx-integration.md](../../docs/nx-monorepo/nginx-integration.md) - Detailed integration guide

## Support

For issues or questions:

1. Check this README and troubleshooting section
2. Review NGINX error logs
3. Consult the main integration guide
4. Open an issue in the repository

---

**Last Updated**: 2024
**Maintainer**: Monorepo Team
