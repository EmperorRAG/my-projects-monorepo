#!/bin/bash
# Validate PostgreSQL Setup - MVP Version
# Quick validation of database infrastructure

# Note: Not using set -e because we want to continue through all tests

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0

echo -e "${BLUE}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   PostgreSQL Setup Validation - MVP               ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════╝${NC}"
echo ""

# Load environment variables
if [ -f .env ]; then
    set -a
    source .env
    set +a
    echo -e "${GREEN}✓${NC} Environment variables loaded"
else
    echo -e "${RED}✗${NC} .env file not found"
    exit 1
fi

echo ""
echo "Running validation checks..."
echo ""

# Test 1: Docker daemon
echo -n "1. Docker daemon: "
if docker info >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Running${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ Not running${NC}"
    ((FAILED++))
fi

# Test 2: PostgreSQL container
echo -n "2. PostgreSQL container: "
if docker ps | grep -q monorepo-postgres; then
    echo -e "${GREEN}✓ Running${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ Not running${NC}"
    ((FAILED++))
fi

# Test 3: PostgreSQL connectivity
echo -n "3. PostgreSQL connectivity: "
if docker exec monorepo-postgres pg_isready -U "${POSTGRES_USER:-postgres}" >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Accepting connections${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ Not accepting connections${NC}"
    ((FAILED++))
fi

# Test 4: Better Auth database exists
echo -n "4. Better Auth database: "
if docker exec monorepo-postgres psql -U "${POSTGRES_USER:-postgres}" -lqt | cut -d \| -f 1 | grep -qw "${BETTER_AUTH_DB_NAME}"; then
    echo -e "${GREEN}✓ Exists${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ Not found${NC}"
    ((FAILED++))
fi

# Test 5: Prisma Client exists
echo -n "5. Prisma Client: "
if [ -d "better-auth-db/prisma/generated/client" ]; then
    echo -e "${GREEN}✓ Generated${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}! Not generated${NC} (run: npx nx prisma:generate postgresql)"
    ((FAILED++))
fi

# Test 6: Environment variables
echo -n "6. Required env vars: "
if [ -n "${DATABASE_URL}" ] && [ -n "${BETTER_AUTH_DB_NAME}" ]; then
    echo -e "${GREEN}✓ Set${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ Missing${NC}"
    ((FAILED++))
fi

# Test 7: Backup directory
echo -n "7. Backup directory: "
if [ -d "backups" ]; then
    echo -e "${GREEN}✓ Exists${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}! Creating${NC}"
    mkdir -p backups
    ((PASSED++))
fi

# Test 8: Scripts executable
echo -n "8. Scripts executable: "
if [ -x "scripts/backup-db.sh" ] && [ -x "scripts/restore-db.sh" ] && [ -x "scripts/health-check.sh" ]; then
    echo -e "${GREEN}✓ Ready${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}! Setting permissions${NC}"
    chmod +x scripts/*.sh 2>/dev/null || true
    ((PASSED++))
fi

# Test 9: Auth service build
echo -n "9. Auth service: "
if [ -f "../../services/my-nest-js-auth-microservice/package.json" ]; then
    echo -e "${GREEN}✓ Exists${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}! Not found${NC}"
    ((FAILED++))
fi

# Test 10: Health endpoints accessible (if service is running)
echo -n "10. Health endpoints: "
if curl -s http://localhost:3333/health/live >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Service running${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}! Service not running${NC} (optional)"
    ((PASSED++))
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "Validation Results: ${GREEN}${PASSED} passed${NC}, ${RED}${FAILED} failed${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All critical checks passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "  - Start auth service: bash services/my-nest-js-auth-microservice/scripts/start.sh"
    echo "  - View database: npx nx prisma:studio postgresql"
    echo "  - Run health check: npx nx health-check postgresql"
    exit 0
else
    echo -e "${RED}✗ Some checks failed. Review errors above.${NC}"
    echo ""
    echo "Troubleshooting:"
    echo "  - Start PostgreSQL: npx nx start postgresql"
    echo "  - Generate Prisma Client: npx nx prisma:generate postgresql"
    echo "  - Check logs: npx nx logs postgresql"
    exit 1
fi
