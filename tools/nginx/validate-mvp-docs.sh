#!/bin/bash
# =================================================================================================
# MVP Documentation Validation Script
# =================================================================================================
#
# This script validates that the MVP documentation is complete and followable.
# It checks for:
# - Required files exist
# - Documentation references are correct
# - Configuration examples are present
# - Commands are documented
#
# Usage: ./validate-mvp-docs.sh
#
# =================================================================================================

set -eo pipefail

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
PASS=0
FAIL=0
WARN=0

# Helper functions
print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_pass() {
    echo -e "${GREEN}✓ $1${NC}"
    PASS=$((PASS+1))
}

print_fail() {
    echo -e "${RED}✗ $1${NC}"
    FAIL=$((FAIL+1))
}

print_warn() {
    echo -e "${YELLOW}⚠ $1${NC}"
    WARN=$((WARN+1))
}

check_file_exists() {
    if [ -f "$1" ]; then
        print_pass "Found: $1"
        return 0
    else
        print_fail "Missing: $1"
        return 1
    fi
}

check_content() {
    local file=$1
    local pattern=$2
    local description=$3
    
    if grep -qi "$pattern" "$file" 2>/dev/null; then
        print_pass "$description in $file"
        return 0
    else
        print_fail "$description missing in $file"
        return 1
    fi
}

# =================================================================================================
# Main Validation
# =================================================================================================

print_header "MVP Documentation Validation"
echo ""

# Check MVP core files
print_header "1. Core MVP Files"
check_file_exists "docs/tools/nginx/MVP-INDEX.md"
check_file_exists "docs/tools/nginx/MVP-QUICKSTART.md"
check_file_exists "docs/tools/nginx/MVP-README.md"
check_file_exists "docs/tools/nginx/MVP-STRIPPING-SUMMARY.md"
check_file_exists "tools/nginx/docker-compose.mvp.yaml"
echo ""

# Check updated integration guide
print_header "2. Updated Integration Guide"
check_file_exists "docs/tools/nginx/integration/nginx-integration.md"
check_content "docs/tools/nginx/integration/nginx-integration.md" "2 NGINX load balancers" "2 LB topology"
check_content "docs/tools/nginx/integration/nginx-integration.md" "3 instances" "3 instances requirement"
echo ""

# Check architecture updates
print_header "3. Architecture Documentation"
check_file_exists "docs/tools/nginx/architecture/overview.md"
check_content "docs/tools/nginx/architecture/overview.md" "2 Load Balancers" "2 LB architecture"
echo ""

# Check MVP requirements are documented
print_header "4. MVP Requirements Coverage"
check_content "docs/tools/nginx/MVP-INDEX.md" "reverse proxy" "Requirement 1: Reverse proxy"
check_content "docs/tools/nginx/MVP-INDEX.md" "load balancers" "Requirement 2: 2 Load balancers"
check_content "docs/tools/nginx/MVP-INDEX.md" "instances" "Requirement 3: 3 instances per service"
check_content "docs/tools/nginx/MVP-INDEX.md" "TLS" "Requirement 4: TLS functionality"
check_content "docs/tools/nginx/MVP-INDEX.md" "Certbot" "Requirement 5: Certbot"
check_content "docs/tools/nginx/MVP-INDEX.md" "Nx" "Requirement 6: Nx integration"
check_content "docs/tools/nginx/MVP-INDEX.md" "Docker" "Requirement 7: Docker Compose"
echo ""

# Check Docker Compose MVP config
print_header "5. Docker Compose MVP Configuration"
check_content "tools/nginx/docker-compose.mvp.yaml" "proxy-edge" "Edge proxy service"
check_content "tools/nginx/docker-compose.mvp.yaml" "lb-frontend" "Frontend load balancer"
check_content "tools/nginx/docker-compose.mvp.yaml" "lb-email" "Email load balancer"
check_content "tools/nginx/docker-compose.mvp.yaml" "my-programs-app-1" "Frontend instance 1"
check_content "tools/nginx/docker-compose.mvp.yaml" "my-programs-app-2" "Frontend instance 2"
check_content "tools/nginx/docker-compose.mvp.yaml" "my-programs-app-3" "Frontend instance 3"
check_content "tools/nginx/docker-compose.mvp.yaml" "my-nest-js-email-microservice-1" "Email instance 1"
check_content "tools/nginx/docker-compose.mvp.yaml" "my-nest-js-email-microservice-2" "Email instance 2"
check_content "tools/nginx/docker-compose.mvp.yaml" "my-nest-js-email-microservice-3" "Email instance 3"

# Check NO lb-api in MVP
if grep -q "lb-api" "tools/nginx/docker-compose.mvp.yaml" 2>/dev/null; then
    print_fail "lb-api should NOT be in MVP docker-compose"
else
    print_pass "lb-api correctly excluded from MVP"
fi
echo ""

# Check essential commands are documented
print_header "6. Essential Commands Documentation"
check_content "docs/tools/nginx/MVP-INDEX.md" "nx run nginx:up" "Start command"
check_content "docs/tools/nginx/MVP-INDEX.md" "nx run nginx:down" "Stop command"
check_content "docs/tools/nginx/MVP-INDEX.md" "nx run certbot:install" "Certbot install"
check_content "docs/tools/nginx/MVP-INDEX.md" "nx run nginx:tls:generate-dev-certs" "Dev certs"
echo ""

# Check TLS/Certbot documentation
print_header "7. TLS/Certbot Setup"
check_content "docs/tools/nginx/integration/nginx-integration.md" "Certbot" "Certbot mentioned"
check_content "docs/tools/nginx/integration/nginx-integration.md" "Let's Encrypt" "Let's Encrypt setup"
check_content "docs/tools/nginx/MVP-QUICKSTART.md" "TLS" "TLS setup in quickstart"
echo ""

# Check implementation workflow
print_header "8. Implementation Workflow"
check_content "docs/tools/nginx/MVP-INDEX.md" "Phase 1" "Phase 1 workflow"
check_content "docs/tools/nginx/MVP-INDEX.md" "Phase 2" "Phase 2 workflow"
check_content "docs/tools/nginx/MVP-INDEX.md" "Phase 3" "Phase 3 workflow"
check_content "docs/tools/nginx/MVP-INDEX.md" "checklist" "MVP checklist"
echo ""

# Check troubleshooting
print_header "9. Troubleshooting Documentation"
check_content "docs/tools/nginx/MVP-QUICKSTART.md" "Troubleshooting" "Troubleshooting section"
check_content "docs/tools/nginx/integration/nginx-integration.md" "Troubleshooting" "Troubleshooting in integration"
echo ""

# Check stripping summary
print_header "10. Stripping Documentation"
check_content "docs/tools/nginx/MVP-STRIPPING-SUMMARY.md" "What Was Stripped" "Stripping report"
check_content "docs/tools/nginx/MVP-STRIPPING-SUMMARY.md" "lb-api" "API LB removal documented"
check_content "docs/tools/nginx/MVP-STRIPPING-SUMMARY.md" "Kubernetes" "Kubernetes removal documented"
echo ""

# Summary
print_header "Validation Summary"
echo -e "Passed: ${GREEN}${PASS}${NC}"
echo -e "Failed: ${RED}${FAIL}${NC}"
echo -e "Warnings: ${YELLOW}${WARN}${NC}"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}✓ All MVP documentation validation checks passed!${NC}"
    echo -e "${GREEN}The MVP documentation is complete and followable.${NC}"
    exit 0
else
    echo -e "${RED}✗ Some validation checks failed.${NC}"
    echo -e "${YELLOW}Please review the failures above.${NC}"
    exit 1
fi
