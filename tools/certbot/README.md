# Certbot Tool

Automated SSL/TLS certificate management using Let's Encrypt and Certbot for the entire monorepo.

## Overview

Certbot is a free, open-source tool from the EFF (Electronic Frontier Foundation) that automatically obtains and renews SSL/TLS certificates from Let's Encrypt. This tool directory provides:

- 🔒 **Automated Certificate Management**: Obtain and renew SSL/TLS certificates
- 🐳 **Docker Support**: Run certbot in containers
- 🔧 **OS Auto-Detection**: Automatically install certbot on any platform
- 📊 **Nx Integration**: Fully integrated with Nx workspace
- ✅ **Validation**: Scripts to validate certbot configuration

## Quick Start

### Install Certbot

```bash
# Install certbot (auto-detects OS and package manager)
nx run certbot:install

# Preview installation (dry run)
nx run certbot:install:dry-run
```

### Obtain a Certificate

```bash
# Using the automated script
nx run certbot:setup-letsencrypt -- \
  --domain yourdomain.com \
  --email your@email.com

# Or using Docker
nx run certbot:docker:build
nx run certbot:docker:certonly -- \
  --nginx \
  -d yourdomain.com \
  --email your@email.com \
  --agree-tos
```

### Renew Certificates

```bash
# Using installed certbot
certbot renew

# Using Docker
nx run certbot:docker:renew
```

## Nx Targets

### Installation
- `nx run certbot:install` - Install certbot with OS auto-detection
- `nx run certbot:install:dry-run` - Preview installation without executing
- `nx run certbot:test` - Run installation tests

### Certificate Management
- `nx run certbot:setup-letsencrypt` - Set up Let's Encrypt certificates
- `nx run certbot:validate-config` - Validate certbot configuration

### Docker Operations
- `nx run certbot:docker:build` - Build certbot Docker image
- `nx run certbot:docker:certonly` - Obtain certificates using Docker
- `nx run certbot:docker:renew` - Renew certificates using Docker
- `nx run certbot:docker:up` - Start certbot Docker services
- `nx run certbot:docker:down` - Stop certbot Docker services
- `nx run certbot:docker:logs` - View certbot Docker logs

## Directory Structure

```
tools/certbot/
├── docker/
│   └── Dockerfile                 # Certbot Docker image
├── scripts/
│   ├── install-certbot.sh         # OS auto-detection installer
│   ├── setup-letsencrypt.sh       # Let's Encrypt setup
│   ├── test-install-certbot.sh    # Installation tests
│   └── validate-certbot.sh        # Configuration validator
├── docker-compose.yaml            # Docker Compose configuration
├── project.json                   # Nx project configuration
├── README.md                      # This file
├── README-install-certbot.md      # Detailed installation guide
├── WORKFLOW.md                    # Complete workflow documentation
└── IMPLEMENTATION_SUMMARY.md      # Implementation details
```

## Supported Platforms

| Platform | Package Manager | Auto-Detected | Docker |
|----------|----------------|---------------|--------|
| Ubuntu/Debian | apt-get | ✅ | ✅ |
| CentOS/RHEL | yum | ✅ | ✅ |
| Fedora | dnf | ✅ | ✅ |
| Amazon Linux | yum | ✅ | ✅ |
| Alpine Linux | apk | ✅ | ✅ |
| macOS | brew | ✅ | ✅ |
| Windows 10/11 (WSL) | apt/yum/dnf | ✅ | ✅ |

## Docker Compose Integration

The certbot tool can be integrated with other services in your monorepo:

```yaml
# Example: Integrate with NGINX
services:
  nginx:
    # ... your nginx config
    volumes:
      - letsencrypt-config:/etc/letsencrypt:ro
      - webroot:/var/www/certbot

  certbot:
    extends:
      file: tools/certbot/docker-compose.yaml
      service: certbot
    volumes:
      - letsencrypt-config:/etc/letsencrypt
      - webroot:/var/www/certbot

volumes:
  letsencrypt-config:
  webroot:
```

## Usage Examples

### Obtain Certificate with HTTP-01 Challenge

```bash
# Using local certbot
nx run certbot:setup-letsencrypt -- \
  --domain example.com \
  --email admin@example.com

# Using Docker
nx run certbot:docker:certonly -- \
  --webroot \
  --webroot-path /var/www/certbot \
  -d example.com \
  --email admin@example.com \
  --agree-tos
```

### Obtain Certificate with DNS-01 Challenge

```bash
# Using Docker with Cloudflare DNS
nx run certbot:docker:certonly -- \
  --dns-cloudflare \
  --dns-cloudflare-credentials /path/to/cloudflare.ini \
  -d example.com \
  -d *.example.com \
  --email admin@example.com \
  --agree-tos
```

### Set Up Automatic Renewal

```bash
# Create a cron job (Linux/macOS)
0 0,12 * * * nx run certbot:docker:renew

# Or use systemd timer (Ubuntu/Debian with local certbot)
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

## Testing

Run the test suite to validate the installation script:

```bash
nx run certbot:test
```

Expected output:
```
Tests run:    10
Tests passed: 10  ✅
Tests failed: 0
```

## Validation

Validate your certbot configuration:

```bash
nx run certbot:validate-config
```

This will check:
- Certbot installation
- Available plugins
- Let's Encrypt directories
- Existing certificates
- Docker setup

## Integration with NGINX

To use certbot certificates with NGINX:

1. Obtain certificates:
   ```bash
   nx run certbot:setup-letsencrypt -- \
     --domain yourdomain.com \
     --email your@email.com
   ```

2. Configure NGINX to use the certificates:
   ```nginx
   ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
   ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
   ```

3. Set up renewal hook to reload NGINX:
   ```bash
   # In your renewal hook script
   docker compose -f tools/nginx/docker-compose.yaml exec nginx nginx -s reload
   ```

## Troubleshooting

### Certbot Not Installed

```bash
# Install certbot
nx run certbot:install

# Or preview what would be installed
nx run certbot:install:dry-run
```

### Docker Image Not Found

```bash
# Build the Docker image
nx run certbot:docker:build
```

### Certificate Validation Fails

Check the logs:
```bash
# For local certbot
sudo journalctl -u certbot

# For Docker
nx run certbot:docker:logs
```

### Rate Limits

Let's Encrypt has rate limits. Use staging for testing:
```bash
nx run certbot:setup-letsencrypt -- \
  --domain yourdomain.com \
  --email your@email.com \
  --staging
```

## Documentation

- [Installation Guide](./README-install-certbot.md) - Detailed installation instructions
- [Workflow Guide](./WORKFLOW.md) - Complete workflow with examples
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md) - Technical details
- [Certbot Official Docs](https://certbot.eff.org/docs/)
- [Let's Encrypt Docs](https://letsencrypt.org/docs/)

## Contributing

When making changes to certbot scripts:

1. Update the test suite in `scripts/test-install-certbot.sh`
2. Run tests: `nx run certbot:test`
3. Validate with shellcheck: `shellcheck scripts/*.sh`
4. Update documentation as needed
5. Run validation: `nx run certbot:validate-config`

## Security Considerations

- 🔐 Never commit certificates or private keys to Git
- 🔒 Store credentials securely (use environment variables or secret managers)
- 🛡️ Regularly update certbot and its plugins
- ✅ Monitor certificate expiration dates
- 🔄 Set up automatic renewal before certificates expire

## License

This tool uses Certbot, which is licensed under the Apache License 2.0.
