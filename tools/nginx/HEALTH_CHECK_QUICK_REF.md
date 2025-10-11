# Health Check Integration - Quick Reference

## What Changed?

### Before
- Health checks required direct access to load balancer ports (8080, 8081, 8082)
- These ports were NOT exposed to the host (only internal)
- The `nx run nginx:health-check` command failed for load balancers
- Could only check gateway health, not load balancer health

### After
- Gateway exposes health check endpoints that proxy to load balancers
- All health checks accessible through `localhost` (port 80)
- The `nx run nginx:health-check` command now works for all components
- Comprehensive health monitoring through single entry point

## New Endpoints

All accessible via `http://localhost` (no special ports needed):

| Endpoint | Purpose | Response |
|----------|---------|----------|
| `/health` | Edge proxy health | `200 OK` with "healthy" |
| `/health/lb-frontend` | Frontend LB health | `200 OK` if healthy, `503` if not |
| `/health/lb-api` | API LB health | `200 OK` if healthy, `503` if not |
| `/health/lb-email` | Email LB health | `200 OK` if healthy, `503` if not |

## Quick Start

### Check All Components
```bash
nx run nginx:health-check
```

### Check Individual Components
```bash
# Gateway
curl http://localhost/health

# Frontend Load Balancer
curl http://localhost/health/lb-frontend

# API Load Balancer  
curl http://localhost/health/lb-api

# Email Load Balancer
curl http://localhost/health/lb-email
```

## How It Works

1. **Request**: You make a health check request to the gateway (e.g., `curl localhost/health/lb-frontend`)
2. **Proxy**: The gateway proxies the request to the internal load balancer (`lb-frontend:8080/health`)
3. **Response**: The gateway returns the load balancer's response
4. **Timeout**: 2-second timeout prevents hanging requests
5. **Error Handling**: Returns 503 if load balancer is unreachable

## Benefits

✅ **Simplified Access**: All health checks via single gateway  
✅ **Network Isolation**: Load balancers stay internal  
✅ **Comprehensive Monitoring**: Check all components with one command  
✅ **Error Handling**: Graceful timeout and error responses  
✅ **No Port Conflicts**: No need to expose multiple ports  

## Files Changed

- `tools/nginx/proxy-edge/nginx.conf` - Added health proxy locations
- `tools/nginx/proxy-edge/Dockerfile` - Added health check script
- `tools/nginx/proxy-edge/scripts/health-check.sh` - New comprehensive script
- `tools/nginx/project.json` - Updated health-check task
- `tools/nginx/README.md` - Updated documentation
- `tools/nginx/HEALTH_CHECK_INTEGRATION.md` - Detailed guide (new)

## Documentation

For detailed information, see:
- [HEALTH_CHECK_INTEGRATION.md](HEALTH_CHECK_INTEGRATION.md) - Complete integration guide
- [README.md](README.md#monitoring--health-checks) - Health check section
