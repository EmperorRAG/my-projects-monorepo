# TLS/HTTPS Setup Guide for NGINX

Complete guide for setting up TLS/HTTPS in the NGINX infrastructure, from development to production.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Development Setup](#development-setup)
- [Production Setup](#production-setup)
- [Certificate Management](#certificate-management)
- [Security Configuration](#security-configuration)
- [Testing & Validation](#testing--validation)
- [Troubleshooting](#troubleshooting)
- [Advanced Topics](#advanced-topics)

## Overview

The NGINX infrastructure supports comprehensive TLS/HTTPS configuration with:

- **🔒 Modern Security**: TLS 1.2/1.3, strong cipher suites, HSTS, OCSP stapling
- **🛠️ Development Tools**: Self-signed certificate generation, validation scripts
- **🚀 Production Ready**: Let's Encrypt integration, automated renewal
- **📊 Nx Integration**: Fully integrated with Nx targets for easy management
- **🐳 Docker Support**: Complete Docker Compose orchestration

### TLS Configuration Features

✅ **Implemented:**
- Modern TLS protocols (TLS 1.2 and 1.3 only)
- Strong cipher suites with forward secrecy
- OCSP stapling for improved performance
- HTTP to HTTPS redirect (production)
- HSTS headers (production)
- Automated certificate generation and rotation
- Let's Encrypt integration
- Certificate validation and monitoring

## Quick Start

### For Development (Self-Signed Certificates)

```bash
# 1. Generate development certificates
nx run nginx:tls:generate-dev-certs

# 2. Start NGINX with TLS
docker compose -f tools/nginx/docker-compose.yaml -f tools/nginx/docker-compose.tls.yaml up -d

# 3. Test HTTPS
curl -k https://localhost/health
```

### For Production (Let's Encrypt)

```bash
# 1. Generate Let's Encrypt certificates
nx run nginx:tls:setup-letsencrypt -- --domain yourdomain.com --email your@email.com

# 2. Start NGINX in production mode with TLS
docker compose -f tools/nginx/docker-compose.yaml -f tools/nginx/docker-compose.prod.yaml -f tools/nginx/docker-compose.tls.yaml up -d

# 3. Verify HTTPS
curl https://yourdomain.com/health
```

## Development Setup

### Step 1: Generate Self-Signed Certificates

The development certificate generation script creates self-signed certificates suitable for local development and testing.

```bash
# Using Nx
nx run nginx:tls:generate-dev-certs

# Or directly
bash tools/nginx/scripts/tls/generate-dev-certs.sh
```

**What it does:**
- Generates a 2048-bit RSA private key
- Creates a self-signed certificate valid for 365 days
- Configures Subject Alternative Names (SANs) for:
  - `localhost`
  - `*.localhost`
  - `dev.local`
  - `*.dev.local`
  - `127.0.0.1`
  - `::1` (IPv6 localhost)
- Creates documentation and usage guides

**Certificate Location:**
```
tools/nginx/secrets/tls/
├── cert.pem          # Server certificate
├── key.pem           # Private key (keep secret!)
├── fullchain.pem     # Full certificate chain
├── openssl.cnf       # OpenSSL configuration
└── README.md         # Documentation
```

### Step 2: Trust Development Certificates (Optional)

To avoid browser security warnings during development, you can trust the self-signed certificate:

#### macOS
```bash
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain tools/nginx/secrets/tls/cert.pem
```

#### Linux (Ubuntu/Debian)
```bash
sudo cp tools/nginx/secrets/tls/cert.pem /usr/local/share/ca-certificates/nginx-dev.crt
sudo update-ca-certificates
```

#### Windows
1. Double-click `cert.pem`
2. Click "Install Certificate"
3. Choose "Local Machine"
4. Place in "Trusted Root Certification Authorities"

#### Firefox (All Platforms)
1. Open Settings → Privacy & Security → Certificates
2. Click "View Certificates" → "Authorities" → "Import"
3. Select `cert.pem` and trust for websites

### Step 3: Start NGINX with TLS

```bash
# Development mode with TLS
docker compose -f tools/nginx/docker-compose.yaml -f tools/nginx/docker-compose.tls.yaml up -d

# View logs
docker compose -f tools/nginx/docker-compose.yaml logs -f proxy-edge

# Verify services
docker compose -f tools/nginx/docker-compose.yaml ps
```

### Step 4: Test HTTPS

```bash
# Test HTTP (should work)
curl http://localhost/health

# Test HTTPS (use -k to ignore self-signed certificate warnings)
curl -k https://localhost/health

# Test with validation (will fail for self-signed)
curl https://localhost/health

# Using Nx target
nx run nginx:tls:test-https
```

## Production Setup

### Option 1: Let's Encrypt (Recommended)

Let's Encrypt provides free, automated, and trusted SSL/TLS certificates.

#### Prerequisites
- Domain name pointing to your server
- Ports 80 and 443 accessible from the internet
- Root or sudo access for package installation

#### Step 1: Install Certbot

**Automated Installation (Recommended):**

The automated installation script detects your OS and installs certbot with the correct package manager:

```bash
# Install certbot automatically
nx run certbot:install

# Or run the script directly
bash tools/certbot/scripts/install-certbot.sh
```

**Dry Run (See what would be installed):**
```bash
nx run certbot:install:dry-run
```

**Supported Operating Systems:**
- Ubuntu/Debian (apt)
- CentOS/RHEL/Fedora (yum/dnf)
- Amazon Linux (yum)
- Alpine Linux (apk)
- macOS (homebrew)

**Manual Installation (Alternative):**

```bash
# Ubuntu/Debian
sudo apt-get update && sudo apt-get install certbot python3-certbot-nginx

# macOS
brew install certbot

# CentOS/RHEL
sudo yum install epel-release
sudo yum install certbot python3-certbot-nginx

# Fedora
sudo dnf install certbot python3-certbot-nginx

# Alpine Linux
sudo apk update
sudo apk add certbot certbot-nginx
```

#### Step 2: Generate Certificates

**Using HTTP-01 Challenge (Standard):**
```bash
nx run nginx:tls:setup-letsencrypt -- \
  --domain yourdomain.com \
  --email your@email.com
```

**Using DNS-01 Challenge (Wildcard Support):**
```bash
nx run nginx:tls:setup-letsencrypt -- \
  --domain yourdomain.com \
  --email your@email.com \
  --dns-provider cloudflare
```

**Testing with Staging Server:**
```bash
nx run nginx:tls:setup-letsencrypt -- \
  --domain yourdomain.com \
  --email your@email.com \
  --staging
```

#### Step 3: Configure Automatic Renewal

Let's Encrypt certificates expire after 90 days. Set up automatic renewal:

```bash
# Enable systemd timer (Ubuntu/Debian)
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Or add to crontab
0 0,12 * * * certbot renew --quiet
```

The setup script automatically configures a renewal hook that reloads NGINX when certificates are renewed.

#### Step 4: Start NGINX in Production

```bash
# Start with production configuration and TLS
docker compose \
  -f tools/nginx/docker-compose.yaml \
  -f tools/nginx/docker-compose.prod.yaml \
  -f tools/nginx/docker-compose.tls.yaml \
  up -d
```

### Option 2: Commercial CA Certificates

If you have certificates from a commercial Certificate Authority (DigiCert, GlobalSign, etc.):

#### Step 1: Obtain Certificates

Follow your CA's process to obtain:
- Certificate file (`.crt` or `.pem`)
- Private key file (`.key` or `.pem`)
- Intermediate certificates (optional)

#### Step 2: Install Certificates

```bash
# Create secrets directory
mkdir -p tools/nginx/secrets/tls

# Copy certificate and key (ensure correct permissions)
cp your-certificate.pem tools/nginx/secrets/tls/cert.pem
cp your-private-key.pem tools/nginx/secrets/tls/key.pem

# Set proper permissions
chmod 644 tools/nginx/secrets/tls/cert.pem
chmod 600 tools/nginx/secrets/tls/key.pem

# If you have intermediate certificates, create fullchain
cat your-certificate.pem intermediate.pem > tools/nginx/secrets/tls/fullchain.pem
```

#### Step 3: Validate Certificates

```bash
nx run nginx:tls:validate-certs
```

#### Step 4: Start NGINX

```bash
docker compose \
  -f tools/nginx/docker-compose.yaml \
  -f tools/nginx/docker-compose.prod.yaml \
  -f tools/nginx/docker-compose.tls.yaml \
  up -d
```

## Certificate Management

### Certificate Validation

Validate your TLS certificates before deploying:

```bash
# Using Nx
nx run nginx:tls:validate-certs

# Or directly
bash tools/nginx/scripts/tls/validate-certs.sh
```

**What it checks:**
- Certificate and key file existence
- File permissions
- Certificate validity and expiration
- Certificate and key match
- Subject Alternative Names (SANs)
- Key strength (minimum 2048 bits)

### Certificate Rotation

Rotate certificates with zero downtime:

```bash
# Using Nx
nx run nginx:tls:rotate-certs

# Or directly
bash tools/nginx/scripts/tls/rotate-certs.sh
```

**What it does:**
1. Backs up existing certificates
2. Generates new certificates
3. Validates new certificates
4. Gracefully reloads NGINX
5. Keeps last 5 backups for rollback

**Options:**
```bash
# Skip backup
nx run nginx:tls:rotate-certs -- --no-backup

# Skip NGINX reload
nx run nginx:tls:rotate-certs -- --no-reload
```

### Certificate Renewal

#### Automatic Renewal (Let's Encrypt)

Let's Encrypt certificates are automatically renewed when you enable the renewal service:

```bash
# Check renewal status
certbot renew --dry-run

# Manual renewal
certbot renew

# Renewal with NGINX reload
certbot renew --deploy-hook "docker exec nginx-proxy-edge nginx -s reload"
```

#### Manual Renewal (Commercial CA)

1. Obtain renewed certificate from your CA
2. Replace old certificates in `tools/nginx/secrets/tls/`
3. Validate new certificates: `nx run nginx:tls:validate-certs`
4. Reload NGINX: `docker exec nginx-proxy-edge nginx -s reload`

## Security Configuration

### TLS Protocol Configuration

The NGINX infrastructure uses modern TLS settings by default:

**Enabled Protocols:**
- TLS 1.2 ✅
- TLS 1.3 ✅

**Disabled Protocols:**
- TLS 1.0 ❌ (deprecated, insecure)
- TLS 1.1 ❌ (deprecated, insecure)
- SSL 3.0 ❌ (vulnerable to POODLE)

### Cipher Suites

Modern, secure cipher suites with forward secrecy:

```
ECDHE-ECDSA-AES128-GCM-SHA256
ECDHE-RSA-AES128-GCM-SHA256
ECDHE-ECDSA-AES256-GCM-SHA384
ECDHE-RSA-AES256-GCM-SHA384
ECDHE-ECDSA-CHACHA20-POLY1305
ECDHE-RSA-CHACHA20-POLY1305
```

**Features:**
- Forward secrecy (ECDHE key exchange)
- Authenticated encryption (GCM, CHACHA20-POLY1305)
- Support for both ECDSA and RSA certificates

### HSTS (HTTP Strict Transport Security)

HSTS forces browsers to use HTTPS for all future requests.

**Production Configuration:**
```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
```

**Parameters:**
- `max-age=31536000`: 1 year validity
- `includeSubDomains`: Apply to all subdomains
- `preload`: Eligible for browser preload lists

⚠️ **Warning:** Only enable HSTS after verifying HTTPS works correctly! Once enabled, browsers will refuse to connect via HTTP.

### OCSP Stapling

OCSP stapling improves performance and privacy by caching certificate status.

**Configuration:**
```nginx
ssl_stapling on;
ssl_stapling_verify on;
resolver 8.8.8.8 8.8.4.4 valid=300s;
resolver_timeout 5s;
```

**Benefits:**
- Reduces client handshake time
- Improves user privacy
- Reduces load on CA OCSP servers

### Additional Security Headers

The production configuration includes:

```nginx
# Prevent MIME type sniffing
add_header X-Content-Type-Options "nosniff" always;

# Prevent clickjacking
add_header X-Frame-Options "SAMEORIGIN" always;

# XSS protection
add_header X-XSS-Protection "1; mode=block" always;

# Content Security Policy
add_header Content-Security-Policy "default-src 'self' https:; ..." always;

# Referrer policy
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# Permissions policy
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
```

## Testing & Validation

### Local Testing

```bash
# Test HTTP endpoint
curl http://localhost/health

# Test HTTPS endpoint (ignore cert for self-signed)
curl -k https://localhost/health

# Test HTTPS with certificate validation
curl https://localhost/health

# Test using Nx target
nx run nginx:tls:test-https
```

### Certificate Inspection

```bash
# View certificate details
openssl x509 -in tools/nginx/secrets/tls/cert.pem -noout -text

# Check certificate expiration
openssl x509 -in tools/nginx/secrets/tls/cert.pem -noout -enddate

# Test live server certificate
openssl s_client -connect localhost:443 -servername localhost

# Extract certificate from server
echo | openssl s_client -connect localhost:443 -servername localhost 2>/dev/null | openssl x509 -noout -text
```

### TLS Configuration Testing

#### SSL Labs (Production Only)

For production servers, use SSL Labs for comprehensive testing:

🔗 https://www.ssllabs.com/ssltest/analyze.html?d=yourdomain.com

**Target Rating:** A or A+

#### Security Headers

Test security headers:

🔗 https://securityheaders.com/?q=yourdomain.com

#### Manual Testing

```bash
# Test TLS 1.2
openssl s_client -connect localhost:443 -tls1_2

# Test TLS 1.3
openssl s_client -connect localhost:443 -tls1_3

# Test specific cipher
openssl s_client -connect localhost:443 -cipher ECDHE-RSA-AES128-GCM-SHA256

# Verify OCSP stapling
openssl s_client -connect localhost:443 -status
```

## Troubleshooting

### Common Issues

#### 1. Certificate Not Found

**Error:**
```
nginx: [emerg] cannot load certificate "/etc/nginx/tls/cert.pem"
```

**Solution:**
```bash
# Verify certificates exist
ls -la tools/nginx/secrets/tls/

# Generate development certificates
nx run nginx:tls:generate-dev-certs

# Validate certificates
nx run nginx:tls:validate-certs
```

#### 2. Certificate and Key Mismatch

**Error:**
```
nginx: [emerg] SSL_CTX_use_PrivateKey_file() failed
```

**Solution:**
```bash
# Validate certificate and key match
nx run nginx:tls:validate-certs

# If mismatch, regenerate
nx run nginx:tls:generate-dev-certs
```

#### 3. Certificate Expired

**Error:**
```
certificate has expired
```

**Solution:**
```bash
# Check expiration
openssl x509 -in tools/nginx/secrets/tls/cert.pem -noout -enddate

# Rotate certificates
nx run nginx:tls:rotate-certs
```

#### 4. Browser Security Warning

**Issue:** Browser shows "Your connection is not private"

**For Development:**
- This is expected with self-signed certificates
- Either:
  - Accept the warning and proceed (not secure, but OK for dev)
  - Trust the certificate locally (see [Trust Development Certificates](#step-2-trust-development-certificates-optional))

**For Production:**
- Ensure you're using a trusted CA certificate (Let's Encrypt or commercial)
- Verify certificate is properly installed
- Check certificate chain is complete

#### 5. HTTPS Not Accessible

**Solution:**
```bash
# Verify NGINX is running
docker ps | grep nginx

# Check NGINX logs
docker logs nginx-proxy-edge

# Verify port 443 is exposed
docker port nginx-proxy-edge

# Test TLS handshake
openssl s_client -connect localhost:443
```

#### 6. Let's Encrypt Rate Limits

**Error:**
```
too many certificates already issued for exact set of domains
```

**Solution:**
- Wait 7 days for rate limit to reset
- Use staging server for testing: `--staging`
- Consolidate domains to reduce certificate requests

### Debug Mode

Enable detailed logging for troubleshooting:

```bash
# Increase NGINX error log level
docker exec nginx-proxy-edge sed -i 's/error_log .*;/error_log \/dev\/stderr debug;/' /etc/nginx/nginx.conf

# Reload configuration
docker exec nginx-proxy-edge nginx -s reload

# View debug logs
docker logs -f nginx-proxy-edge
```

## Advanced Topics

### Wildcard Certificates

For wildcard certificates (*.yourdomain.com), use DNS-01 challenge:

```bash
nx run nginx:tls:setup-letsencrypt -- \
  --domain "*.yourdomain.com" \
  --email your@email.com \
  --dns-provider cloudflare
```

**Requirements:**
- DNS provider API credentials
- Certbot DNS plugin for your provider

### Multi-Domain Certificates

For certificates covering multiple domains:

```bash
certbot certonly \
  --nginx \
  -d yourdomain.com \
  -d www.yourdomain.com \
  -d api.yourdomain.com \
  --email your@email.com
```

### Certificate Pinning

For enhanced security, implement Certificate Pinning:

```nginx
# Add to NGINX configuration
add_header Public-Key-Pins 'pin-sha256="base64+primary=="; pin-sha256="base64+backup=="; max-age=5184000; includeSubDomains' always;
```

**Generate pins:**
```bash
openssl x509 -in cert.pem -pubkey -noout | openssl pkey -pubin -outform der | openssl dgst -sha256 -binary | base64
```

### Custom Cipher Suites

To customize cipher suites, edit `/etc/nginx/snippets/tls.conf`:

```nginx
ssl_ciphers 'YOUR-CUSTOM-CIPHER-STRING';
```

Test your configuration:
```bash
nmap --script ssl-enum-ciphers -p 443 localhost
```

### Client Certificate Authentication

For mutual TLS (mTLS):

```nginx
server {
    listen 443 ssl http2;
    
    # Server certificates
    ssl_certificate /etc/nginx/tls/cert.pem;
    ssl_certificate_key /etc/nginx/tls/key.pem;
    
    # Client certificate verification
    ssl_client_certificate /etc/nginx/tls/ca.pem;
    ssl_verify_client on;
    ssl_verify_depth 2;
}
```

### Performance Tuning

Optimize TLS performance:

```nginx
# Session cache
ssl_session_cache shared:SSL:50m;
ssl_session_timeout 1d;

# Buffer size
ssl_buffer_size 8k;

# Enable session resumption
ssl_session_tickets off;  # Or on with ticket key rotation
```

## Security Checklist

Before going to production:

- [ ] Trusted CA certificates installed (Let's Encrypt or commercial)
- [ ] Certificate expiration monitoring configured
- [ ] Automatic renewal enabled and tested
- [ ] HTTPS redirect enabled (HTTP → HTTPS)
- [ ] HSTS headers configured (after HTTPS verification)
- [ ] Security headers configured (CSP, X-Frame-Options, etc.)
- [ ] TLS protocols limited to 1.2 and 1.3
- [ ] Strong cipher suites configured
- [ ] OCSP stapling enabled
- [ ] SSL Labs rating A or A+
- [ ] Security headers pass securityheaders.com
- [ ] Certificate backup strategy in place
- [ ] Renewal hooks configured for NGINX reload

## Additional Resources

### Official Documentation
- [NGINX SSL Module](https://nginx.org/en/docs/http/ngx_http_ssl_module.html)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Mozilla SSL Configuration Generator](https://ssl-config.mozilla.org/)

### Testing Tools
- [SSL Labs Server Test](https://www.ssllabs.com/ssltest/)
- [Security Headers](https://securityheaders.com/)
- [SSL Checker](https://www.sslshopper.com/ssl-checker.html)

### Certificate Authorities
- [Let's Encrypt](https://letsencrypt.org/) (Free, automated)
- [DigiCert](https://www.digicert.com/)
- [GlobalSign](https://www.globalsign.com/)
- [Sectigo](https://sectigo.com/)

### Community Resources
- [NGINX Blog](https://www.nginx.com/blog/)
- [Certbot Community](https://community.letsencrypt.org/)

## Support

For issues specific to this implementation:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review NGINX logs: `docker logs nginx-proxy-edge`
3. Validate configuration: `nx run nginx:validate-config`
4. Check health status: `nx run nginx:health-check`

---

**Last Updated:** October 2025  
**Version:** 1.0.0
