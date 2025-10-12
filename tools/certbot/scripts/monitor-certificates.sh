#!/usr/bin/env bash

# =================================================================================================
# Certificate Monitoring and Alerting Script
# =================================================================================================
#
# This script monitors SSL/TLS certificates and sends alerts when certificates are about to expire.
# It supports multiple notification channels and provides detailed certificate information.
#
# Features:
# - Certificate expiration monitoring
# - Multiple alert thresholds (critical, warning, info)
# - Notification channels: Email, Slack, PagerDuty, webhook
# - Detailed certificate information
# - Health status reporting
# - Prometheus metrics export
#
# Usage:
#   ./tools/certbot/scripts/monitor-certificates.sh [options]
#
# Options:
#   --domain <domain>          Domain to monitor (default: all in /etc/letsencrypt/live/)
#   --critical-days <days>     Critical threshold in days (default: 7)
#   --warning-days <days>      Warning threshold in days (default: 14)
#   --info-days <days>         Info threshold in days (default: 30)
#   --slack-webhook <url>      Slack webhook URL for notifications
#   --email <address>          Email address for notifications
#   --prometheus-file <path>   Export Prometheus metrics to file
#   --json                     Output in JSON format
#   --quiet                    Suppress normal output
#   --help                     Show this help message
#
# =================================================================================================

set -euo pipefail

# Color codes
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly CYAN='\033[0;36m'
readonly NC='\033[0m'

# Configuration
DOMAIN=""
CRITICAL_DAYS=7
WARNING_DAYS=14
INFO_DAYS=30
SLACK_WEBHOOK=""
EMAIL=""
PROMETHEUS_FILE=""
JSON_OUTPUT=false
QUIET=false

# Directories
LETSENCRYPT_DIR="/etc/letsencrypt"
if [ -d "./volumes/letsencrypt" ]; then
    LETSENCRYPT_DIR="./volumes/letsencrypt"
fi

# =================================================================================================
# Helper Functions
# =================================================================================================

print_color() {
    if [ "$QUIET" = false ]; then
        echo -e "${1}${2}${NC}"
    fi
}

print_info() {
    print_color "$BLUE" "ℹ $1"
}

print_success() {
    print_color "$GREEN" "✓ $1"
}

print_warning() {
    print_color "$YELLOW" "⚠ $1"
}

print_error() {
    print_color "$RED" "✗ $1" >&2
}

show_help() {
    cat << EOF
Certificate Monitoring and Alerting Script

Monitors SSL/TLS certificates and sends alerts based on expiration thresholds.

Usage:
  $0 [options]

Options:
  --domain <domain>          Monitor specific domain (default: all)
  --critical-days <days>     Critical threshold (default: 7)
  --warning-days <days>      Warning threshold (default: 14)
  --info-days <days>         Info threshold (default: 30)
  --slack-webhook <url>      Slack webhook for notifications
  --email <address>          Email for notifications
  --prometheus-file <path>   Export Prometheus metrics
  --json                     Output in JSON format
  --quiet                    Suppress output
  --help                     Show this help

Examples:
  # Monitor all certificates
  $0

  # Monitor specific domain with Slack alerts
  $0 --domain example.com --slack-webhook https://hooks.slack.com/...

  # Export Prometheus metrics
  $0 --prometheus-file /var/lib/prometheus/certbot_metrics.prom

  # JSON output for automation
  $0 --json --quiet

Thresholds:
  - Critical: Certificate expires in < 7 days
  - Warning:  Certificate expires in < 14 days
  - Info:     Certificate expires in < 30 days

Notification Channels:
  - Slack:    Webhook integration
  - Email:    SMTP (requires mailx or sendmail)
  - Metrics:  Prometheus-compatible file

EOF
    exit 0
}

# =================================================================================================
# Certificate Functions
# =================================================================================================

get_certificate_expiry() {
    local cert_file="$1"
    openssl x509 -enddate -noout -in "$cert_file" 2>/dev/null | cut -d= -f2
}

get_certificate_subject() {
    local cert_file="$1"
    openssl x509 -subject -noout -in "$cert_file" 2>/dev/null | sed 's/subject=//'
}

get_certificate_issuer() {
    local cert_file="$1"
    openssl x509 -issuer -noout -in "$cert_file" 2>/dev/null | sed 's/issuer=//'
}

get_days_until_expiry() {
    local cert_file="$1"
    local expiry_date=$(get_certificate_expiry "$cert_file")
    local expiry_epoch=$(date -d "$expiry_date" +%s 2>/dev/null || date -j -f "%b %d %H:%M:%S %Y %Z" "$expiry_date" +%s 2>/dev/null)
    local now_epoch=$(date +%s)
    local seconds_diff=$((expiry_epoch - now_epoch))
    echo $((seconds_diff / 86400))
}

get_certificate_san() {
    local cert_file="$1"
    openssl x509 -text -noout -in "$cert_file" 2>/dev/null | grep -A1 "Subject Alternative Name" | tail -n1 | sed 's/^\s*//'
}

# =================================================================================================
# Alert Functions
# =================================================================================================

send_slack_alert() {
    local message="$1"
    local level="$2"  # info, warning, critical
    
    if [ -z "$SLACK_WEBHOOK" ]; then
        return
    fi
    
    local color="#36a64f"  # green
    case "$level" in
        warning) color="#ff9900" ;;  # orange
        critical) color="#ff0000" ;;  # red
    esac
    
    local payload=$(cat <<EOF
{
    "attachments": [
        {
            "color": "$color",
            "title": "SSL Certificate Alert - $level",
            "text": "$message",
            "footer": "Certificate Monitoring",
            "ts": $(date +%s)
        }
    ]
}
EOF
)
    
    curl -X POST -H 'Content-type: application/json' \
        --data "$payload" \
        "$SLACK_WEBHOOK" 2>/dev/null || true
}

send_email_alert() {
    local subject="$1"
    local message="$2"
    
    if [ -z "$EMAIL" ]; then
        return
    fi
    
    if command -v mail &> /dev/null; then
        echo "$message" | mail -s "$subject" "$EMAIL"
    elif command -v sendmail &> /dev/null; then
        echo -e "Subject: $subject\n\n$message" | sendmail "$EMAIL"
    else
        print_warning "No mail command available for email notifications"
    fi
}

# =================================================================================================
# Monitoring Functions
# =================================================================================================

check_certificate() {
    local domain="$1"
    local cert_file="${LETSENCRYPT_DIR}/live/${domain}/cert.pem"
    
    if [ ! -f "$cert_file" ]; then
        print_error "Certificate not found for domain: $domain"
        return 1
    fi
    
    local days_left=$(get_days_until_expiry "$cert_file")
    local expiry_date=$(get_certificate_expiry "$cert_file")
    local subject=$(get_certificate_subject "$cert_file")
    local issuer=$(get_certificate_issuer "$cert_file")
    local san=$(get_certificate_san "$cert_file")
    
    local status="OK"
    local level="info"
    
    if [ "$days_left" -lt "$CRITICAL_DAYS" ]; then
        status="CRITICAL"
        level="critical"
        print_error "CRITICAL: Certificate for $domain expires in $days_left days!"
    elif [ "$days_left" -lt "$WARNING_DAYS" ]; then
        status="WARNING"
        level="warning"
        print_warning "WARNING: Certificate for $domain expires in $days_left days"
    elif [ "$days_left" -lt "$INFO_DAYS" ]; then
        status="INFO"
        level="info"
        print_info "INFO: Certificate for $domain expires in $days_left days"
    else
        print_success "OK: Certificate for $domain is valid ($days_left days remaining)"
    fi
    
    # Send alerts if needed
    if [ "$status" != "OK" ]; then
        local alert_message="Certificate for $domain expires in $days_left days\\n\\nExpiry Date: $expiry_date\\nSubject: $subject\\nIssuer: $issuer"
        
        send_slack_alert "$alert_message" "$level"
        send_email_alert "SSL Certificate Alert: $domain - $status" "$alert_message"
    fi
    
    # JSON output
    if [ "$JSON_OUTPUT" = true ]; then
        cat << EOF
{
    "domain": "$domain",
    "status": "$status",
    "days_until_expiry": $days_left,
    "expiry_date": "$expiry_date",
    "subject": "$subject",
    "issuer": "$issuer",
    "san": "$san"
}
EOF
    fi
    
    # Prometheus metrics
    if [ -n "$PROMETHEUS_FILE" ]; then
        cat >> "$PROMETHEUS_FILE" << EOF
# HELP certbot_certificate_expiry_days Days until certificate expiry
# TYPE certbot_certificate_expiry_days gauge
certbot_certificate_expiry_days{domain="$domain"} $days_left

# HELP certbot_certificate_status Certificate status (0=OK, 1=INFO, 2=WARNING, 3=CRITICAL)
# TYPE certbot_certificate_status gauge
certbot_certificate_status{domain="$domain"} $([ "$status" = "OK" ] && echo 0 || [ "$status" = "INFO" ] && echo 1 || [ "$status" = "WARNING" ] && echo 2 || echo 3)

EOF
    fi
    
    return 0
}

monitor_all_certificates() {
    if [ ! -d "${LETSENCRYPT_DIR}/live" ]; then
        print_error "Let's Encrypt directory not found: ${LETSENCRYPT_DIR}/live"
        exit 1
    fi
    
    # Clear Prometheus metrics file if it exists
    if [ -n "$PROMETHEUS_FILE" ]; then
        > "$PROMETHEUS_FILE"
    fi
    
    if [ "$JSON_OUTPUT" = true ]; then
        echo "["
    fi
    
    local first=true
    local total=0
    local ok=0
    local info=0
    local warning=0
    local critical=0
    
    for domain_dir in "${LETSENCRYPT_DIR}/live"/*; do
        if [ -d "$domain_dir" ]; then
            local domain=$(basename "$domain_dir")
            
            if [ "$JSON_OUTPUT" = true ] && [ "$first" = false ]; then
                echo ","
            fi
            
            if check_certificate "$domain"; then
                ((ok++))
            else
                ((critical++))
            fi
            
            ((total++))
            first=false
        fi
    done
    
    if [ "$JSON_OUTPUT" = true ]; then
        echo "]"
    fi
    
    # Summary
    if [ "$JSON_OUTPUT" = false ] && [ "$QUIET" = false ]; then
        echo ""
        print_info "Summary:"
        echo "  Total Certificates: $total"
        echo "  OK: $ok"
        echo "  Info: $info"
        echo "  Warning: $warning"
        echo "  Critical: $critical"
    fi
}

# =================================================================================================
# Main
# =================================================================================================

main() {
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --domain)
                DOMAIN="$2"
                shift 2
                ;;
            --critical-days)
                CRITICAL_DAYS="$2"
                shift 2
                ;;
            --warning-days)
                WARNING_DAYS="$2"
                shift 2
                ;;
            --info-days)
                INFO_DAYS="$2"
                shift 2
                ;;
            --slack-webhook)
                SLACK_WEBHOOK="$2"
                shift 2
                ;;
            --email)
                EMAIL="$2"
                shift 2
                ;;
            --prometheus-file)
                PROMETHEUS_FILE="$2"
                shift 2
                ;;
            --json)
                JSON_OUTPUT=true
                shift
                ;;
            --quiet)
                QUIET=true
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
    
    # Run monitoring
    if [ -n "$DOMAIN" ]; then
        check_certificate "$DOMAIN"
    else
        monitor_all_certificates
    fi
}

main "$@"
