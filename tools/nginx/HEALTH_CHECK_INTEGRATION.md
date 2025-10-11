# Load Balancer Health Check Integration

## Overview

This document explains how the NGINX edge proxy integrates health checks for all load balancers, providing comprehensive health monitoring through a single gateway endpoint.

## Problem Statement

Previously, health checks required direct access to load balancer ports (8080, 8081, 8082) which were:
- Not exposed to the host machine (only internal Docker network)
- Required individual curl commands to each port
- Failed when ports weren't accessible from the host

## Solution

The edge proxy now acts as a health check aggregator, providing:

1. **Gateway Health Endpoints**: The edge proxy exposes health check endpoints that proxy to each load balancer
2. **Comprehensive Monitoring**: All load balancers can be checked through the gateway without direct access
3. **Simplified Health Checks**: Single command to check all components

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Edge Proxy (Port 80)                    │
│                                                                 │
│  /health              → Returns "healthy" (edge proxy only)    │
│  /health/lb-frontend  → Proxies to lb-frontend:8080/health    │
│  /health/lb-api       → Proxies to lb-api:8080/health         │
│  /health/lb-email     → Proxies to lb-email:8080/health       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
            ┌───────▼─────┐     ┌──────▼──────┐     ┌────────▼────┐
            │ LB Frontend │     │   LB API    │     │  LB Email   │
            │   :8080     │     │   :8080     │     │   :8080     │
            └─────────────┘     └─────────────┘     └─────────────┘
                (internal)          (internal)          (internal)
```

## Health Check Endpoints

### Edge Proxy Endpoints (Publicly Accessible)

- **`GET /health`** - Basic health check for edge proxy
  - Returns: `200 OK` with "healthy" text
  - Use: Quick availability check

- **`GET /health/lb-frontend`** - Frontend load balancer health
  - Proxies to: `http://lb-frontend:8080/health`
  - Returns: `200 OK` if healthy, `503 Service Unavailable` if unhealthy

- **`GET /health/lb-api`** - API load balancer health
  - Proxies to: `http://lb-api:8080/health`
  - Returns: `200 OK` if healthy, `503 Service Unavailable` if unhealthy

- **`GET /health/lb-email`** - Email load balancer health
  - Proxies to: `http://lb-email:8080/health`
  - Returns: `200 OK` if healthy, `503 Service Unavailable` if unhealthy

### Load Balancer Endpoints (Internal Only)

These endpoints are only accessible within the Docker network:

- `http://lb-frontend:8080/health`
- `http://lb-api:8080/health`
- `http://lb-email:8080/health`

## Usage

### Using Nx Commands

The `health-check` target now checks all components:

```bash
nx run nginx:health-check
```

Output:
```
=== NGINX Health Check ===

Edge Proxy Health:
healthy

Load Balancer Health Checks (via Gateway):

  - Frontend LB:
lb-frontend:healthy

  - API LB:
lb-api:healthy

  - Email LB:
lb-email:healthy

All health checks completed successfully!
```

### Manual Health Checks

Check individual components:

```bash
# Edge proxy
curl http://localhost/health

# Frontend load balancer
curl http://localhost/health/lb-frontend

# API load balancer
curl http://localhost/health/lb-api

# Email load balancer
curl http://localhost/health/lb-email
```

### Docker Healthcheck

The edge proxy's Docker healthcheck uses the comprehensive script:

```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD /usr/local/bin/health-check.sh --simple || exit 1
```

This script:
1. Checks if the edge proxy is running
2. Attempts to reach each load balancer's health endpoint
3. Returns "healthy" if all components are healthy
4. Returns "degraded" if any component is unhealthy

## Configuration Details

### NGINX Configuration

The edge proxy configuration includes:

```nginx
# Basic health check
location = /health {
    access_log off;
    return 200 "healthy\n";
    add_header Content-Type text/plain;
}

# Load balancer health proxies
location = /health/lb-frontend {
    access_log off;
    proxy_pass http://lb-frontend:8080/health;
    proxy_connect_timeout 2s;
    proxy_read_timeout 2s;
    proxy_intercept_errors on;
    error_page 502 503 504 = @lb_unhealthy;
}

# ... similar for lb-api and lb-email

# Error handler for unhealthy load balancers
location @lb_unhealthy {
    return 503 "unhealthy\n";
    add_header Content-Type text/plain;
}
```

### Health Check Script

The `/usr/local/bin/health-check.sh` script provides:

- **Simple Mode** (`--simple`): Returns "healthy" or "degraded" text
- **Detailed Mode** (default): Returns JSON with component statuses

Example JSON output:
```json
{
  "status": "healthy",
  "timestamp": "2025-10-11T23:42:23Z",
  "components": {
    "edge-proxy": {
      "status": "healthy"
    },
    "lb-frontend": {
      "status": "healthy"
    },
    "lb-api": {
      "status": "healthy"
    },
    "lb-email": {
      "status": "healthy"
    }
  }
}
```

## Benefits

1. **Simplified Monitoring**: Single entry point for all health checks
2. **Network Isolation**: Load balancers remain internal while providing health visibility
3. **Comprehensive Status**: Check all components with one command
4. **Error Handling**: Graceful handling of unhealthy load balancers
5. **Timeout Protection**: 2-second timeouts prevent hanging health checks

## Troubleshooting

### Health Check Fails for Load Balancer

If a load balancer health check fails:

1. Check if the container is running:
   ```bash
   docker compose -f tools/nginx/docker-compose.yaml ps
   ```

2. Check container logs:
   ```bash
   docker compose -f tools/nginx/docker-compose.yaml logs lb-frontend
   ```

3. Verify network connectivity:
   ```bash
   docker compose -f tools/nginx/docker-compose.yaml exec proxy-edge ping lb-frontend
   ```

4. Test direct health endpoint (from within network):
   ```bash
   docker compose -f tools/nginx/docker-compose.yaml exec proxy-edge curl http://lb-frontend:8080/health
   ```

### All Health Checks Return 503

This indicates the load balancers are not reachable. Possible causes:

- Load balancers not started
- Network misconfiguration
- Load balancers not on the same Docker network as edge proxy

Solution:
```bash
# Restart all services
nx run nginx:restart
```

## Future Enhancements

Potential improvements:

1. **Detailed JSON Endpoint**: Add `/health/detailed` endpoint returning JSON with all component statuses
2. **Application Health**: Include application-level health checks (not just load balancer availability)
3. **Metrics Integration**: Export health status as Prometheus metrics
4. **Alerting**: Integrate with alerting systems for automated notifications
