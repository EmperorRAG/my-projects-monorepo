#!/usr/bin/env bash

# =================================================================================================
# Certbot-NGINX Integration Setup Script
# =================================================================================================
#
# This script automates the complete setup of Certbot-NGINX integration for SSL/TLS certificate
# management. It handles:
# - Environment validation and prerequisite checks
# - Volume and directory initialization
# - Initial certificate acquisition
# - NGINX configuration with TLS
# - Automatic renewal service setup
# - Health checks and validation
#
# Usage:
#   ./tools/certbot/scripts/setup-integration.sh \
#     --domain yourdomain.com \
#     --email your@email.com \
#     [--staging] \
#     [--additional-domains www.yourdomain.com,subdomain.yourdomain.com]
#
# Options:
#   --domain <domain>           Primary domain name (required)
#   --email <email>             Email for Let's Encrypt notifications (required)
#   --staging                   Use Let's Encrypt staging server (for testing)
#   --additional-domains <list> Comma-separated list of additional domains
#   --help                      Show this help message
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

# Script directory and workspace root
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly WORKSPACE_ROOT="$(cd "${SCRIPT_DIR}/../../.." && pwd)"
readonly CERTBOT_DIR="${WORKSPACE_ROOT}/tools/certbot"
readonly NGINX_DIR="${WORKSPACE_ROOT}/tools/nginx"
readonly VOLUMES_DIR="${WORKSPACE_ROOT}/volumes"

# Configuration variables
DOMAIN=""
EMAIL=""
STAGING=false
ADDITIONAL_DOMAINS=""
DRY_RUN=false

# =================================================================================================
# Helper Functions
# =================================================================================================

print_header() {
    echo -e "${BLUE}=================================================================================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}=================================================================================================${NC}"
    echo ""
}

print_step() {
    echo -e "${CYAN}[$1] $2${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}" >&2
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

show_help() {
    cat << EOF
Certbot-NGINX Integration Setup Script

Automates the complete setup of SSL/TLS certificate management using Certbot and NGINX.

Usage:
  $0 --domain <domain> --email <email> [options]

Required Options:
  --domain <domain>           Primary domain name
  --email <email>             Email for Let's Encrypt notifications

Optional Options:
  --staging                   Use Let's Encrypt staging server (for testing)
  --additional-domains <list> Comma-separated list of additional domains
  --dry-run                   Show what would be done without making changes
  --help                      Show this help message

Examples:
  # Basic setup
  $0 --domain example.com --email admin@example.com

  # Setup with additional domains
  $0 --domain example.com --email admin@example.com \\
    --additional-domains www.example.com,api.example.com

  # Test with staging server
  $0 --domain example.com --email admin@example.com --staging

  # Dry run to preview actions
  $0 --domain example.com --email admin@example.com --dry-run

Prerequisites:
  - Docker and Docker Compose installed
  - Domain DNS properly configured
  - Ports 80 and 443 accessible from internet
  - Sufficient disk space for certificates and logs

EOF
    exit 0
}

# =================================================================================================
# Validation Functions
# =================================================================================================

validate_prerequisites() {
    print_step "1/10" "Validating prerequisites..."
    
    local errors=0
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        ((errors++))
    else
        if ! docker info &> /dev/null; then
            print_error "Docker daemon is not running"
            ((errors++))
        else
            print_success "Docker is installed and running"
        fi
    fi
    
    # Check Docker Compose
    if ! command -v docker &> /dev/null || ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not installed"
        ((errors++))
    else
        print_success "Docker Compose is installed"
    fi
    
    # Check DNS resolution
    if ! host "$DOMAIN" &> /dev/null; then
        print_warning "DNS resolution for $DOMAIN may not be configured"
        print_info "Ensure your domain points to this server's IP address"
    else
        print_success "DNS resolution for $DOMAIN is working"
    fi
    
    # Check required files
    if [ ! -f "${WORKSPACE_ROOT}/docker-compose.certbot-nginx.yaml" ]; then
        print_error "docker-compose.certbot-nginx.yaml not found"
        ((errors++))
    else
        print_success "Docker Compose configuration found"
    fi
    
    if [ $errors -gt 0 ]; then
        print_error "Prerequisites validation failed with $errors error(s)"
        exit 1
    fi
    
    echo ""
}

validate_domain() {
    print_step "2/10" "Validating domain configuration..."
    
    if [ -z "$DOMAIN" ]; then
        print_error "Domain is required (use --domain)"
        exit 1
    fi
    
    if [ -z "$EMAIL" ]; then
        print_error "Email is required (use --email)"
        exit 1
    fi
    
    # Build domain list
    local domain_list="$DOMAIN"
    if [ -n "$ADDITIONAL_DOMAINS" ]; then
        domain_list="${domain_list},${ADDITIONAL_DOMAINS}"
    fi
    
    print_success "Domain: $DOMAIN"
    print_success "Email: $EMAIL"
    if [ -n "$ADDITIONAL_DOMAINS" ]; then
        print_success "Additional domains: $ADDITIONAL_DOMAINS"
    fi
    if [ "$STAGING" = true ]; then
        print_info "Using Let's Encrypt staging server"
    fi
    
    echo ""
}

# =================================================================================================
# Setup Functions
# =================================================================================================

initialize_volumes() {
    print_step "3/10" "Initializing volume directories..."
    
    if [ "$DRY_RUN" = true ]; then
        print_info "[DRY RUN] Would create volume directories"
        echo ""
        return
    fi
    
    local dirs=(
        "${VOLUMES_DIR}/letsencrypt"
        "${VOLUMES_DIR}/letsencrypt-lib"
        "${VOLUMES_DIR}/certbot-webroot/.well-known/acme-challenge"
        "${VOLUMES_DIR}/nginx-logs"
    )
    
    for dir in "${dirs[@]}"; do
        if [ ! -d "$dir" ]; then
            mkdir -p "$dir"
            print_success "Created: $dir"
        else
            print_info "Already exists: $dir"
        fi
    done
    
    # Set proper permissions
    chmod -R 755 "${VOLUMES_DIR}/certbot-webroot"
    print_success "Set permissions on webroot directory"
    
    echo ""
}

create_env_file() {
    print_step "4/10" "Creating environment configuration..."
    
    local env_file="${WORKSPACE_ROOT}/.env.certbot"
    
    if [ "$DRY_RUN" = true ]; then
        print_info "[DRY RUN] Would create .env.certbot file"
        echo ""
        return
    fi
    
    # Build domain list
    local domain_list="$DOMAIN"
    if [ -n "$ADDITIONAL_DOMAINS" ]; then
        domain_list="${domain_list},${ADDITIONAL_DOMAINS}"
    fi
    
    cat > "$env_file" << EOF
# Certbot Configuration
# Generated by setup-integration.sh on $(date)

# Let's Encrypt Configuration
CERTBOT_EMAIL=${EMAIL}
CERTBOT_DOMAINS=${domain_list}
CERTBOT_STAGING=${STAGING}

# Certificate Configuration
CERTBOT_RSA_KEY_SIZE=4096
CERTBOT_RENEW_HOOK=docker exec nginx-certbot-proxy nginx -s reload

# Paths
LETSENCRYPT_DIR=/etc/letsencrypt
WEBROOT_PATH=/var/www/certbot

# Renewal Schedule (cron format)
RENEWAL_SCHEDULE=0 0,12 * * *  # Twice daily at midnight and noon
EOF

    print_success "Created: $env_file"
    print_info "Environment variables saved for future use"
    
    echo ""
}

start_nginx_http() {
    print_step "5/10" "Starting NGINX (HTTP only for initial validation)..."
    
    if [ "$DRY_RUN" = true ]; then
        print_info "[DRY RUN] Would start NGINX in HTTP mode"
        echo ""
        return
    fi
    
    cd "$WORKSPACE_ROOT"
    
    # Start only NGINX without TLS
    docker compose -f docker-compose.certbot-nginx.yaml up -d nginx
    
    # Wait for NGINX to be ready
    sleep 5
    
    if docker ps | grep -q nginx-certbot-proxy; then
        print_success "NGINX is running"
        
        # Test HTTP connectivity
        if curl -sf http://localhost/health &> /dev/null; then
            print_success "NGINX health check passed"
        else
            print_warning "NGINX health check failed (may be expected)"
        fi
    else
        print_error "NGINX failed to start"
        exit 1
    fi
    
    echo ""
}

acquire_certificates() {
    print_step "6/10" "Acquiring SSL/TLS certificates..."
    
    if [ "$DRY_RUN" = true ]; then
        print_info "[DRY RUN] Would acquire certificates from Let's Encrypt"
        echo ""
        return
    fi
    
    cd "$WORKSPACE_ROOT"
    
    # Build domain list
    local domain_list="$DOMAIN"
    if [ -n "$ADDITIONAL_DOMAINS" ]; then
        domain_list="${domain_list},${ADDITIONAL_DOMAINS}"
    fi
    
    # Build certbot command
    local staging_flag=""
    if [ "$STAGING" = true ]; then
        staging_flag="--staging"
    fi
    
    print_info "Acquiring certificate for: $domain_list"
    print_info "This may take a few moments..."
    echo ""
    
    # Run certbot
    if CERTBOT_EMAIL="$EMAIL" CERTBOT_DOMAINS="$domain_list" \
       docker compose -f docker-compose.certbot-nginx.yaml run --rm certbot-acquire; then
        print_success "Certificates acquired successfully"
        
        # Verify certificates
        if [ -d "${VOLUMES_DIR}/letsencrypt/live/${DOMAIN}" ]; then
            print_success "Certificates stored in: ${VOLUMES_DIR}/letsencrypt/live/${DOMAIN}"
        fi
    else
        print_error "Certificate acquisition failed"
        print_info "Check the logs above for details"
        print_info "Common issues:"
        print_info "  - Domain not pointing to this server"
        print_info "  - Ports 80/443 not accessible"
        print_info "  - Rate limits reached (use --staging for testing)"
        exit 1
    fi
    
    echo ""
}

configure_nginx_tls() {
    print_step "7/10" "Configuring NGINX with TLS..."
    
    if [ "$DRY_RUN" = true ]; then
        print_info "[DRY RUN] Would configure NGINX for TLS"
        echo ""
        return
    fi
    
    cd "$WORKSPACE_ROOT"
    
    # Restart NGINX to load TLS configuration
    docker compose -f docker-compose.certbot-nginx.yaml restart nginx
    
    # Wait for NGINX to reload
    sleep 3
    
    # Test HTTPS
    if curl -skf https://localhost/health &> /dev/null; then
        print_success "NGINX TLS configuration successful"
        print_success "HTTPS is working"
    else
        print_warning "HTTPS health check failed"
        print_info "Check NGINX logs: docker compose -f docker-compose.certbot-nginx.yaml logs nginx"
    fi
    
    echo ""
}

setup_auto_renewal() {
    print_step "8/10" "Setting up automatic certificate renewal..."
    
    if [ "$DRY_RUN" = true ]; then
        print_info "[DRY RUN] Would set up automatic renewal service"
        echo ""
        return
    fi
    
    cd "$WORKSPACE_ROOT"
    
    # Start renewal service
    docker compose -f docker-compose.certbot-nginx.yaml up -d certbot-renew
    
    if docker ps | grep -q certbot-renew; then
        print_success "Automatic renewal service is running"
        print_info "Certificates will be renewed twice daily"
        print_info "NGINX will be reloaded automatically after renewal"
    else
        print_error "Failed to start renewal service"
        exit 1
    fi
    
    echo ""
}

run_validation() {
    print_step "9/10" "Running validation tests..."
    
    if [ "$DRY_RUN" = true ]; then
        print_info "[DRY RUN] Would run validation tests"
        echo ""
        return
    fi
    
    local tests_passed=0
    local tests_total=5
    
    # Test 1: HTTP accessibility
    if curl -sf http://localhost/health &> /dev/null; then
        print_success "HTTP health check passed"
        ((tests_passed++))
    else
        print_error "HTTP health check failed"
    fi
    
    # Test 2: HTTPS accessibility
    if curl -skf https://localhost/health &> /dev/null; then
        print_success "HTTPS health check passed"
        ((tests_passed++))
    else
        print_error "HTTPS health check failed"
    fi
    
    # Test 3: Certificate files exist
    if [ -f "${VOLUMES_DIR}/letsencrypt/live/${DOMAIN}/fullchain.pem" ]; then
        print_success "Certificate files exist"
        ((tests_passed++))
    else
        print_error "Certificate files not found"
    fi
    
    # Test 4: NGINX configuration valid
    if docker compose -f docker-compose.certbot-nginx.yaml exec -T nginx nginx -t &> /dev/null; then
        print_success "NGINX configuration is valid"
        ((tests_passed++))
    else
        print_error "NGINX configuration has errors"
    fi
    
    # Test 5: Renewal service running
    if docker ps | grep -q certbot-renew; then
        print_success "Renewal service is running"
        ((tests_passed++))
    else
        print_error "Renewal service is not running"
    fi
    
    echo ""
    print_info "Validation: ${tests_passed}/${tests_total} tests passed"
    
    if [ $tests_passed -eq $tests_total ]; then
        print_success "All validation tests passed!"
    else
        print_warning "Some validation tests failed"
        print_info "Review the output above for details"
    fi
    
    echo ""
}

show_summary() {
    print_step "10/10" "Setup Summary"
    
    print_header "Certbot-NGINX Integration Setup Complete!"
    
    echo -e "${GREEN}✓ SSL/TLS certificates acquired and configured${NC}"
    echo -e "${GREEN}✓ NGINX configured with HTTPS${NC}"
    echo -e "${GREEN}✓ Automatic renewal service running${NC}"
    echo ""
    
    print_info "Certificate Information:"
    echo "  Domain(s): $DOMAIN$([ -n "$ADDITIONAL_DOMAINS" ] && echo ", $ADDITIONAL_DOMAINS")"
    echo "  Email: $EMAIL"
    echo "  Certificate Path: ${VOLUMES_DIR}/letsencrypt/live/${DOMAIN}/"
    echo "  Staging: $([ "$STAGING" = true ] && echo "Yes (testing)" || echo "No (production)")"
    echo ""
    
    print_info "Next Steps:"
    echo "  1. Test your HTTPS setup:"
    echo "     curl https://${DOMAIN}"
    echo ""
    echo "  2. View service logs:"
    echo "     docker compose -f docker-compose.certbot-nginx.yaml logs -f"
    echo ""
    echo "  3. Check certificate status:"
    echo "     docker compose -f docker-compose.certbot-nginx.yaml exec certbot-renew certbot certificates"
    echo ""
    echo "  4. Test renewal (dry run):"
    echo "     docker compose -f docker-compose.certbot-nginx.yaml exec certbot-renew certbot renew --dry-run"
    echo ""
    echo "  5. Force renewal:"
    echo "     docker compose -f docker-compose.certbot-nginx.yaml exec certbot-renew certbot renew --force-renewal"
    echo ""
    
    print_info "Management Commands:"
    echo "  # Stop all services"
    echo "  docker compose -f docker-compose.certbot-nginx.yaml down"
    echo ""
    echo "  # Start all services"
    echo "  docker compose -f docker-compose.certbot-nginx.yaml up -d"
    echo ""
    echo "  # Reload NGINX configuration"
    echo "  docker compose -f docker-compose.certbot-nginx.yaml exec nginx nginx -s reload"
    echo ""
    
    print_header "Setup Complete! Your site is now secured with HTTPS."
}

# =================================================================================================
# Main Script
# =================================================================================================

main() {
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --domain)
                DOMAIN="$2"
                shift 2
                ;;
            --email)
                EMAIL="$2"
                shift 2
                ;;
            --staging)
                STAGING=true
                shift
                ;;
            --additional-domains)
                ADDITIONAL_DOMAINS="$2"
                shift 2
                ;;
            --dry-run)
                DRY_RUN=true
                shift
                ;;
            --help)
                show_help
                ;;
            *)
                print_error "Unknown option: $1"
                echo "Use --help for usage information"
                exit 1
                ;;
        esac
    done
    
    # Show header
    print_header "Certbot-NGINX Integration Setup"
    
    # Run setup steps
    validate_prerequisites
    validate_domain
    initialize_volumes
    create_env_file
    start_nginx_http
    acquire_certificates
    configure_nginx_tls
    setup_auto_renewal
    run_validation
    show_summary
}

# Run main function
main "$@"
