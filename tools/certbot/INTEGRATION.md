# Certbot Integration Guide

This guide explains how to integrate the certbot tool with other services in the monorepo, particularly NGINX.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Certbot Tool (tools/certbot)                                  │
│  ┌──────────────────────────────────────────────────────┐    │
│  │ - OS Auto-Detection                                  │    │
│  │ - Certificate Acquisition                            │    │
│  │ - Certificate Renewal                                │    │
│  │ - Docker Support                                     │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                                 │
│                           ↓                                     │
│                    (Certificates)                               │
│                           ↓                                     │
│                                                                 │
│  NGINX Tool (tools/nginx)                                      │
│  ┌──────────────────────────────────────────────────────┐    │
│  │ - TLS Termination                                    │    │
│  │ - Certificate Usage                                  │    │
│  │ - HTTPS Configuration                                │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Integration with NGINX

### Step 1: Install Certbot

```bash
# Install certbot
nx run certbot:install

# Or use Docker
nx run certbot:docker:build
```

### Step 2: Obtain Certificates

```bash
# Using local certbot
nx run certbot:setup-letsencrypt -- \
  --domain yourdomain.com \
  --email your@email.com

# Or using Docker
nx run certbot:docker:certonly -- \
  --webroot \
  --webroot-path /var/www/certbot \
  -d yourdomain.com \
  --email your@email.com \
  --agree-tos
```

### Step 3: Configure NGINX to Use Certificates

Update your NGINX configuration to use the Let's Encrypt certificates:

```nginx
# In your NGINX configuration
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    # Let's Encrypt certificates
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers off;

    # ... rest of your configuration
}
```

### Step 4: Set Up Docker Compose Integration

Create a unified docker-compose.yaml that includes both certbot and NGINX:

```yaml
version: '3.8'

services:
  certbot:
    extends:
      file: tools/certbot/docker-compose.yaml
      service: certbot
    volumes:
      - letsencrypt-config:/etc/letsencrypt
      - letsencrypt-lib:/var/lib/letsencrypt
      - webroot:/var/www/certbot

  nginx:
    extends:
      file: tools/nginx/docker-compose.yaml
      service: proxy-edge
    volumes:
      # Mount certificates from certbot
      - letsencrypt-config:/etc/letsencrypt:ro
      - webroot:/var/www/certbot:ro
    depends_on:
      - certbot

volumes:
  letsencrypt-config:
  letsencrypt-lib:
  webroot:
```

### Step 5: Start Services

```bash
# Build images
nx run certbot:docker:build
nx run nginx:docker:build-edge

# Start services
docker compose up -d
```

## Certificate Renewal

### Automatic Renewal with Cron

```bash
# Add to crontab
0 0,12 * * * nx run certbot:docker:renew && docker compose -f tools/nginx/docker-compose.yaml exec nginx nginx -s reload
```

### Automatic Renewal with Systemd Timer

```bash
# Create systemd service
cat > /etc/systemd/system/certbot-renew.service << EOF
[Unit]
Description=Certbot Renewal
After=docker.service

[Service]
Type=oneshot
ExecStart=/usr/bin/docker compose -f /path/to/tools/certbot/docker-compose.yaml run --rm certbot-renew
ExecStartPost=/usr/bin/docker compose -f /path/to/tools/nginx/docker-compose.yaml exec nginx nginx -s reload
EOF

# Create systemd timer
cat > /etc/systemd/system/certbot-renew.timer << EOF
[Unit]
Description=Run certbot renewal twice daily

[Timer]
OnCalendar=*-*-* 00,12:00:00
Persistent=true

[Install]
WantedBy=timers.target
EOF

# Enable and start timer
sudo systemctl enable certbot-renew.timer
sudo systemctl start certbot-renew.timer
```

## Testing the Integration

### Test Certificate Acquisition

```bash
# Obtain a test certificate (staging)
nx run certbot:setup-letsencrypt -- \
  --domain yourdomain.com \
  --email your@email.com \
  --staging
```

### Test NGINX HTTPS

```bash
# Test HTTPS connectivity
nx run nginx:tls:test-https

# Or manually
curl -k https://localhost/health
```

### Validate Configuration

```bash
# Validate certbot setup
nx run certbot:validate-config

# Validate NGINX TLS setup
nx run nginx:tls:validate-certs
```

## Nx Workflow

The complete workflow using Nx commands:

```bash
# 1. Install certbot
nx run certbot:install

# 2. Validate installation
nx run certbot:validate-config

# 3. Build Docker images
nx run certbot:docker:build
nx run nginx:docker:build-all

# 4. Obtain certificates (Docker)
nx run certbot:docker:certonly -- \
  --webroot \
  --webroot-path /var/www/certbot \
  -d yourdomain.com \
  --email your@email.com \
  --agree-tos

# 5. Start NGINX with TLS
docker compose \
  -f tools/nginx/docker-compose.yaml \
  -f tools/nginx/docker-compose.tls.yaml \
  up -d

# 6. Test HTTPS
nx run nginx:tls:test-https

# 7. Set up automatic renewal
nx run certbot:docker:renew  # Add to cron
```

## Troubleshooting

### Certificate Not Found

```bash
# Check certificate location
docker exec certbot ls -la /etc/letsencrypt/live/

# Check NGINX can access certificates
docker exec nginx ls -la /etc/letsencrypt/live/
```

### NGINX Can't Read Certificates

Ensure volumes are mounted correctly:

```bash
# Check volume mounts
docker inspect nginx | grep -A 10 Mounts
docker inspect certbot | grep -A 10 Mounts
```

### Renewal Fails

```bash
# Check renewal logs
nx run certbot:docker:logs

# Manual renewal
nx run certbot:docker:renew
```

## Security Best Practices

1. **Never commit certificates**: Ensure `.gitignore` excludes certificate files
2. **Use read-only mounts**: NGINX should mount certificates as read-only
3. **Restrict permissions**: Set proper file permissions on certificate directories
4. **Monitor expiration**: Set up alerts for certificate expiration
5. **Test renewal**: Regularly test the renewal process

## Advanced Configuration

### Wildcard Certificates (DNS-01 Challenge)

```bash
# Using Cloudflare DNS
nx run certbot:docker:certonly -- \
  --dns-cloudflare \
  --dns-cloudflare-credentials /path/to/cloudflare.ini \
  -d yourdomain.com \
  -d *.yourdomain.com \
  --email your@email.com \
  --agree-tos
```

### Multiple Domains

```bash
# Obtain certificate for multiple domains
nx run certbot:docker:certonly -- \
  --webroot \
  --webroot-path /var/www/certbot \
  -d yourdomain.com \
  -d www.yourdomain.com \
  -d api.yourdomain.com \
  --email your@email.com \
  --agree-tos
```

## Migration from Old Structure

If you have certificates in the old location (`tools/nginx/scripts/tls/`), migrate them:

```bash
# Copy certificates to new location
sudo cp -r /etc/letsencrypt/* tools/certbot/letsencrypt/

# Update NGINX to use new certificate paths
# (Certificates are now managed by the certbot tool)
```

## References

- [Certbot Tool Documentation](./README.md)
- [NGINX TLS Setup](../nginx/TLS_SETUP.md)
- [Certbot Official Docs](https://certbot.eff.org/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
