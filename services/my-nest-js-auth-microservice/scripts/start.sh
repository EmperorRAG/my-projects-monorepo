#!/bin/bash
# Start the authentication microservice
# This script starts the service with all necessary dependencies

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}Starting Auth Microservice${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""

cd "${PROJECT_ROOT}"

# Pre-flight checks
echo -e "${YELLOW}Running pre-flight checks...${NC}"

# Check if PostgreSQL is running
echo -n "PostgreSQL: "
if docker ps | grep -q monorepo-postgres; then
    echo -e "${GREEN}✓ Running${NC}"
else
    echo -e "${YELLOW}⚠ Not running${NC}"
    echo "Starting PostgreSQL..."
    npx nx start postgresql
    sleep 5
fi

# Check database health
echo -n "Database health: "
if bash tools/postgresql/scripts/health-check.sh > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Healthy${NC}"
else
    echo -e "${RED}✗ Unhealthy${NC}"
    exit 1
fi

# Check environment file
echo -n "Environment file: "
if [ -f "services/my-nest-js-auth-microservice/.env" ]; then
    echo -e "${GREEN}✓ Found${NC}"
else
    echo -e "${RED}✗ Missing${NC}"
    echo "Please create services/my-nest-js-auth-microservice/.env"
    exit 1
fi

# Generate Prisma Client if needed
echo -n "Prisma Client: "
if [ ! -d "tools/postgresql/better-auth-db/prisma/generated" ]; then
    echo -e "${YELLOW}⚠ Not generated${NC}"
    echo "Generating Prisma Client..."
    cd tools/postgresql/better-auth-db
    pnpm run prisma:generate
    cd "${PROJECT_ROOT}"
    echo -e "${GREEN}✓ Generated${NC}"
else
    echo -e "${GREEN}✓ Exists${NC}"
fi

# Start the service
echo ""
echo -e "${YELLOW}Starting authentication service...${NC}"
echo "Service will be available at: http://localhost:3333"
echo ""
echo "Health endpoints:"
echo "  - http://localhost:3333/health"
echo "  - http://localhost:3333/health/ready"
echo "  - http://localhost:3333/health/live"
echo ""
echo "Auth endpoints:"
echo "  - http://localhost:3333/api/auth/*"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop the service${NC}"
echo ""

npx nx serve my-nest-js-auth-microservice
