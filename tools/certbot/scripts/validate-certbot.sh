#!/bin/bash
# =================================================================================================
# Certbot Configuration Validation Script
# =================================================================================================

set -e

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=================================================================================================${NC}"
echo -e "${BLUE}Certbot Configuration Validation${NC}"
echo -e "${BLUE}=================================================================================================${NC}"
echo ""

# Check if certbot is installed
echo -e "${YELLOW}[1/5] Checking certbot installation...${NC}"
if command -v certbot &> /dev/null; then
    VERSION=$(certbot --version 2>&1 | head -1)
    echo -e "${GREEN}✓ Certbot is installed: ${VERSION}${NC}"
else
    echo -e "${RED}✗ Certbot is not installed${NC}"
    echo "  Run: nx run certbot:install"
    exit 1
fi
echo ""

# Check certbot plugins
echo -e "${YELLOW}[2/5] Checking certbot plugins...${NC}"
PLUGINS=$(certbot plugins 2>&1)
if echo "$PLUGINS" | grep -q "nginx"; then
    echo -e "${GREEN}✓ NGINX plugin is available${NC}"
else
    echo -e "${YELLOW}⚠ NGINX plugin not found${NC}"
fi
echo ""

# Check Let's Encrypt directories
echo -e "${YELLOW}[3/5] Checking Let's Encrypt directories...${NC}"
LETSENCRYPT_DIR="/etc/letsencrypt"
if [ -d "$LETSENCRYPT_DIR" ]; then
    echo -e "${GREEN}✓ Let's Encrypt directory exists: ${LETSENCRYPT_DIR}${NC}"
    
    # Check for certificates
    if [ -d "${LETSENCRYPT_DIR}/live" ]; then
        CERT_COUNT=$(find "${LETSENCRYPT_DIR}/live" -maxdepth 1 -type d 2>/dev/null | wc -l)
        # Subtract 1 for the parent directory itself
        CERT_COUNT=$((CERT_COUNT - 1))
        if [ "$CERT_COUNT" -gt 0 ]; then
            echo -e "${GREEN}✓ Found ${CERT_COUNT} certificate(s)${NC}"
        else
            echo -e "${YELLOW}⚠ No certificates found${NC}"
        fi
    else
        echo -e "${YELLOW}⚠ No certificates directory found${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Let's Encrypt directory not found${NC}"
fi
echo ""

# Check Docker setup (if Docker is available)
echo -e "${YELLOW}[4/5] Checking Docker setup...${NC}"
if command -v docker &> /dev/null; then
    if docker images | grep -q "monorepo/certbot"; then
        echo -e "${GREEN}✓ Certbot Docker image exists${NC}"
    else
        echo -e "${YELLOW}⚠ Certbot Docker image not built${NC}"
        echo "  Run: nx run certbot:docker:build"
    fi
else
    echo -e "${YELLOW}⚠ Docker not available${NC}"
fi
echo ""

# Summary
echo -e "${YELLOW}[5/5] Validation summary${NC}"
echo -e "${GREEN}✓ Validation complete${NC}"
echo ""

echo -e "${BLUE}=================================================================================================${NC}"
echo -e "${BLUE}Next Steps${NC}"
echo -e "${BLUE}=================================================================================================${NC}"
echo ""
echo "To install certbot:"
echo "  nx run certbot:install"
echo ""
echo "To obtain a certificate:"
echo "  nx run certbot:setup-letsencrypt -- --domain yourdomain.com --email your@email.com"
echo ""
echo "To use Docker:"
echo "  nx run certbot:docker:build"
echo "  nx run certbot:docker:certonly"
echo ""
