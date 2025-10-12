#!/bin/bash
# =================================================================================================
# Let's Encrypt Certificate Setup Script
# =================================================================================================
#
# This script sets up automated TLS certificate management using Let's Encrypt and Certbot.
# It provides:
# - Automated certificate generation
# - Automatic renewal
# - DNS-01 or HTTP-01 challenge support
# - Integration with NGINX
#
# Prerequisites:
# - Certbot installed (https://certbot.eff.org/)
# - Domain name pointing to this server
# - Ports 80/443 accessible from internet (for HTTP-01 challenge)
#   OR DNS provider API credentials (for DNS-01 challenge)
#
# Usage:
#   ./tools/nginx/scripts/tls/setup-letsencrypt.sh --domain example.com --email admin@example.com
#   nx run nginx:tls:setup-letsencrypt -- --domain example.com --email admin@example.com
#
# Options:
#   --domain <domain>     Domain name for the certificate (required)
#   --email <email>       Email for Let's Encrypt notifications (required)
#   --staging             Use Let's Encrypt staging server (for testing)
#   --dns-provider <name> Use DNS-01 challenge with specified provider
#   --help                Show this help message
#
# =================================================================================================

set -e

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NGINX_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"
SECRETS_DIR="${NGINX_DIR}/secrets/tls"
LETSENCRYPT_DIR="/etc/letsencrypt"

# Configuration
DOMAIN=""
EMAIL=""
STAGING=false
DNS_PROVIDER=""
WEBROOT="/var/www/certbot"

# Function to show help
show_help() {
    cat << EOF
Let's Encrypt Certificate Setup Script

Usage: $0 --domain <domain> --email <email> [options]

Required Options:
  --domain <domain>     Domain name for the certificate
  --email <email>       Email address for Let's Encrypt notifications

Optional Options:
  --staging             Use Let's Encrypt staging server (for testing)
  --dns-provider <name> Use DNS-01 challenge (cloudflare, route53, etc.)
  --help                Show this help message

Examples:
  # HTTP-01 challenge (requires ports 80/443 accessible)
  $0 --domain example.com --email admin@example.com

  # DNS-01 challenge with Cloudflare
  $0 --domain example.com --email admin@example.com --dns-provider cloudflare

  # Staging server for testing
  $0 --domain example.com --email admin@example.com --staging

For more information, visit: https://certbot.eff.org/
EOF
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --domain)
            DOMAIN="$2"
            shift 2
            ;;
        --email)
            EMAIL="$2"
            shift 2
            ;;
        --staging)
            STAGING=true
            shift
            ;;
        --dns-provider)
            DNS_PROVIDER="$2"
            shift 2
            ;;
        --help)
            show_help
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Validate required arguments
if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ]; then
    echo -e "${RED}Error: --domain and --email are required${NC}"
    echo ""
    show_help
    exit 1
fi

echo -e "${BLUE}=================================================================================================${NC}"
echo -e "${BLUE}Let's Encrypt Certificate Setup${NC}"
echo -e "${BLUE}=================================================================================================${NC}"
echo ""

# Check if certbot is installed
echo -e "${YELLOW}[1/7] Checking prerequisites...${NC}"
if ! command -v certbot &> /dev/null; then
    echo -e "${RED}✗ Certbot is not installed${NC}"
    echo ""
    echo "Install Certbot:"
    echo "  Ubuntu/Debian: sudo apt-get install certbot"
    echo "  macOS:         brew install certbot"
    echo "  CentOS/RHEL:   sudo yum install certbot"
    echo ""
    echo "Or visit: https://certbot.eff.org/instructions"
    exit 1
fi
echo -e "${GREEN}✓ Certbot is installed: $(certbot --version 2>&1 | head -1)${NC}"
echo ""

# Display configuration
echo -e "${YELLOW}[2/7] Configuration:${NC}"
echo "  Domain:       ${DOMAIN}"
echo "  Email:        ${EMAIL}"
echo "  Challenge:    $([ -n "$DNS_PROVIDER" ] && echo "DNS-01 ($DNS_PROVIDER)" || echo "HTTP-01")"
echo "  Environment:  $([ "$STAGING" = true ] && echo "Staging (testing)" || echo "Production")"
echo ""

# Prepare NGINX for certificate generation
echo -e "${YELLOW}[3/7] Preparing NGINX for certificate generation...${NC}"

if [ -z "$DNS_PROVIDER" ]; then
    # HTTP-01 challenge requires .well-known/acme-challenge to be accessible
    echo "  Setting up HTTP-01 challenge..."
    
    # Create webroot directory
    mkdir -p "${WEBROOT}"
    
    # Create temporary NGINX configuration for ACME challenge
    cat > "/tmp/nginx-acme.conf" << EOF
server {
    listen 80;
    server_name ${DOMAIN};

    location /.well-known/acme-challenge/ {
        root ${WEBROOT};
    }

    location / {
        return 301 https://\$server_name\$request_uri;
    }
}
EOF
    
    echo -e "${GREEN}✓ HTTP-01 challenge configured${NC}"
else
    echo "  Using DNS-01 challenge with ${DNS_PROVIDER}"
    echo -e "${GREEN}✓ DNS challenge will be used${NC}"
fi
echo ""

# Build certbot command
echo -e "${YELLOW}[4/7] Preparing certificate request...${NC}"

CERTBOT_CMD="certbot certonly --non-interactive --agree-tos"
CERTBOT_CMD="$CERTBOT_CMD --email ${EMAIL}"
CERTBOT_CMD="$CERTBOT_CMD --domain ${DOMAIN}"

if [ "$STAGING" = true ]; then
    CERTBOT_CMD="$CERTBOT_CMD --staging"
fi

if [ -n "$DNS_PROVIDER" ]; then
    # DNS challenge
    CERTBOT_CMD="$CERTBOT_CMD --dns-${DNS_PROVIDER}"
    echo "  Using DNS-01 challenge with ${DNS_PROVIDER}"
    echo -e "${YELLOW}  Note: Ensure DNS provider credentials are configured${NC}"
else
    # HTTP challenge
    CERTBOT_CMD="$CERTBOT_CMD --webroot --webroot-path ${WEBROOT}"
    echo "  Using HTTP-01 challenge"
fi

echo -e "${GREEN}✓ Certificate request prepared${NC}"
echo ""

# Request certificate
echo -e "${YELLOW}[5/7] Requesting certificate from Let's Encrypt...${NC}"
echo "  This may take a minute..."
echo ""

if eval $CERTBOT_CMD; then
    echo ""
    echo -e "${GREEN}✓ Certificate obtained successfully!${NC}"
else
    echo ""
    echo -e "${RED}✗ Certificate request failed${NC}"
    echo ""
    echo "Troubleshooting:"
    echo "  1. Ensure domain ${DOMAIN} points to this server"
    echo "  2. Check that ports 80/443 are accessible (for HTTP-01)"
    echo "  3. Verify DNS provider credentials (for DNS-01)"
    echo "  4. Check Certbot logs: /var/log/letsencrypt/"
    exit 1
fi
echo ""

# Copy certificates to NGINX secrets directory
echo -e "${YELLOW}[6/7] Installing certificates...${NC}"

LETSENCRYPT_CERT="${LETSENCRYPT_DIR}/live/${DOMAIN}/fullchain.pem"
LETSENCRYPT_KEY="${LETSENCRYPT_DIR}/live/${DOMAIN}/privkey.pem"

if [ ! -f "$LETSENCRYPT_CERT" ] || [ ! -f "$LETSENCRYPT_KEY" ]; then
    echo -e "${RED}✗ Certificate files not found in Let's Encrypt directory${NC}"
    exit 1
fi

# Create symbolic links to Let's Encrypt certificates
mkdir -p "${SECRETS_DIR}"
ln -sf "$LETSENCRYPT_CERT" "${SECRETS_DIR}/cert.pem"
ln -sf "$LETSENCRYPT_KEY" "${SECRETS_DIR}/key.pem"
ln -sf "${LETSENCRYPT_DIR}/live/${DOMAIN}/fullchain.pem" "${SECRETS_DIR}/fullchain.pem"
ln -sf "${LETSENCRYPT_DIR}/live/${DOMAIN}/chain.pem" "${SECRETS_DIR}/chain.pem"

echo -e "${GREEN}✓ Certificates installed to ${SECRETS_DIR}${NC}"
echo ""

# Setup automatic renewal
echo -e "${YELLOW}[7/7] Setting up automatic renewal...${NC}"

# Create renewal hook script
cat > "${SCRIPT_DIR}/renewal-hook.sh" << 'EOF'
#!/bin/bash
# Let's Encrypt renewal hook - reloads NGINX after successful renewal

if [ "$RENEWED_LINEAGE" != "" ]; then
    echo "Certificate renewed: $RENEWED_LINEAGE"
    
    # Reload NGINX in Docker
    if docker ps --format '{{.Names}}' | grep -q "nginx-proxy-edge"; then
        docker exec nginx-proxy-edge nginx -s reload
        echo "NGINX reloaded successfully"
    fi
fi
EOF

chmod +x "${SCRIPT_DIR}/renewal-hook.sh"

# Add renewal hook to certbot renewal configuration
RENEWAL_CONF="${LETSENCRYPT_DIR}/renewal/${DOMAIN}.conf"
if [ -f "$RENEWAL_CONF" ]; then
    if ! grep -q "post_hook" "$RENEWAL_CONF"; then
        echo "post_hook = ${SCRIPT_DIR}/renewal-hook.sh" >> "$RENEWAL_CONF"
    fi
fi

# Test renewal (dry run)
if certbot renew --dry-run &> /dev/null; then
    echo -e "${GREEN}✓ Automatic renewal configured and tested${NC}"
else
    echo -e "${YELLOW}⚠ Automatic renewal test had issues (but may still work)${NC}"
fi

# Create systemd timer for auto-renewal (if systemd is available)
if command -v systemctl &> /dev/null; then
    echo -e "${YELLOW}  Setting up systemd timer for auto-renewal...${NC}"
    # Note: This requires root access, so we just provide instructions
    echo -e "${BLUE}  Manual step required (requires root):${NC}"
    echo ""
    echo "    sudo systemctl enable certbot.timer"
    echo "    sudo systemctl start certbot.timer"
    echo ""
fi

echo ""

# Summary
echo -e "${GREEN}=================================================================================================${NC}"
echo -e "${GREEN}✓ Let's Encrypt Setup Completed Successfully!${NC}"
echo -e "${GREEN}=================================================================================================${NC}"
echo ""
echo -e "${BLUE}Certificate Information:${NC}"
openssl x509 -in "${SECRETS_DIR}/cert.pem" -noout -subject -issuer -dates
echo ""
echo -e "${BLUE}Certificate Files:${NC}"
echo "  ${SECRETS_DIR}/cert.pem       -> ${LETSENCRYPT_CERT}"
echo "  ${SECRETS_DIR}/key.pem        -> ${LETSENCRYPT_KEY}"
echo "  ${SECRETS_DIR}/fullchain.pem  -> ${LETSENCRYPT_DIR}/live/${DOMAIN}/fullchain.pem"
echo ""
echo -e "${BLUE}Automatic Renewal:${NC}"
echo "  Certbot will automatically renew certificates before expiration"
echo "  Manual renewal: certbot renew"
echo "  Test renewal:   certbot renew --dry-run"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "  1. Start/restart NGINX: nx run nginx:serve --configuration=production"
echo "  2. Verify HTTPS: curl https://${DOMAIN}"
echo "  3. Test SSL: https://www.ssllabs.com/ssltest/analyze.html?d=${DOMAIN}"
echo ""
if [ "$STAGING" = true ]; then
    echo -e "${YELLOW}⚠ Note: You used the staging server. Certificates are not trusted by browsers.${NC}"
    echo -e "${YELLOW}  Run again without --staging for production certificates.${NC}"
    echo ""
fi
echo -e "${GREEN}=================================================================================================${NC}"
