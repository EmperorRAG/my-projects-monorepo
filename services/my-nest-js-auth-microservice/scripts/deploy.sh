#!/bin/bash
# Deploy the authentication microservice
# This script handles the deployment of the auth service to production

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
echo -e "${BLUE}Auth Microservice Deployment Script${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""

# Check environment
ENVIRONMENT="${1:-production}"
echo -e "${YELLOW}Deploying to: ${ENVIRONMENT}${NC}"
echo ""

# Validate environment
if [ "${ENVIRONMENT}" != "production" ] && [ "${ENVIRONMENT}" != "staging" ]; then
    echo -e "${RED}✗ Error: Invalid environment '${ENVIRONMENT}'${NC}"
    echo "Usage: $0 [production|staging]"
    exit 1
fi

# Navigate to project root
cd "${PROJECT_ROOT}"

# Pre-deployment checks
echo -e "${YELLOW}Running pre-deployment checks...${NC}"

# Check if PostgreSQL is running
echo -n "Checking PostgreSQL: "
if docker ps | grep -q monorepo-postgres; then
    echo -e "${GREEN}✓ Running${NC}"
else
    echo -e "${RED}✗ Not running${NC}"
    echo "Start PostgreSQL with: npx nx start postgresql"
    exit 1
fi

# Check database health
echo -n "Checking database health: "
if bash tools/postgresql/scripts/health-check.sh > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Healthy${NC}"
else
    echo -e "${RED}✗ Unhealthy${NC}"
    exit 1
fi

# Check environment variables
echo -n "Checking environment variables: "
if [ -f "services/my-nest-js-auth-microservice/.env" ]; then
    echo -e "${GREEN}✓ Found${NC}"
else
    echo -e "${RED}✗ Missing .env file${NC}"
    exit 1
fi

# Build the service
echo ""
echo -e "${YELLOW}Building authentication service...${NC}"
if npx nx build my-nest-js-auth-microservice --configuration=${ENVIRONMENT}; then
    echo -e "${GREEN}✓ Build successful${NC}"
else
    echo -e "${RED}✗ Build failed${NC}"
    exit 1
fi

# Run tests
echo ""
echo -e "${YELLOW}Running tests...${NC}"
if npx nx test my-nest-js-auth-microservice; then
    echo -e "${GREEN}✓ Tests passed${NC}"
else
    echo -e "${RED}✗ Tests failed${NC}"
    read -p "Continue with deployment? (yes/no): " CONTINUE
    if [ "${CONTINUE}" != "yes" ]; then
        echo "Deployment cancelled."
        exit 1
    fi
fi

# Generate Prisma Client
echo ""
echo -e "${YELLOW}Generating Prisma Client...${NC}"
cd tools/postgresql/better-auth-db
if pnpm run prisma:generate > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Prisma Client generated${NC}"
else
    echo -e "${RED}✗ Prisma Client generation failed${NC}"
    exit 1
fi
cd "${PROJECT_ROOT}"

# Run database migrations
echo ""
echo -e "${YELLOW}Running database migrations...${NC}"
cd tools/postgresql/better-auth-db
if pnpm run prisma:migrate:deploy > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Migrations applied${NC}"
else
    echo -e "${RED}✗ Migration failed${NC}"
    exit 1
fi
cd "${PROJECT_ROOT}"

# Create database backup before deployment
echo ""
echo -e "${YELLOW}Creating database backup...${NC}"
if bash tools/postgresql/scripts/backup-db.sh; then
    echo -e "${GREEN}✓ Backup created${NC}"
else
    echo -e "${YELLOW}⚠ Backup failed (continuing anyway)${NC}"
fi

# Deploy based on environment
echo ""
echo -e "${YELLOW}Deploying service...${NC}"

if [ "${ENVIRONMENT}" = "production" ]; then
    # Production deployment
    echo "Starting service in production mode..."

    # Stop existing service if running
    if pgrep -f "my-nest-js-auth-microservice" > /dev/null; then
        echo "Stopping existing service..."
        pkill -f "my-nest-js-auth-microservice" || true
        sleep 2
    fi

    # Start service
    npx nx serve my-nest-js-auth-microservice --configuration=production &
    SERVICE_PID=$!
    echo "Service started with PID: ${SERVICE_PID}"

    # Wait for service to be ready
    echo "Waiting for service to be ready..."
    MAX_ATTEMPTS=30
    ATTEMPT=0

    while [ ${ATTEMPT} -lt ${MAX_ATTEMPTS} ]; do
        if curl -s http://localhost:3333/health/ready > /dev/null 2>&1; then
            echo -e "${GREEN}✓ Service is ready${NC}"
            break
        fi
        ATTEMPT=$((ATTEMPT + 1))
        echo -n "."
        sleep 1
    done

    if [ ${ATTEMPT} -eq ${MAX_ATTEMPTS} ]; then
        echo -e "${RED}✗ Service failed to start${NC}"
        exit 1
    fi

else
    # Staging deployment
    echo "Starting service in staging mode..."
    npx nx serve my-nest-js-auth-microservice &
    SERVICE_PID=$!
    echo "Service started with PID: ${SERVICE_PID}"
fi

# Post-deployment health check
echo ""
echo -e "${YELLOW}Running post-deployment health check...${NC}"
sleep 3

# Check health endpoint
echo -n "Health check: "
HEALTH_RESPONSE=$(curl -s http://localhost:3333/health || echo "failed")
if echo "${HEALTH_RESPONSE}" | grep -q "healthy"; then
    echo -e "${GREEN}✓ Passed${NC}"
else
    echo -e "${RED}✗ Failed${NC}"
    echo "Response: ${HEALTH_RESPONSE}"
fi

# Check ready endpoint
echo -n "Ready check: "
READY_RESPONSE=$(curl -s http://localhost:3333/health/ready || echo "failed")
if echo "${READY_RESPONSE}" | grep -q "ready"; then
    echo -e "${GREEN}✓ Passed${NC}"
else
    echo -e "${RED}✗ Failed${NC}"
    echo "Response: ${READY_RESPONSE}"
fi

# Summary
echo ""
echo -e "${BLUE}=========================================${NC}"
echo -e "${GREEN}✓ Deployment Complete!${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""
echo "Service Information:"
echo "  Environment: ${ENVIRONMENT}"
echo "  PID: ${SERVICE_PID}"
echo "  Port: 3333"
echo "  Health: http://localhost:3333/health"
echo "  Ready: http://localhost:3333/health/ready"
echo "  Live: http://localhost:3333/health/live"
echo ""
echo "Monitoring:"
echo "  Logs: npx nx logs my-nest-js-auth-microservice"
echo "  Stop: kill ${SERVICE_PID}"
echo ""
