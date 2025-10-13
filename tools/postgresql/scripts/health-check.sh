#!/bin/bash
# Health check for PostgreSQL database
# This script verifies the database is running and accessible

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Source environment variables
if [ -f "${PROJECT_ROOT}/.env" ]; then
    set -a
    source "${PROJECT_ROOT}/.env"
    set +a
else
    echo -e "${RED}✗ Error: .env file not found${NC}"
    exit 1
fi

# Set defaults if not set
POSTGRES_USER="${POSTGRES_USER:-postgres}"
BETTER_AUTH_DB_NAME="${BETTER_AUTH_DB_NAME:-better_auth_db}"
BETTER_AUTH_DB_USER="${BETTER_AUTH_DB_USER:-better_auth_user}"

echo "========================================="
echo "PostgreSQL Health Check"
echo "========================================="
echo ""

# Check if Docker is running
echo -n "Docker daemon: "
if docker info >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Running${NC}"
else
    echo -e "${RED}✗ Not running${NC}"
    exit 1
fi

# Check if PostgreSQL container is running
echo -n "PostgreSQL container: "
if docker ps --format '{{.Names}}' | grep -q '^monorepo-postgres$'; then
    echo -e "${GREEN}✓ Running${NC}"
else
    echo -e "${RED}✗ Not running${NC}"
    echo "Start with: npx nx start postgresql"
    exit 1
fi

# Check container health status
echo -n "Container health: "
HEALTH_STATUS=$(docker inspect --format='{{.State.Health.Status}}' monorepo-postgres 2>/dev/null || echo "unknown")
if [ "${HEALTH_STATUS}" = "healthy" ]; then
    echo -e "${GREEN}✓ Healthy${NC}"
elif [ "${HEALTH_STATUS}" = "starting" ]; then
    echo -e "${YELLOW}⚠ Starting${NC}"
elif [ "${HEALTH_STATUS}" = "unhealthy" ]; then
    echo -e "${RED}✗ Unhealthy${NC}"
else
    echo -e "${YELLOW}⚠ Unknown (no healthcheck)${NC}"
fi

# Check PostgreSQL is accepting connections
echo -n "PostgreSQL connectivity: "
if docker exec monorepo-postgres pg_isready -U "${POSTGRES_USER}" >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Accepting connections${NC}"
else
    echo -e "${RED}✗ Not accepting connections${NC}"
    exit 1
fi

# Check Better Auth database exists
echo -n "Better Auth database: "
if docker exec monorepo-postgres psql -U "${POSTGRES_USER}" -lqt | cut -d \| -f 1 | grep -qw "${BETTER_AUTH_DB_NAME}"; then
    echo -e "${GREEN}✓ Exists${NC}"
else
    echo -e "${RED}✗ Not found${NC}"
    exit 1
fi

# Check Better Auth user exists
echo -n "Better Auth user: "
if docker exec monorepo-postgres psql -U "${POSTGRES_USER}" -tAc "SELECT 1 FROM pg_roles WHERE rolname='${BETTER_AUTH_DB_USER}'" | grep -q 1; then
    echo -e "${GREEN}✓ Exists${NC}"
else
    echo -e "${RED}✗ Not found${NC}"
    exit 1
fi

# Check database connection
echo -n "Database connection: "
if docker exec monorepo-postgres psql -U "${BETTER_AUTH_DB_USER}" -d "${BETTER_AUTH_DB_NAME}" -c "SELECT 1" >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Connected${NC}"
else
    echo -e "${RED}✗ Connection failed${NC}"
    exit 1
fi

# Count tables
echo -n "Tables in database: "
TABLE_COUNT=$(docker exec monorepo-postgres psql -U "${BETTER_AUTH_DB_USER}" -d "${BETTER_AUTH_DB_NAME}" -tAc "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';" 2>/dev/null || echo "0")
if [ "${TABLE_COUNT}" -gt 0 ]; then
    echo -e "${GREEN}${TABLE_COUNT}${NC}"
else
    echo -e "${YELLOW}${TABLE_COUNT} (no tables yet)${NC}"
fi

# Check extensions
echo -n "Required extensions: "
UUID_OSSP=$(docker exec monorepo-postgres psql -U "${BETTER_AUTH_DB_USER}" -d "${BETTER_AUTH_DB_NAME}" -tAc "SELECT COUNT(*) FROM pg_extension WHERE extname='uuid-ossp';" 2>/dev/null || echo "0")
PGCRYPTO=$(docker exec monorepo-postgres psql -U "${BETTER_AUTH_DB_USER}" -d "${BETTER_AUTH_DB_NAME}" -tAc "SELECT COUNT(*) FROM pg_extension WHERE extname='pgcrypto';" 2>/dev/null || echo "0")

if [ "${UUID_OSSP}" = "1" ] && [ "${PGCRYPTO}" = "1" ]; then
    echo -e "${GREEN}✓ Installed (uuid-ossp, pgcrypto)${NC}"
else
    echo -e "${YELLOW}⚠ Missing extensions${NC}"
fi

# Get database size
echo -n "Database size: "
DB_SIZE=$(docker exec monorepo-postgres psql -U "${BETTER_AUTH_DB_USER}" -d "${BETTER_AUTH_DB_NAME}" -tAc "SELECT pg_size_pretty(pg_database_size('${BETTER_AUTH_DB_NAME}'));" 2>/dev/null || echo "unknown")
echo "${DB_SIZE}"

# Get connection count
echo -n "Active connections: "
CONN_COUNT=$(docker exec monorepo-postgres psql -U "${POSTGRES_USER}" -tAc "SELECT count(*) FROM pg_stat_activity WHERE datname='${BETTER_AUTH_DB_NAME}';" 2>/dev/null || echo "0")
echo "${CONN_COUNT}"

echo ""
echo "========================================="
echo -e "${GREEN}✓ Health check passed${NC}"
echo "========================================="
