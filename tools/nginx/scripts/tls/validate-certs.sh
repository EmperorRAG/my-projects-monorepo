#!/bin/bash
# =================================================================================================
# TLS Certificate Validation Script
# =================================================================================================
#
# This script validates TLS certificates for the NGINX infrastructure.
# It checks:
# - Certificate file existence
# - Certificate validity and expiration
# - Private key match
# - Certificate chain
# - Key permissions
#
# Usage:
#   ./tools/nginx/scripts/tls/validate-certs.sh
#   nx run nginx:tls:validate-certs
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

# Certificate files
CERT_FILE="${SECRETS_DIR}/cert.pem"
KEY_FILE="${SECRETS_DIR}/key.pem"

# Validation counters
CHECKS_PASSED=0
CHECKS_FAILED=0
CHECKS_WARNING=0

# Helper function to print status
print_status() {
    local status=$1
    local message=$2
    
    case "$status" in
        "PASS")
            echo -e "${GREEN}✓${NC} $message"
            ((CHECKS_PASSED++))
            ;;
        "FAIL")
            echo -e "${RED}✗${NC} $message"
            ((CHECKS_FAILED++))
            ;;
        "WARN")
            echo -e "${YELLOW}⚠${NC} $message"
            ((CHECKS_WARNING++))
            ;;
        "INFO")
            echo -e "${BLUE}ℹ${NC} $message"
            ;;
    esac
}

echo -e "${BLUE}=================================================================================================${NC}"
echo -e "${BLUE}TLS Certificate Validation${NC}"
echo -e "${BLUE}=================================================================================================${NC}"
echo ""

# Check if openssl is installed
if ! command -v openssl &> /dev/null; then
    print_status "FAIL" "openssl is not installed"
    echo ""
    echo "Please install openssl to validate certificates"
    exit 1
fi

# Check 1: Certificate file exists
echo -e "${YELLOW}[1/8] Checking certificate file...${NC}"
if [ -f "${CERT_FILE}" ]; then
    print_status "PASS" "Certificate file exists: ${CERT_FILE}"
else
    print_status "FAIL" "Certificate file not found: ${CERT_FILE}"
    echo ""
    echo "Generate certificates with: nx run nginx:tls:generate-dev-certs"
    exit 1
fi
echo ""

# Check 2: Private key file exists
echo -e "${YELLOW}[2/8] Checking private key file...${NC}"
if [ -f "${KEY_FILE}" ]; then
    print_status "PASS" "Private key file exists: ${KEY_FILE}"
else
    print_status "FAIL" "Private key file not found: ${KEY_FILE}"
    echo ""
    echo "Generate certificates with: nx run nginx:tls:generate-dev-certs"
    exit 1
fi
echo ""

# Check 3: File permissions
echo -e "${YELLOW}[3/8] Checking file permissions...${NC}"
CERT_PERMS=$(stat -c "%a" "${CERT_FILE}" 2>/dev/null || stat -f "%Lp" "${CERT_FILE}" 2>/dev/null || echo "000")
KEY_PERMS=$(stat -c "%a" "${KEY_FILE}" 2>/dev/null || stat -f "%Lp" "${KEY_FILE}" 2>/dev/null || echo "000")

if [ "$CERT_PERMS" = "644" ] || [ "$CERT_PERMS" = "444" ]; then
    print_status "PASS" "Certificate permissions are correct: ${CERT_PERMS}"
else
    print_status "WARN" "Certificate permissions: ${CERT_PERMS} (recommended: 644)"
fi

if [ "$KEY_PERMS" = "600" ] || [ "$KEY_PERMS" = "400" ]; then
    print_status "PASS" "Private key permissions are secure: ${KEY_PERMS}"
else
    print_status "WARN" "Private key permissions: ${KEY_PERMS} (recommended: 600)"
    echo -e "${YELLOW}  Fix with: chmod 600 ${KEY_FILE}${NC}"
fi
echo ""

# Check 4: Certificate validity
echo -e "${YELLOW}[4/8] Checking certificate validity...${NC}"
if openssl x509 -in "${CERT_FILE}" -noout -checkend 0 2>/dev/null; then
    print_status "PASS" "Certificate is valid and not expired"
    
    # Get expiration date
    EXPIRY=$(openssl x509 -in "${CERT_FILE}" -noout -enddate | cut -d= -f2)
    EXPIRY_EPOCH=$(date -d "${EXPIRY}" +%s 2>/dev/null || date -j -f "%b %d %T %Y %Z" "${EXPIRY}" +%s 2>/dev/null)
    NOW_EPOCH=$(date +%s)
    DAYS_LEFT=$(( (EXPIRY_EPOCH - NOW_EPOCH) / 86400 ))
    
    if [ ${DAYS_LEFT} -lt 30 ]; then
        print_status "WARN" "Certificate expires in ${DAYS_LEFT} days (${EXPIRY})"
        echo -e "${YELLOW}  Consider renewing soon${NC}"
    else
        print_status "INFO" "Certificate expires in ${DAYS_LEFT} days (${EXPIRY})"
    fi
else
    print_status "FAIL" "Certificate is expired or invalid"
    EXPIRY=$(openssl x509 -in "${CERT_FILE}" -noout -enddate | cut -d= -f2)
    echo -e "${RED}  Expired: ${EXPIRY}${NC}"
    echo -e "${YELLOW}  Regenerate with: nx run nginx:tls:generate-dev-certs${NC}"
fi
echo ""

# Check 5: Certificate and key match
echo -e "${YELLOW}[5/8] Checking certificate and key match...${NC}"
CERT_MODULUS=$(openssl x509 -noout -modulus -in "${CERT_FILE}" 2>/dev/null | openssl md5)
KEY_MODULUS=$(openssl rsa -noout -modulus -in "${KEY_FILE}" 2>/dev/null | openssl md5)

if [ "${CERT_MODULUS}" = "${KEY_MODULUS}" ]; then
    print_status "PASS" "Certificate and private key match"
else
    print_status "FAIL" "Certificate and private key do not match"
    echo -e "${RED}  This will prevent NGINX from starting!${NC}"
fi
echo ""

# Check 6: Certificate details
echo -e "${YELLOW}[6/8] Extracting certificate details...${NC}"
CN=$(openssl x509 -in "${CERT_FILE}" -noout -subject | sed -n 's/.*CN[[:space:]]*=[[:space:]]*\([^,]*\).*/\1/p')
ISSUER=$(openssl x509 -in "${CERT_FILE}" -noout -issuer | sed -n 's/.*CN[[:space:]]*=[[:space:]]*\([^,]*\).*/\1/p')
print_status "INFO" "Common Name (CN): ${CN}"
print_status "INFO" "Issuer: ${ISSUER}"

# Check if self-signed
if [ "${CN}" = "${ISSUER}" ]; then
    print_status "WARN" "Certificate is self-signed (development only)"
else
    print_status "INFO" "Certificate is CA-signed"
fi
echo ""

# Check 7: Subject Alternative Names
echo -e "${YELLOW}[7/8] Checking Subject Alternative Names (SAN)...${NC}"
SANS=$(openssl x509 -in "${CERT_FILE}" -noout -text 2>/dev/null | grep -A1 "Subject Alternative Name" | tail -1 | sed 's/^[[:space:]]*//')
if [ -n "${SANS}" ]; then
    print_status "PASS" "SAN entries found"
    echo -e "${BLUE}  ${SANS}${NC}"
else
    print_status "WARN" "No Subject Alternative Names found"
    echo -e "${YELLOW}  Modern browsers require SANs for certificate validation${NC}"
fi
echo ""

# Check 8: Key strength
echo -e "${YELLOW}[8/8] Checking key strength...${NC}"
KEY_BITS=$(openssl rsa -in "${KEY_FILE}" -text -noout 2>/dev/null | grep "Private-Key:" | sed 's/.*(\([0-9]*\) bit.*/\1/')
if [ ${KEY_BITS} -ge 2048 ]; then
    print_status "PASS" "Key strength is adequate: ${KEY_BITS} bits"
else
    print_status "WARN" "Key strength is weak: ${KEY_BITS} bits (recommended: 2048+)"
fi
echo ""

# Full certificate information
echo -e "${BLUE}Full Certificate Information:${NC}"
echo "─────────────────────────────────────────────────────────────────────────────────────────────"
openssl x509 -in "${CERT_FILE}" -noout -text 2>/dev/null | head -20
echo "─────────────────────────────────────────────────────────────────────────────────────────────"
echo ""

# Summary
echo -e "${BLUE}=================================================================================================${NC}"
echo -e "${BLUE}Validation Summary${NC}"
echo -e "${BLUE}=================================================================================================${NC}"
echo ""
echo -e "${GREEN}Checks Passed: ${CHECKS_PASSED}${NC}"
echo -e "${YELLOW}Warnings:      ${CHECKS_WARNING}${NC}"
echo -e "${RED}Checks Failed: ${CHECKS_FAILED}${NC}"
echo ""

if [ ${CHECKS_FAILED} -gt 0 ]; then
    echo -e "${RED}✗ Validation failed with ${CHECKS_FAILED} error(s)${NC}"
    echo ""
    echo "Fix the errors above before using these certificates with NGINX"
    exit 1
elif [ ${CHECKS_WARNING} -gt 0 ]; then
    echo -e "${YELLOW}⚠ Validation completed with ${CHECKS_WARNING} warning(s)${NC}"
    echo ""
    echo "Certificates are usable but consider addressing the warnings above"
    exit 0
else
    echo -e "${GREEN}✓ All validation checks passed!${NC}"
    echo ""
    echo "Certificates are ready to use with NGINX"
    exit 0
fi
