#!/bin/bash
# Quick Smoke Test - Fast validation for CI/CD
# Tests critical functionality only

set -e

# Load environment
if [ -f .env ]; then
    set -a
    source .env
    set +a
fi

# Quick checks (no output unless error)
docker ps | grep -q monorepo-postgres || exit 1
docker exec monorepo-postgres pg_isready -U "${POSTGRES_USER:-postgres}" &> /dev/null || exit 1
docker exec monorepo-postgres psql -U "${POSTGRES_USER:-postgres}" -lqt | cut -d \| -f 1 | grep -qw "${BETTER_AUTH_DB_NAME}" || exit 1
[ -d "better-auth-db/prisma/generated/client" ] || exit 1

echo "✓ Smoke tests passed"
exit 0
