#!/bin/bash
# Restore Better Auth Database from backup
# This script restores a PostgreSQL database from a compressed backup file

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
    echo -e "${GREEN}✓ Environment variables loaded${NC}"
else
    echo -e "${RED}✗ Error: .env file not found at ${PROJECT_ROOT}/.env${NC}"
    exit 1
fi

# Set defaults if not set
POSTGRES_USER="${POSTGRES_USER:-postgres}"
BETTER_AUTH_DB_NAME="${BETTER_AUTH_DB_NAME:-better_auth_db}"
BETTER_AUTH_DB_USER="${BETTER_AUTH_DB_USER:-better_auth_user}"

# Check if backup file is provided
if [ -z "$1" ]; then
    echo -e "${YELLOW}Usage: $0 <backup-file.sql.gz>${NC}"
    echo ""
    echo "Available backups:"
    if ls -1 "${PROJECT_ROOT}/backups"/better_auth_db_*.sql.gz 2>/dev/null | head -10; then
        TOTAL=$(ls -1 "${PROJECT_ROOT}/backups"/better_auth_db_*.sql.gz 2>/dev/null | wc -l)
        echo ""
        echo "Total backups: ${TOTAL}"
        if [ "${TOTAL}" -gt 10 ]; then
            echo "(Showing most recent 10)"
        fi
    else
        echo "No backups found in ${PROJECT_ROOT}/backups/"
    fi
    exit 1
fi

BACKUP_FILE="$1"

# Check if backup file exists
if [ ! -f "${BACKUP_FILE}" ]; then
    echo -e "${RED}✗ Error: Backup file not found: ${BACKUP_FILE}${NC}"
    exit 1
fi

# Check if PostgreSQL container is running
if ! docker ps | grep -q monorepo-postgres; then
    echo -e "${RED}✗ Error: PostgreSQL container is not running${NC}"
    echo "Start it with: npx nx start postgresql"
    exit 1
fi

echo -e "${YELLOW}⚠️  WARNING: This will DESTROY all existing data in the database!${NC}"
echo "Database: ${BETTER_AUTH_DB_NAME}"
echo "Backup file: ${BACKUP_FILE}"
echo ""
read -p "Are you sure you want to continue? (yes/no): " CONFIRM

if [ "${CONFIRM}" != "yes" ]; then
    echo "Restore cancelled."
    exit 0
fi

echo -e "${YELLOW}Restoring Better Auth database from ${BACKUP_FILE}...${NC}"

# Decompress if needed
TEMP_FILE=""
if [[ "${BACKUP_FILE}" == *.gz ]]; then
    echo -e "${YELLOW}Decompressing backup...${NC}"
    TEMP_FILE="${BACKUP_FILE%.gz}"
    if gunzip -k "${BACKUP_FILE}"; then
        echo -e "${GREEN}✓ Backup decompressed${NC}"
        BACKUP_FILE="${TEMP_FILE}"
    else
        echo -e "${RED}✗ Decompression failed${NC}"
        exit 1
    fi
fi

# Drop existing connections
echo -e "${YELLOW}Terminating existing database connections...${NC}"
docker exec -i monorepo-postgres psql \
    -U "${POSTGRES_USER}" \
    -c "SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = '${BETTER_AUTH_DB_NAME}' AND pid <> pg_backend_pid();" \
    2>/dev/null || true

# Drop and recreate database
echo -e "${YELLOW}Dropping and recreating database...${NC}"
docker exec -i monorepo-postgres psql \
    -U "${POSTGRES_USER}" \
    -c "DROP DATABASE IF EXISTS ${BETTER_AUTH_DB_NAME};" || {
    echo -e "${RED}✗ Failed to drop database${NC}"
    [ -n "${TEMP_FILE}" ] && rm -f "${TEMP_FILE}"
    exit 1
}

docker exec -i monorepo-postgres psql \
    -U "${POSTGRES_USER}" \
    -c "CREATE DATABASE ${BETTER_AUTH_DB_NAME} OWNER ${BETTER_AUTH_DB_USER};" || {
    echo -e "${RED}✗ Failed to create database${NC}"
    [ -n "${TEMP_FILE}" ] && rm -f "${TEMP_FILE}"
    exit 1
}

# Restore the backup
echo -e "${YELLOW}Restoring backup...${NC}"
if docker exec -i monorepo-postgres psql \
    -U "${BETTER_AUTH_DB_USER}" \
    -d "${BETTER_AUTH_DB_NAME}" \
    < "${BACKUP_FILE}"; then
    echo -e "${GREEN}✓ Database restored successfully!${NC}"
else
    echo -e "${RED}✗ Restore failed${NC}"
    [ -n "${TEMP_FILE}" ] && rm -f "${TEMP_FILE}"
    exit 1
fi

# Clean up decompressed file if it was compressed
if [ -n "${TEMP_FILE}" ]; then
    rm -f "${TEMP_FILE}"
    echo -e "${GREEN}✓ Cleaned up temporary files${NC}"
fi

# Verify restoration
echo -e "${YELLOW}Verifying restoration...${NC}"
TABLE_COUNT=$(docker exec monorepo-postgres psql \
    -U "${BETTER_AUTH_DB_USER}" \
    -d "${BETTER_AUTH_DB_NAME}" \
    -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';" | tr -d ' ')

echo "Tables restored: ${TABLE_COUNT}"

if [ "${TABLE_COUNT}" -gt 0 ]; then
    echo -e "${GREEN}✓ Restore complete and verified!${NC}"
else
    echo -e "${YELLOW}⚠️  Warning: No tables found after restore${NC}"
fi

echo ""
echo "Database ${BETTER_AUTH_DB_NAME} has been restored."
echo "You may need to regenerate the Prisma Client:"
echo "  cd tools/postgresql/better-auth-db"
echo "  pnpm run prisma:generate"
