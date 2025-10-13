#!/bin/bash
# Stop the authentication microservice
# This script gracefully stops the running service

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Stopping authentication microservice...${NC}"

# Find and kill the process
if pgrep -f "my-nest-js-auth-microservice" > /dev/null; then
    echo "Found running service, stopping..."
    pkill -f "my-nest-js-auth-microservice"
    sleep 2

    # Verify it stopped
    if pgrep -f "my-nest-js-auth-microservice" > /dev/null; then
        echo -e "${YELLOW}⚠ Service still running, force killing...${NC}"
        pkill -9 -f "my-nest-js-auth-microservice"
        sleep 1
    fi

    echo -e "${GREEN}✓ Service stopped${NC}"
else
    echo -e "${YELLOW}⚠ Service is not running${NC}"
fi
