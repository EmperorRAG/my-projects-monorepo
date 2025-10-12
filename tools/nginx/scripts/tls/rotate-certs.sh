#!/bin/bash
# =================================================================================================
# TLS Certificate Rotation Script
# =================================================================================================
#
# This script rotates TLS certificates by:
# 1. Backing up existing certificates
# 2. Generating new certificates
# 3. Gracefully reloading NGINX with zero downtime
# 4. Validating the new certificates
#
# Usage:
#   ./tools/nginx/scripts/tls/rotate-certs.sh [--no-backup] [--no-reload]
#   nx run nginx:tls:rotate-certs
#
# Options:
#   --no-backup   Skip creating backup of existing certificates
#   --no-reload   Skip reloading NGINX after rotation
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
BACKUP_DIR="${SECRETS_DIR}/backups"

# Options
DO_BACKUP=true
DO_RELOAD=true

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --no-backup)
            DO_BACKUP=false
            shift
            ;;
        --no-reload)
            DO_RELOAD=false
            shift
            ;;
        *)
            echo "Unknown option: $1"
            echo "Usage: $0 [--no-backup] [--no-reload]"
            exit 1
            ;;
    esac
done

echo -e "${BLUE}=================================================================================================${NC}"
echo -e "${BLUE}TLS Certificate Rotation${NC}"
echo -e "${BLUE}=================================================================================================${NC}"
echo ""

# Check if certificates exist
if [ ! -f "${SECRETS_DIR}/cert.pem" ] || [ ! -f "${SECRETS_DIR}/key.pem" ]; then
    echo -e "${YELLOW}⚠ No existing certificates found${NC}"
    echo "This appears to be a new installation. Use generate-dev-certs.sh instead."
    echo ""
    echo "Run: nx run nginx:tls:generate-dev-certs"
    exit 1
fi

# Step 1: Backup existing certificates
if [ "$DO_BACKUP" = true ]; then
    echo -e "${YELLOW}[1/5] Backing up existing certificates...${NC}"
    
    # Create backup directory with timestamp
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_PATH="${BACKUP_DIR}/${TIMESTAMP}"
    mkdir -p "${BACKUP_PATH}"
    
    # Copy existing certificates
    cp "${SECRETS_DIR}/cert.pem" "${BACKUP_PATH}/cert.pem"
    cp "${SECRETS_DIR}/key.pem" "${BACKUP_PATH}/key.pem"
    
    if [ -f "${SECRETS_DIR}/fullchain.pem" ]; then
        cp "${SECRETS_DIR}/fullchain.pem" "${BACKUP_PATH}/fullchain.pem"
    fi
    
    if [ -f "${SECRETS_DIR}/openssl.cnf" ]; then
        cp "${SECRETS_DIR}/openssl.cnf" "${BACKUP_PATH}/openssl.cnf"
    fi
    
    # Create backup info file
    cat > "${BACKUP_PATH}/backup.info" << EOF
Certificate Backup Information
===============================
Backup Date: $(date)
Original Location: ${SECRETS_DIR}
Backup Location: ${BACKUP_PATH}

Certificate Details:
$(openssl x509 -in "${BACKUP_PATH}/cert.pem" -noout -subject -issuer -dates)

Restore Command:
  cp ${BACKUP_PATH}/*.pem ${SECRETS_DIR}/
EOF
    
    echo -e "${GREEN}✓ Certificates backed up to: ${BACKUP_PATH}${NC}"
    
    # Clean up old backups (keep last 5)
    echo -e "${YELLOW}  Cleaning up old backups (keeping last 5)...${NC}"
    cd "${BACKUP_DIR}"
    ls -t | tail -n +6 | xargs -r rm -rf
    echo -e "${GREEN}✓ Old backups cleaned up${NC}"
else
    echo -e "${YELLOW}[1/5] Skipping backup (--no-backup specified)${NC}"
fi
echo ""

# Step 2: Generate new certificates
echo -e "${YELLOW}[2/5] Generating new certificates...${NC}"
if [ -x "${SCRIPT_DIR}/generate-dev-certs.sh" ]; then
    "${SCRIPT_DIR}/generate-dev-certs.sh" > /dev/null 2>&1
    echo -e "${GREEN}✓ New certificates generated${NC}"
else
    echo -e "${RED}✗ Certificate generation script not found or not executable${NC}"
    exit 1
fi
echo ""

# Step 3: Validate new certificates
echo -e "${YELLOW}[3/5] Validating new certificates...${NC}"
if [ -x "${SCRIPT_DIR}/validate-certs.sh" ]; then
    if "${SCRIPT_DIR}/validate-certs.sh" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ New certificates validated successfully${NC}"
    else
        echo -e "${RED}✗ Certificate validation failed${NC}"
        echo "Rolling back to previous certificates..."
        
        if [ -d "${BACKUP_PATH}" ]; then
            cp "${BACKUP_PATH}/cert.pem" "${SECRETS_DIR}/cert.pem"
            cp "${BACKUP_PATH}/key.pem" "${SECRETS_DIR}/key.pem"
            echo -e "${GREEN}✓ Rolled back to previous certificates${NC}"
        fi
        exit 1
    fi
else
    echo -e "${YELLOW}⚠ Validation script not found, skipping validation${NC}"
fi
echo ""

# Step 4: Reload NGINX
if [ "$DO_RELOAD" = true ]; then
    echo -e "${YELLOW}[4/5] Reloading NGINX with new certificates...${NC}"
    
    # Check if NGINX is running in Docker
    if command -v docker &> /dev/null; then
        if docker ps --format '{{.Names}}' | grep -q "nginx-proxy-edge"; then
            # Reload NGINX in Docker container
            docker exec nginx-proxy-edge nginx -t &> /dev/null
            if [ $? -eq 0 ]; then
                docker exec nginx-proxy-edge nginx -s reload
                echo -e "${GREEN}✓ NGINX reloaded successfully (edge proxy)${NC}"
            else
                echo -e "${RED}✗ NGINX configuration test failed${NC}"
                exit 1
            fi
        else
            echo -e "${YELLOW}⚠ NGINX container not running${NC}"
            echo "  Start NGINX with: nx run nginx:serve --configuration=production"
        fi
    else
        echo -e "${YELLOW}⚠ Docker not available${NC}"
        echo "  Reload NGINX manually after starting"
    fi
else
    echo -e "${YELLOW}[4/5] Skipping NGINX reload (--no-reload specified)${NC}"
fi
echo ""

# Step 5: Summary
echo -e "${YELLOW}[5/5] Certificate rotation summary:${NC}"
echo "─────────────────────────────────────────────────────────────────────────────────────────────"

# Get certificate info
CERT_SUBJECT=$(openssl x509 -in "${SECRETS_DIR}/cert.pem" -noout -subject | sed 's/subject=//')
CERT_EXPIRY=$(openssl x509 -in "${SECRETS_DIR}/cert.pem" -noout -enddate | sed 's/notAfter=//')
CERT_FINGERPRINT=$(openssl x509 -in "${SECRETS_DIR}/cert.pem" -noout -fingerprint -sha256 | sed 's/SHA256 Fingerprint=//')

echo "New Certificate:"
echo "  Subject: ${CERT_SUBJECT}"
echo "  Expires: ${CERT_EXPIRY}"
echo "  SHA256:  ${CERT_FINGERPRINT}"

if [ "$DO_BACKUP" = true ] && [ -n "${BACKUP_PATH}" ]; then
    echo ""
    echo "Backup Location: ${BACKUP_PATH}"
    echo ""
    echo "Restore command if needed:"
    echo "  cp ${BACKUP_PATH}/*.pem ${SECRETS_DIR}/"
    echo "  nx run nginx:reload-config"
fi

echo "─────────────────────────────────────────────────────────────────────────────────────────────"
echo ""

# Final status
echo -e "${GREEN}=================================================================================================${NC}"
echo -e "${GREEN}✓ Certificate Rotation Completed Successfully!${NC}"
echo -e "${GREEN}=================================================================================================${NC}"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "  1. Verify HTTPS is working: curl -k https://localhost"
echo "  2. Check certificate: openssl s_client -connect localhost:443 -servername localhost"
echo "  3. Monitor NGINX logs: nx run nginx:docker:compose-logs"
echo ""
echo -e "${YELLOW}Note: Browsers may need to be refreshed to recognize the new certificate${NC}"
echo ""
