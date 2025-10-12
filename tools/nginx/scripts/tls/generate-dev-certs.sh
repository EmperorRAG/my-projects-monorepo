#!/bin/bash
# =================================================================================================
# TLS Certificate Generation Script - Development
# =================================================================================================
#
# This script generates self-signed TLS certificates for local development and testing.
# These certificates are NOT suitable for production use.
#
# For production, use:
# - Let's Encrypt (free, automated)
# - Commercial CA certificates
# - Internal PKI infrastructure
#
# Usage:
#   ./tools/nginx/scripts/tls/generate-dev-certs.sh
#   nx run nginx:tls:generate-dev-certs
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

# Certificate configuration
CERT_DAYS=365
CERT_BITS=2048
COUNTRY="US"
STATE="Development"
CITY="Local"
ORG="Dev Organization"
ORG_UNIT="Development"
COMMON_NAME="localhost"

# Alternative names for the certificate
ALT_NAMES="DNS:localhost,DNS:*.localhost,DNS:dev.local,DNS:*.dev.local,IP:127.0.0.1,IP:::1"

echo -e "${BLUE}=================================================================================================${NC}"
echo -e "${BLUE}TLS Certificate Generation - Development${NC}"
echo -e "${BLUE}=================================================================================================${NC}"
echo ""

# Check if openssl is installed
if ! command -v openssl &> /dev/null; then
    echo -e "${RED}ERROR: openssl is not installed${NC}"
    echo "Please install openssl to generate certificates"
    echo ""
    echo "Installation:"
    echo "  macOS:   brew install openssl"
    echo "  Ubuntu:  sudo apt-get install openssl"
    echo "  Windows: Download from https://slproweb.com/products/Win32OpenSSL.html"
    exit 1
fi

# Create secrets directory if it doesn't exist
echo -e "${YELLOW}[1/5] Creating secrets directory...${NC}"
mkdir -p "${SECRETS_DIR}"
echo -e "${GREEN}✓ Directory created: ${SECRETS_DIR}${NC}"
echo ""

# Generate private key
echo -e "${YELLOW}[2/5] Generating private key (${CERT_BITS} bits)...${NC}"
openssl genrsa -out "${SECRETS_DIR}/key.pem" ${CERT_BITS} 2>/dev/null
chmod 600 "${SECRETS_DIR}/key.pem"
echo -e "${GREEN}✓ Private key generated: ${SECRETS_DIR}/key.pem${NC}"
echo ""

# Create OpenSSL configuration for certificate
echo -e "${YELLOW}[3/5] Creating certificate configuration...${NC}"
cat > "${SECRETS_DIR}/openssl.cnf" << EOF
[req]
default_bits = ${CERT_BITS}
prompt = no
default_md = sha256
distinguished_name = dn
req_extensions = v3_req

[dn]
C = ${COUNTRY}
ST = ${STATE}
L = ${CITY}
O = ${ORG}
OU = ${ORG_UNIT}
CN = ${COMMON_NAME}

[v3_req]
keyUsage = digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth
subjectAltName = ${ALT_NAMES}

[v3_ca]
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid:always,issuer
basicConstraints = critical, CA:true
keyUsage = critical, digitalSignature, cRLSign, keyCertSign
EOF
echo -e "${GREEN}✓ Configuration created${NC}"
echo ""

# Generate self-signed certificate
echo -e "${YELLOW}[4/5] Generating self-signed certificate (valid for ${CERT_DAYS} days)...${NC}"
openssl req -new -x509 \
    -key "${SECRETS_DIR}/key.pem" \
    -out "${SECRETS_DIR}/cert.pem" \
    -days ${CERT_DAYS} \
    -config "${SECRETS_DIR}/openssl.cnf" \
    -extensions v3_req \
    2>/dev/null
chmod 644 "${SECRETS_DIR}/cert.pem"
echo -e "${GREEN}✓ Certificate generated: ${SECRETS_DIR}/cert.pem${NC}"
echo ""

# Display certificate information
echo -e "${YELLOW}[5/5] Certificate Information:${NC}"
echo "─────────────────────────────────────────────────────────────────────────────────────────────"
openssl x509 -in "${SECRETS_DIR}/cert.pem" -noout -text | grep -A 3 "Subject:\|Issuer:\|Validity\|DNS:\|IP Address:"
echo "─────────────────────────────────────────────────────────────────────────────────────────────"
echo ""

# Create fullchain (for compatibility)
echo -e "${YELLOW}Creating fullchain certificate...${NC}"
cp "${SECRETS_DIR}/cert.pem" "${SECRETS_DIR}/fullchain.pem"
echo -e "${GREEN}✓ Fullchain created: ${SECRETS_DIR}/fullchain.pem${NC}"
echo ""

# Create README in secrets directory
cat > "${SECRETS_DIR}/README.md" << 'EOF'
# TLS Certificates

This directory contains TLS certificates for the NGINX infrastructure.

## Files

- `cert.pem` - Server certificate (public)
- `key.pem` - Private key (keep secret!)
- `fullchain.pem` - Full certificate chain (same as cert.pem for self-signed)
- `openssl.cnf` - OpenSSL configuration used for generation

## Development Certificates

The certificates in this directory are **self-signed** and only suitable for:
- Local development
- Testing
- Internal development environments

**DO NOT** use these certificates in production!

## Security Notes

⚠️ **IMPORTANT:**
- The `key.pem` file contains the private key - keep it secret!
- This directory is git-ignored to prevent accidental commits
- Certificates expire after 365 days - regenerate when needed
- Browsers will show security warnings for self-signed certificates (this is expected)

## Production Certificates

For production, use:
1. **Let's Encrypt** (free, automated, recommended)
   - Use `nx run nginx:tls:setup-letsencrypt` for automated setup
2. **Commercial CA** (DigiCert, GlobalSign, etc.)
3. **Internal PKI** (for enterprise environments)

## Trusting Development Certificates

To avoid browser warnings in development:

### macOS
```bash
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain tools/nginx/secrets/tls/cert.pem
```

### Linux (Ubuntu/Debian)
```bash
sudo cp tools/nginx/secrets/tls/cert.pem /usr/local/share/ca-certificates/nginx-dev.crt
sudo update-ca-certificates
```

### Windows
1. Double-click `cert.pem`
2. Click "Install Certificate"
3. Choose "Local Machine"
4. Place in "Trusted Root Certification Authorities"

### Firefox (all platforms)
1. Open Firefox Settings → Privacy & Security → Certificates
2. Click "View Certificates" → "Authorities" → "Import"
3. Select `cert.pem` and trust for websites

## Regenerating Certificates

To regenerate development certificates:
```bash
nx run nginx:tls:generate-dev-certs
```

## Validation

To validate certificates:
```bash
nx run nginx:tls:validate-certs
```
EOF

echo -e "${GREEN}✓ README created: ${SECRETS_DIR}/README.md${NC}"
echo ""

# Summary
echo -e "${GREEN}=================================================================================================${NC}"
echo -e "${GREEN}✓ TLS Certificates Generated Successfully!${NC}"
echo -e "${GREEN}=================================================================================================${NC}"
echo ""
echo -e "${BLUE}Location:${NC} ${SECRETS_DIR}"
echo ""
echo -e "${BLUE}Files Created:${NC}"
echo "  - cert.pem       (Certificate)"
echo "  - key.pem        (Private Key)"
echo "  - fullchain.pem  (Full Chain)"
echo "  - openssl.cnf    (Configuration)"
echo "  - README.md      (Documentation)"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "  1. Start NGINX with TLS: nx run nginx:serve --configuration=production"
echo "  2. Test HTTPS: curl -k https://localhost"
echo "  3. Validate certs: nx run nginx:tls:validate-certs"
echo ""
echo -e "${YELLOW}⚠️  Note: Browsers will show security warnings for self-signed certificates${NC}"
echo -e "${YELLOW}   This is expected behavior. For production, use Let's Encrypt or commercial certificates.${NC}"
echo ""
echo -e "${BLUE}To trust these certificates in your browser/system, see:${NC}"
echo "  ${SECRETS_DIR}/README.md"
echo ""
echo -e "${GREEN}=================================================================================================${NC}"
