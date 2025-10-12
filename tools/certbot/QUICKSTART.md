# 🚀 Certbot-NGINX Integration - Quick Start Guide

**Get HTTPS running in under 5 minutes!**

This guide will walk you through setting up automated SSL/TLS certificate management with Certbot and NGINX from scratch to production-ready deployment.

---

## 📋 Prerequisites Checklist

Before you begin, ensure you have:

- ✅ **Docker & Docker Compose** installed and running
- ✅ **Domain name** registered and DNS configured
- ✅ **Ports 80 & 443** accessible from the internet
- ✅ **5-10 minutes** of your time

### Quick Validation

```bash
# Check Docker
docker --version && docker compose version

# Verify DNS (replace with your domain)
dig yourdomain.com +short

# Check ports (from external machine)
curl -I http://yourdomain.com
```

---

## 🎯 Option 1: Automated Setup (Recommended)

**One command to rule them all:**

```bash
# Navigate to repository
cd /path/to/my-projects-monorepo

# Run automated setup
bash tools/certbot/scripts/setup-integration.sh \
  --domain yourdomain.com \
  --email your@email.com
```

**That's it!** The script will:
1. ✅ Validate prerequisites
2. ✅ Create necessary directories
3. ✅ Start NGINX (HTTP)
4. ✅ Obtain certificates from Let's Encrypt
5. ✅ Configure NGINX with TLS
6. ✅ Setup automatic renewal (twice daily)
7. ✅ Run validation tests

### Verify It Works

```bash
# Test HTTPS
curl https://yourdomain.com/health

# Check certificate
echo | openssl s_client -connect yourdomain.com:443 2>/dev/null | openssl x509 -noout -dates
```

---

## 🛠️ Option 2: Manual Setup (Step-by-Step)

If you prefer more control:

### Step 1: Prepare Environment

```bash
# Create volume directories
mkdir -p volumes/{letsencrypt,letsencrypt-lib,certbot-webroot,nginx-logs}

# Set permissions
chmod -R 755 volumes/certbot-webroot

# Create environment file
cat > .env.certbot << EOF
CERTBOT_EMAIL=your@email.com
CERTBOT_DOMAINS=yourdomain.com,www.yourdomain.com
EOF
```

### Step 2: Start NGINX (HTTP Only)

```bash
# Start NGINX without TLS
docker compose -f docker-compose.certbot-nginx.yaml up -d nginx

# Verify NGINX is running
docker ps | grep nginx
curl http://localhost/health
```

### Step 3: Obtain Certificates

```bash
# Get certificates from Let's Encrypt
CERTBOT_EMAIL=your@email.com \
CERTBOT_DOMAINS=yourdomain.com,www.yourdomain.com \
docker compose -f docker-compose.certbot-nginx.yaml run --rm certbot-acquire

# Verify certificates
ls -la volumes/letsencrypt/live/yourdomain.com/
```

### Step 4: Enable TLS

```bash
# Restart NGINX with TLS
docker compose -f docker-compose.certbot-nginx.yaml restart nginx

# Test HTTPS
curl -k https://localhost/health
```

### Step 5: Setup Auto-Renewal

```bash
# Start renewal service
docker compose -f docker-compose.certbot-nginx.yaml up -d certbot-renew

# Verify renewal service
docker ps | grep certbot-renew
```

---

## 🏭 Option 3: Production Deployment

For a complete production stack with monitoring:

### Step 1: Configure Environment

```bash
# Copy example environment file
cat > .env << EOF
# Certbot
CERTBOT_EMAIL=your@email.com
CERTBOT_DOMAINS=yourdomain.com,www.yourdomain.com,api.yourdomain.com

# Database
DATABASE_PASSWORD=your-secure-password

# Monitoring
GRAFANA_PASSWORD=your-grafana-password

# Alerts (optional)
SLACK_WEBHOOK=https://hooks.slack.com/services/YOUR/WEBHOOK
ALERT_EMAIL=alerts@yourdomain.com
EOF
```

### Step 2: Deploy Everything

```bash
# Initialize and obtain certificates
docker compose -f docker-compose.production-example.yaml run --rm certbot-acquire

# Start all services
docker compose -f docker-compose.production-example.yaml up -d
```

### Step 3: Access Services

```bash
# Your application
open https://yourdomain.com

# Prometheus metrics
open http://localhost:9090

# Grafana dashboards
open http://localhost:3001
```

---

## 🎮 Using Nx Commands

If you prefer Nx:

```bash
# Complete setup
nx run certbot:setup-integration

# Dry run (preview)
nx run certbot:setup-integration:dry-run

# Monitor certificates
nx run certbot:monitor-certificates

# Export Prometheus metrics
nx run certbot:monitor-certificates:prometheus
```

---

## 📊 Monitoring & Maintenance

### Check Certificate Status

```bash
# List all certificates
docker compose -f docker-compose.certbot-nginx.yaml exec certbot-renew certbot certificates

# Check expiration
openssl x509 -in volumes/letsencrypt/live/yourdomain.com/cert.pem -noout -dates

# Monitor with alerts
nx run certbot:monitor-certificates \
  --slack-webhook https://hooks.slack.com/... \
  --email alerts@yourdomain.com
```

### Force Renewal

```bash
# Force certificate renewal
docker compose -f docker-compose.certbot-nginx.yaml exec certbot-renew certbot renew --force-renewal

# Test renewal (dry run)
docker compose -f docker-compose.certbot-nginx.yaml exec certbot-renew certbot renew --dry-run
```

### View Logs

```bash
# All services
docker compose -f docker-compose.certbot-nginx.yaml logs -f

# Specific service
docker compose -f docker-compose.certbot-nginx.yaml logs -f certbot-renew
docker compose -f docker-compose.certbot-nginx.yaml logs -f nginx
```

---

## 🔧 Common Commands

```bash
# Stop all services
docker compose -f docker-compose.certbot-nginx.yaml down

# Restart NGINX
docker compose -f docker-compose.certbot-nginx.yaml restart nginx

# Reload NGINX config (zero downtime)
docker compose -f docker-compose.certbot-nginx.yaml exec nginx nginx -s reload

# Backup certificates
tar -czf certs-backup-$(date +%Y%m%d).tar.gz volumes/letsencrypt

# Restore certificates
tar -xzf certs-backup-20241012.tar.gz
```

---

## 🐛 Troubleshooting

### Issue: ACME Challenge Fails

```bash
# Check DNS
dig yourdomain.com +short

# Test webroot accessibility
curl http://yourdomain.com/.well-known/acme-challenge/test

# Check NGINX config
docker compose -f docker-compose.certbot-nginx.yaml exec nginx nginx -t
```

### Issue: Certificate Not Loading

```bash
# Verify certificate files
docker compose -f docker-compose.certbot-nginx.yaml exec nginx ls -la /etc/letsencrypt/live/yourdomain.com/

# Check volume mounts
docker inspect nginx-certbot-proxy | grep -A 10 Mounts

# Restart NGINX
docker compose -f docker-compose.certbot-nginx.yaml restart nginx
```

### Issue: Renewal Not Working

```bash
# Check renewal service logs
docker compose -f docker-compose.certbot-nginx.yaml logs certbot-renew

# Test renewal manually
docker compose -f docker-compose.certbot-nginx.yaml exec certbot-renew certbot renew --dry-run

# Force renewal
docker compose -f docker-compose.certbot-nginx.yaml exec certbot-renew certbot renew --force-renewal
```

---

## 📚 Next Steps

Now that you have HTTPS working:

1. **Configure Monitoring** - Set up Prometheus and Grafana
2. **Enable Alerts** - Configure Slack/email notifications
3. **Add Security Headers** - Implement HSTS, CSP, etc.
4. **Optimize Performance** - Enable HTTP/2, OCSP stapling
5. **Plan Backups** - Automate certificate backups
6. **Test Failover** - Verify disaster recovery procedures

---

## 📖 Documentation

For more detailed information:

- 📘 **[Complete Integration Guide](./NGINX-INTEGRATION.md)** - In-depth documentation
- 📙 **[Installation Guide](./README-install-certbot.md)** - Certbot installation
- 📕 **[Workflow Guide](./WORKFLOW.md)** - Complete workflows
- 📗 **[README](./README.md)** - Certbot tool overview

---

## 🆘 Getting Help

- **Issues**: Check [NGINX-INTEGRATION.md](./NGINX-INTEGRATION.md#troubleshooting) troubleshooting section
- **Scripts**: Review `tools/certbot/scripts/` for automation
- **Examples**: See `docker-compose.*.yaml` files
- **Community**: Ask in GitHub Issues

---

## ✅ Success Checklist

After setup, verify:

- [ ] HTTPS is working (`curl https://yourdomain.com`)
- [ ] HTTP redirects to HTTPS
- [ ] Certificate is valid (`openssl s_client -connect yourdomain.com:443`)
- [ ] Auto-renewal service is running (`docker ps | grep certbot-renew`)
- [ ] Monitoring is configured (optional)
- [ ] Backups are scheduled (recommended)

---

**Congratulations! 🎉 Your site is now secured with automated HTTPS!**

For production deployments, review the complete [Integration Guide](./NGINX-INTEGRATION.md) for security hardening, performance optimization, and best practices.
