#!/usr/bin/env bash

# =================================================================================================
# NGINX Configuration Validation Script (Bash)
# =================================================================================================
#
# This script validates NGINX configuration files for different scenarios using Docker.
# It mounts the necessary configuration files into a Docker container and runs nginx -t
# to validate the syntax.
#
# DESCRIPTION:
#   This is a Bash implementation of the NGINX configuration validation script, providing
#   cross-platform compatibility for Linux, macOS, and Windows (with Git Bash/WSL).
#   It validates NGINX configurations for different deployment scenarios:
#   - proxy-edge: Edge proxy configuration
#   - lb-frontend: Frontend load balancer
#   - lb-api: API load balancer  
#   - lb-email: Email service load balancer
#
# USAGE:
#   ./tools/nginx/scripts/validate-nginx-config.sh SCENARIO [SCENARIO...]
#
#   Examples:
#     ./tools/nginx/scripts/validate-nginx-config.sh proxy-edge
#     ./tools/nginx/scripts/validate-nginx-config.sh proxy-edge lb-frontend lb-api lb-email
#     ./tools/nginx/scripts/validate-nginx-config.sh all
#
# ARGUMENTS:
#   SCENARIO    One or more scenario names to validate:
#               - proxy-edge: Validates edge proxy configuration
#               - lb-frontend: Validates frontend load balancer configuration
#               - lb-api: Validates API load balancer configuration
#               - lb-email: Validates email load balancer configuration
#               - all: Validates all scenarios
#
# REQUIREMENTS:
#   - Docker installed and accessible
#   - NGINX configuration files in tools/nginx/
#   - nginx:1.27-alpine Docker image (will be pulled if not present)
#
# EXIT CODES:
#   0 - All validations passed
#   1 - Validation failed or error occurred
#
# NOTES:
#   - The script must be run from the workspace root or with correct working directory
#   - All configuration files are mounted as read-only
#   - The script uses the official nginx:1.27-alpine image for validation
#   - Validation is performed in an isolated Docker container
#
# =================================================================================================

set -euo pipefail

# Color codes for output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly CYAN='\033[0;36m'
readonly NC='\033[0m' # No Color

# Get workspace root (assumes script is in tools/nginx/scripts/)
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly WORKSPACE_ROOT="$(cd "${SCRIPT_DIR}/../../.." && pwd)"

# Function to print colored messages
print_message() {
    local color=$1
    shift
    echo -e "${color}$*${NC}"
}

# Function to print error and exit
print_error() {
    print_message "$RED" "ERROR: $*" >&2
    exit 1
}

# Function to print info
print_info() {
    print_message "$BLUE" "$*"
}

# Function to print success
print_success() {
    print_message "$GREEN" "✓ $*"
}

# Function to print warning
print_warning() {
    print_message "$YELLOW" "⚠ $*"
}

# Function to print header
print_header() {
    print_message "$CYAN" "$*"
}

# Function to get scenario definition
# Returns volume mappings and extra hosts for a given scenario
get_scenario_definition() {
    local scenario_name=$1
    local scenario_lower
    scenario_lower=$(echo "$scenario_name" | tr '[:upper:]' '[:lower:]')
    
    case "$scenario_lower" in
        'proxy-edge')
            # Define volumes for proxy-edge scenario
            VOLUMES=(
                "${WORKSPACE_ROOT}/tools/nginx/common/base.nginx.conf:/etc/nginx/nginx.conf"
                "${WORKSPACE_ROOT}/tools/nginx/common/snippets:/etc/nginx/snippets"
                "${WORKSPACE_ROOT}/tools/nginx/proxy-edge/nginx.conf:/etc/nginx/conf.d/proxy-edge.conf"
                "${WORKSPACE_ROOT}/tools/nginx/proxy-edge/overlays:/etc/nginx/conf.d/overlays"
            )
            # Define extra hosts for proxy-edge scenario
            EXTRA_HOSTS=(
                'lb-frontend:127.0.0.1'
                'lb-api:127.0.0.1'
                'lb-email:127.0.0.1'
            )
            DISPLAY_NAME='proxy-edge'
            ;;
        
        'lb-frontend')
            # Define volumes for lb-frontend scenario
            VOLUMES=(
                "${WORKSPACE_ROOT}/tools/nginx/common/base.nginx.conf:/etc/nginx/nginx.conf"
                "${WORKSPACE_ROOT}/tools/nginx/common/snippets:/etc/nginx/snippets"
                "${WORKSPACE_ROOT}/tools/nginx/load-balancers/lb-frontend/nginx.conf:/etc/nginx/conf.d/lb-frontend.conf"
                "${WORKSPACE_ROOT}/tools/nginx/load-balancers/lb-frontend/overlays:/etc/nginx/conf.d/overlays"
            )
            # Define extra hosts for lb-frontend scenario
            EXTRA_HOSTS=(
                'my-programs-app:127.0.0.1'
            )
            DISPLAY_NAME='lb-frontend'
            ;;
        
        'lb-api')
            # Define volumes for lb-api scenario
            VOLUMES=(
                "${WORKSPACE_ROOT}/tools/nginx/common/base.nginx.conf:/etc/nginx/nginx.conf"
                "${WORKSPACE_ROOT}/tools/nginx/common/snippets:/etc/nginx/snippets"
                "${WORKSPACE_ROOT}/tools/nginx/load-balancers/lb-api/nginx.conf:/etc/nginx/conf.d/lb-api.conf"
                "${WORKSPACE_ROOT}/tools/nginx/load-balancers/lb-api/overlays:/etc/nginx/conf.d/overlays"
            )
            # Define extra hosts for lb-api scenario
            EXTRA_HOSTS=(
                'my-nest-js-email-microservice:127.0.0.1'
            )
            DISPLAY_NAME='lb-api'
            ;;
        
        'lb-email')
            # Define volumes for lb-email scenario
            VOLUMES=(
                "${WORKSPACE_ROOT}/tools/nginx/common/base.nginx.conf:/etc/nginx/nginx.conf"
                "${WORKSPACE_ROOT}/tools/nginx/common/snippets:/etc/nginx/snippets"
                "${WORKSPACE_ROOT}/tools/nginx/load-balancers/lb-email/nginx.conf:/etc/nginx/conf.d/lb-email.conf"
                "${WORKSPACE_ROOT}/tools/nginx/load-balancers/lb-email/overlays:/etc/nginx/conf.d/overlays"
            )
            # Define extra hosts for lb-email scenario
            EXTRA_HOSTS=(
                'my-nest-js-email-microservice:127.0.0.1'
            )
            DISPLAY_NAME='lb-email'
            ;;
        
        *)
            print_error "Unknown NGINX validation scenario: $scenario_name"
            ;;
    esac
}

# Function to validate a single scenario
validate_scenario() {
    local scenario_name=$1
    
    # Arrays to hold scenario configuration
    local -a VOLUMES=()
    local -a EXTRA_HOSTS=()
    local DISPLAY_NAME=''
    
    # Get scenario definition (populates VOLUMES, EXTRA_HOSTS, DISPLAY_NAME)
    get_scenario_definition "$scenario_name"
    
    print_header "Validating NGINX configuration scenario: $DISPLAY_NAME"
    
    # Build docker run command arguments
    local -a docker_args=('run' '--rm')
    
    # Add volume mappings
    for volume in "${VOLUMES[@]}"; do
        # Convert Windows paths if needed (for Git Bash on Windows)
        local converted_volume
        converted_volume=$(echo "$volume" | sed 's|\\|/|g')
        docker_args+=('-v' "${converted_volume}:ro")
    done
    
    # Add extra hosts
    for host_mapping in "${EXTRA_HOSTS[@]}"; do
        docker_args+=('--add-host' "$host_mapping")
    done
    
    # Add image and command
    docker_args+=('nginx:1.27-alpine' 'nginx' '-t')
    
    # Run docker command and capture exit code
    if docker "${docker_args[@]}"; then
        print_success "Validation passed for scenario '$DISPLAY_NAME'"
        return 0
    else
        local exit_code=$?
        print_error "Validation failed for scenario '$DISPLAY_NAME' (exit code $exit_code)"
        return 1
    fi
}

# Function to check if Docker is available
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed or not in PATH"
    fi
    
    if ! docker info &> /dev/null; then
        print_error "Docker daemon is not running or not accessible"
    fi
    
    print_info "Docker is available and running"
}

# Function to display usage information
show_usage() {
    cat << EOF
Usage: $0 SCENARIO [SCENARIO...]

Validates NGINX configuration files for different scenarios.

Arguments:
  SCENARIO    One or more scenario names to validate:
              - proxy-edge    Edge proxy configuration
              - lb-frontend   Frontend load balancer configuration
              - lb-api        API load balancer configuration
              - lb-email      Email load balancer configuration
              - all           All scenarios

Examples:
  $0 proxy-edge
  $0 proxy-edge lb-frontend lb-api lb-email
  $0 all

Requirements:
  - Docker installed and running
  - NGINX configuration files in tools/nginx/

EOF
}

# Main function
main() {
    # Check if scenarios are provided
    if [ $# -eq 0 ]; then
        print_error "No scenario names provided to validate"
        echo
        show_usage
        exit 1
    fi
    
    # Parse scenarios
    local -a scenarios=()
    for arg in "$@"; do
        if [ "$arg" == "all" ]; then
            scenarios=('proxy-edge' 'lb-frontend' 'lb-api' 'lb-email')
            break
        else
            scenarios+=("$arg")
        fi
    done
    
    # Print header
    echo
    print_header "╔════════════════════════════════════════════════════════════╗"
    print_header "║  NGINX Configuration Validation (Bash)                    ║"
    print_header "╔════════════════════════════════════════════════════════════╗"
    echo
    
    # Check Docker availability
    check_docker
    echo
    
    # Validate each scenario
    local failed=0
    local total=${#scenarios[@]}
    local passed=0
    
    for scenario in "${scenarios[@]}"; do
        if validate_scenario "$scenario"; then
            ((passed++))
        else
            ((failed++))
        fi
        echo
    done
    
    # Print summary
    print_header "╔════════════════════════════════════════════════════════════╗"
    print_header "║  Validation Summary                                        ║"
    print_header "╚════════════════════════════════════════════════════════════╝"
    echo
    print_info "Total scenarios: $total"
    print_success "Passed: $passed"
    
    if [ $failed -gt 0 ]; then
        print_error "Failed: $failed"
        exit 1
    fi
    
    echo
    print_success "All NGINX configuration scenarios validated successfully!"
    echo
}

# Run main function with all arguments
main "$@"
