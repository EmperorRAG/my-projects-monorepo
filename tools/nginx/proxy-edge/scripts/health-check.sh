#!/bin/sh
# =================================================================================================
# Health Check Script for NGINX Edge Proxy
# =================================================================================================
#
# This script performs comprehensive health checks for the edge proxy and all load balancers.
# It returns a JSON response with the status of each component.
#
# Usage:
#   ./health-check.sh [--simple]
#
# Options:
#   --simple    Return simple text response (for basic health checks)
#   (default)   Return detailed JSON response
#
# Exit codes:
#   0 - All components healthy
#   1 - One or more components unhealthy
#
# =================================================================================================

# Function to check a single load balancer
check_lb() {
    local lb_name="$1"
    local lb_host="$2"
    local lb_port="$3"
    
    # Try to reach the load balancer health endpoint
    if curl -sf --connect-timeout 2 --max-time 5 "http://${lb_host}:${lb_port}/health" > /dev/null 2>&1; then
        echo "healthy"
        return 0
    else
        echo "unhealthy"
        return 1
    fi
}

# Check if simple mode is requested
SIMPLE_MODE=false
if [ "$1" = "--simple" ]; then
    SIMPLE_MODE=true
fi

# Check edge proxy itself (always healthy if this script runs)
EDGE_STATUS="healthy"

# Check each load balancer
LB_FRONTEND_STATUS=$(check_lb "lb-frontend" "lb-frontend" "8080")
LB_API_STATUS=$(check_lb "lb-api" "lb-api" "8080")
LB_EMAIL_STATUS=$(check_lb "lb-email" "lb-email" "8080")

# Determine overall health
OVERALL_HEALTHY=true
if [ "$LB_FRONTEND_STATUS" != "healthy" ] || [ "$LB_API_STATUS" != "healthy" ] || [ "$LB_EMAIL_STATUS" != "healthy" ]; then
    OVERALL_HEALTHY=false
fi

# Output based on mode
if [ "$SIMPLE_MODE" = true ]; then
    if [ "$OVERALL_HEALTHY" = true ]; then
        echo "healthy"
        exit 0
    else
        echo "degraded"
        exit 1
    fi
else
    # JSON output for detailed health check
    cat <<EOF
{
  "status": "$([ "$OVERALL_HEALTHY" = true ] && echo "healthy" || echo "degraded")",
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "components": {
    "edge-proxy": {
      "status": "$EDGE_STATUS"
    },
    "lb-frontend": {
      "status": "$LB_FRONTEND_STATUS"
    },
    "lb-api": {
      "status": "$LB_API_STATUS"
    },
    "lb-email": {
      "status": "$LB_EMAIL_STATUS"
    }
  }
}
EOF
    
    if [ "$OVERALL_HEALTHY" = true ]; then
        exit 0
    else
        exit 1
    fi
fi
