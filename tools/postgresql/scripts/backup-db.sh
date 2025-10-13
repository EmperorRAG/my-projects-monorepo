#!/bin/bash
# Backup Better Auth Database
# This script creates a compressed backup of the Better Auth PostgreSQL database

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
BETTER_AUTH_DB_NAME="${BETTER_AUTH_DB_NAME:-better_auth_db}"
BETTER_AUTH_DB_USER="${BETTER_AUTH_DB_USER:-better_auth_user}"

# Ensure backups directory exists
BACKUP_DIR="${PROJECT_ROOT}/backups"
mkdir -p "${BACKUP_DIR}"

# Generate timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/better_auth_db_${TIMESTAMP}.sql"

echo -e "${YELLOW}Creating backup of Better Auth database...${NC}"
echo "Database: ${BETTER_AUTH_DB_NAME}"
echo "User: ${BETTER_AUTH_DB_USER}"
echo "Backup file: ${BACKUP_FILE}"

# Check if PostgreSQL container is running
if ! docker ps | grep -q monorepo-postgres; then
    echo -e "${RED}✗ Error: PostgreSQL container is not running${NC}"
    echo "Start it with: npx nx start postgresql"
    exit 1
fi

# Create backup
if docker exec monorepo-postgres pg_dump \
    -U "${BETTER_AUTH_DB_USER}" \
    -d "${BETTER_AUTH_DB_NAME}" \
    --clean \
    --if-exists \
    --create \
    > "${BACKUP_FILE}"; then
    echo -e "${GREEN}✓ Backup created successfully: ${BACKUP_FILE}${NC}"
else
    echo -e "${RED}✗ Backup failed${NC}"
    rm -f "${BACKUP_FILE}"
    exit 1
fi

# Get file size
BACKUP_SIZE=$(du -h "${BACKUP_FILE}" | cut -f1)
echo "Backup size: ${BACKUP_SIZE}"

# Compress the backup
echo -e "${YELLOW}Compressing backup...${NC}"
if gzip "${BACKUP_FILE}"; then
    echo -e "${GREEN}✓ Backup compressed: ${BACKUP_FILE}.gz${NC}"
    COMPRESSED_SIZE=$(du -h "${BACKUP_FILE}.gz" | cut -f1)
    echo "Compressed size: ${COMPRESSED_SIZE}"
else
    echo -e "${RED}✗ Compression failed${NC}"
    exit 1
fi

# Keep only last 10 backups
echo -e "${YELLOW}Cleaning up old backups (keeping last 10)...${NC}"
BACKUP_COUNT=$(ls -1 "${BACKUP_DIR}"/better_auth_db_*.sql.gz 2>/dev/null | wc -l)
if [ "${BACKUP_COUNT}" -gt 10 ]; then
    ls -t "${BACKUP_DIR}"/better_auth_db_*.sql.gz | tail -n +11 | xargs -r rm
    REMOVED=$((BACKUP_COUNT - 10))
    echo -e "${GREEN}✓ Removed ${REMOVED} old backup(s)${NC}"
else
    echo "No old backups to remove (${BACKUP_COUNT} total)"
fi

echo -e "${GREEN}✓ Backup complete!${NC}"
echo ""
echo "To restore this backup, run:"
echo "bash scripts/restore-db.sh backups/better_auth_db_${TIMESTAMP}.sql.gz"
