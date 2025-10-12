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

## Step 2: Generate TLS Certificates (Optional)

For local development with HTTPS, generate self-signed certificates using the provided script:

```bash
# Using Nx (recommended)
nx run nginx:tls:generate-dev-certs

# Or directly
bash tools/nginx/scripts/tls/generate-dev-certs.sh
```

This will create certificates in `tools/nginx/secrets/tls/` with:
- `cert.pem` - Server certificate
- `key.pem` - Private key
- `fullchain.pem` - Full certificate chain
- Subject Alternative Names (SANs) for localhost, dev.local, and IP addresses

**Note:** Browsers will show security warnings for self-signed certificates. This is expected for development.

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

### Option A: HTTP Only (Development)

Start all NGINX services without TLS:

```bash
nx run nginx:serve
```

### Option B: With HTTPS (Development + TLS)

Start with TLS using self-signed certificates:

```bash
# Ensure certificates are generated (from Step 2)
nx run nginx:tls:generate-dev-certs

# Start with TLS overlay
docker compose -f tools/nginx/docker-compose.yaml -f tools/nginx/docker-compose.tls.yaml up -d
```

### Option C: Production with HTTPS

Start with production configuration and TLS:

```bash
# Ensure production certificates are configured
# Then start services
docker compose -f tools/nginx/docker-compose.yaml -f tools/nginx/docker-compose.prod.yaml -f tools/nginx/docker-compose.tls.yaml up -d
```

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

- **Edge Proxy (HTTP)**: http://localhost
- **Edge Proxy (HTTPS)**: https://localhost (if TLS configured)
- **Health Endpoint**: http://localhost/health or https://localhost/health
- **Dev Health (detailed)**: http://localhost/dev/health (development mode only)

### Testing HTTPS

If you started with TLS:

```bash
# Test HTTP endpoint
curl http://localhost/health

# Test HTTPS endpoint (use -k to ignore self-signed cert warnings)
curl -k https://localhost/health

# Use the Nx target
nx run nginx:tls:test-https

# Inspect the certificate
openssl s_client -connect localhost:443 -servername localhost
```

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

For production, use the production configuration with TLS:

```bash
# Step 1: Setup Let's Encrypt certificates (first time only)
nx run nginx:tls:setup-letsencrypt -- --domain yourdomain.com --email admin@yourdomain.com

# Step 2: Build with production settings
nx run nginx:docker:build-all --configuration=production

# Step 3: Start with production overlay and TLS
docker compose -f tools/nginx/docker-compose.yaml -f tools/nginx/docker-compose.prod.yaml -f tools/nginx/docker-compose.tls.yaml up -d
```

This will:
- Use production Docker Compose overlay
- Set `NGINX_ENV=production` environment variable
- Apply production-specific configurations (rate limiting, stricter security, etc.)
- Enable HTTPS with automatic redirect from HTTP
- Apply HSTS headers for enhanced security
- Use JSON logging format
- Configure Let's Encrypt auto-renewal

### TLS/HTTPS Management Commands

```bash
# Generate development certificates
nx run nginx:tls:generate-dev-certs

# Validate certificates
nx run nginx:tls:validate-certs

# Rotate certificates
nx run nginx:tls:rotate-certs

# Setup Let's Encrypt (production)
nx run nginx:tls:setup-letsencrypt -- --domain example.com --email admin@example.com

# Test HTTPS connectivity
nx run nginx:tls:test-https
```

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

1. **TLS/HTTPS Setup**: Configure SSL/TLS certificates for secure communication
   - Development: `nx run nginx:tls:generate-dev-certs`
   - Production: `nx run nginx:tls:setup-letsencrypt`
   - See [TLS_SETUP.md](./TLS_SETUP.md) for complete guide
2. **Integrate Applications**: Update your application Docker Compose files to use the `app-network`
3. **Set Up Monitoring**: Configure log aggregation and metrics collection
4. **Customize**: Adjust rate limits, timeouts, and other settings for your needs
5. **Documentation**: Read the full README and RUNBOOK for detailed information

## Resources

- [TLS Setup Guide](./TLS_SETUP.md) - Complete TLS/HTTPS configuration guide
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
