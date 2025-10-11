# Quick Start Guide - NGINX Infrastructure

Get the NGINX infrastructure up and running in 5 minutes!

## Prerequisites

- Docker and Docker Compose installed
- Nx CLI installed (`npm i -g nx` or use `npx`)
- Repository cloned and dependencies installed

## Step 1: Validate Setup

Run the validation script to ensure everything is configured correctly:

```bash
./tools/nginx/validate.sh
```

You should see:
```
✓ Validation completed successfully!
```

Optionally, validate NGINX configurations using the cross-platform Bash script:

```bash
# Validate all NGINX scenarios
bash tools/nginx/scripts/validate-nginx-config.sh all

# Or via Nx
nx run nginx:validate-config
```

## Step 2: (Optional) Generate Self-Signed Certificates

For local development with HTTPS, generate self-signed certificates:

```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout tools/nginx/secrets/tls/key.pem \
  -out tools/nginx/secrets/tls/cert.pem \
  -subj "/CN=localhost"
```

## Step 3: Build Docker Images

Build all NGINX Docker images:

```bash
nx run nginx:docker:build-all
```

This will build:
- Edge proxy
- Frontend load balancer
- API load balancer
- Email load balancer

Expected output:
```
✔  nx run nginx:docker:build-edge
✔  nx run nginx:docker:build-lb-frontend
✔  nx run nginx:docker:build-lb-api
✔  nx run nginx:docker:build-lb-email
```

## Step 4: Start Services

Start all NGINX services:

```bash
nx run nginx:serve
```

This will:
1. Build all images (if not already built)
2. Start Docker Compose
3. Create networks
4. Launch all containers

Expected output:
```
[+] Running 4/4
 ✔ Container nginx-lb-frontend  Started
 ✔ Container nginx-lb-api       Started
 ✔ Container nginx-lb-email     Started
 ✔ Container nginx-proxy-edge   Started
```

## Step 5: Verify Health

Check that all services are healthy:

```bash
nx run nginx:health-check
```

Or manually:
```bash
curl http://localhost/health
```

Expected response:
```
healthy
```

## Step 6: View Logs

Watch the logs in real-time:

```bash
nx run nginx:docker:compose-logs
```

Or for a specific service:
```bash
docker compose -f tools/nginx/docker-compose.yaml logs -f proxy-edge
```

## Step 7: Access Services

The NGINX infrastructure is now running:

- **Edge Proxy**: http://localhost (HTTP) or https://localhost (HTTPS if certs configured)
- **Health Endpoint**: http://localhost/health
- **Dev Health (detailed)**: http://localhost/dev/health (development mode only)

## Common Commands

### Stop Services
```bash
nx run nginx:stop
```

### Restart Services
```bash
nx run nginx:restart
```

### Rebuild and Restart
```bash
nx run nginx:docker:build-all
nx run nginx:restart
```

### Reload Configuration (Zero Downtime)
```bash
nx run nginx:reload-config
```

### View Container Status
```bash
docker compose -f tools/nginx/docker-compose.yaml ps
```

### Execute Commands in Container
```bash
# Check NGINX version
docker compose -f tools/nginx/docker-compose.yaml exec proxy-edge nginx -v

# Test configuration
docker compose -f tools/nginx/docker-compose.yaml exec proxy-edge nginx -t
```

## Production Deployment

For production, use the production configuration:

```bash
# Build with production settings
nx run nginx:docker:build-all --configuration=production

# Start with production overlay
nx run nginx:serve --configuration=production
```

This will:
- Use production Docker Compose overlay
- Set `NGINX_ENV=production` environment variable
- Apply production-specific configurations (rate limiting, stricter security, etc.)
- Use JSON logging format

## Troubleshooting

### Port Already in Use

If port 80 or 443 is already in use:

1. Find and stop the conflicting process:
   ```bash
   sudo lsof -i :80
   sudo lsof -i :443
   ```

2. Or change the port mapping in `docker-compose.yaml`:
   ```yaml
   ports:
     - "8080:80"  # Change from 80:80
   ```

### Configuration Error

If services fail to start:

1. Check logs:
   ```bash
   docker compose -f tools/nginx/docker-compose.yaml logs proxy-edge
   ```

2. Validate configuration using the Bash script:
   ```bash
   # Validate specific scenario
   bash tools/nginx/scripts/validate-nginx-config.sh proxy-edge
   
   # Validate all scenarios
   bash tools/nginx/scripts/validate-nginx-config.sh all
   
   # Or via Nx
   nx run nginx:validate-config
   ```

3. Test configuration in container:
   ```bash
   docker compose -f tools/nginx/docker-compose.yaml exec proxy-edge nginx -t
   ```

### Connection Refused

If load balancers can't reach applications:

1. Ensure applications are running
2. Check network configuration
3. Verify service names in configuration match container names

## Next Steps

1. **Integrate Applications**: Update your application Docker Compose files to use the `app-network`
2. **Configure TLS**: Add production TLS certificates for HTTPS
3. **Set Up Monitoring**: Configure log aggregation and metrics collection
4. **Customize**: Adjust rate limits, timeouts, and other settings for your needs
5. **Documentation**: Read the full README and RUNBOOK for detailed information

## Resources

- [Full Documentation](./README.md) - Complete setup and usage guide
- [Operations Runbook](./RUNBOOK.md) - Operational procedures and incident response
- [NGINX Integration Guide](../../docs/nx-monorepo/nginx-integration.md) - Detailed integration guide
- [NGINX Official Docs](https://nginx.org/en/docs/) - NGINX documentation

## Support

For issues or questions:
1. Check the [README](./README.md) troubleshooting section
2. Review NGINX error logs
3. Consult the [RUNBOOK](./RUNBOOK.md)
4. Open an issue in the repository

---

**Happy proxying! 🚀**
