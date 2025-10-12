#!/bin/bash
# =================================================================================================
# Certbot Installation Script with OS Auto-Detection
# =================================================================================================
#
# This script automatically detects the operating system and installs certbot with proper
# configuration. It supports multiple Linux distributions and macOS.
#
# Supported Operating Systems:
# - Ubuntu/Debian (apt)
# - CentOS/RHEL/Fedora (yum/dnf)
# - Amazon Linux (yum)
# - Alpine Linux (apk)
# - macOS (homebrew)
#
# Prerequisites:
# - Root or sudo access (for package installation)
# - Internet connection
#
# Usage:
#   ./tools/nginx/scripts/tls/install-certbot.sh
#   nx run nginx:tls:install-certbot
#
# Options:
#   --skip-update    Skip package manager update before installation
#   --dry-run        Show what would be installed without installing
#   --help           Show this help message
#
# =================================================================================================

set -e

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
SKIP_UPDATE=false
DRY_RUN=false

# Function to show help
show_help() {
    cat << EOF
Certbot Installation Script with OS Auto-Detection

Usage: $0 [options]

Options:
  --skip-update    Skip package manager update before installation
  --dry-run        Show what would be installed without installing
  --help           Show this help message

Examples:
  # Standard installation
  $0

  # Dry run to see what would be installed
  $0 --dry-run

  # Skip package manager update
  $0 --skip-update

Supported Operating Systems:
  - Ubuntu/Debian (apt)
  - CentOS/RHEL/Fedora (yum/dnf)
  - Amazon Linux (yum)
  - Alpine Linux (apk)
  - macOS (homebrew)

For more information, visit: https://certbot.eff.org/
EOF
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-update)
            SKIP_UPDATE=true
            shift
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --help)
            show_help
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            echo ""
            show_help
            exit 1
            ;;
    esac
done

echo -e "${BLUE}=================================================================================================${NC}"
echo -e "${BLUE}Certbot Installation Script${NC}"
echo -e "${BLUE}=================================================================================================${NC}"
echo ""

# Check if certbot is already installed
echo -e "${YELLOW}[1/5] Checking for existing certbot installation...${NC}"
if command -v certbot &> /dev/null; then
    CERTBOT_VERSION=$(certbot --version 2>&1 | head -1)
    echo -e "${GREEN}✓ Certbot is already installed: ${CERTBOT_VERSION}${NC}"
    echo ""
    echo -e "${BLUE}To reinstall or upgrade, remove certbot first:${NC}"
    echo ""
    
    # Detect OS for removal instructions
    if [ -f /etc/os-release ]; then
        # shellcheck source=/dev/null
        . /etc/os-release
        OS=$ID
        
        case $OS in
            ubuntu|debian)
                echo "  sudo apt-get remove certbot"
                ;;
            centos|rhel|fedora)
                echo "  sudo yum remove certbot"
                ;;
            alpine)
                echo "  sudo apk del certbot"
                ;;
            amzn)
                echo "  sudo yum remove certbot"
                ;;
        esac
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "  brew uninstall certbot"
    fi
    
    echo ""
    exit 0
fi
echo -e "${CYAN}  Certbot is not installed. Proceeding with installation...${NC}"
echo ""

# Detect operating system
echo -e "${YELLOW}[2/5] Detecting operating system...${NC}"

OS_TYPE=""
PACKAGE_MANAGER=""

if [ -f /etc/os-release ]; then
    # Linux distribution
    # shellcheck source=/dev/null
    . /etc/os-release
    OS_TYPE=$ID
    
    case $OS_TYPE in
        ubuntu|debian)
            PACKAGE_MANAGER="apt"
            echo -e "${GREEN}✓ Detected: $PRETTY_NAME${NC}"
            ;;
        centos|rhel)
            PACKAGE_MANAGER="yum"
            echo -e "${GREEN}✓ Detected: $PRETTY_NAME${NC}"
            ;;
        fedora)
            PACKAGE_MANAGER="dnf"
            echo -e "${GREEN}✓ Detected: $PRETTY_NAME${NC}"
            ;;
        alpine)
            PACKAGE_MANAGER="apk"
            echo -e "${GREEN}✓ Detected: $PRETTY_NAME${NC}"
            ;;
        amzn)
            PACKAGE_MANAGER="yum"
            echo -e "${GREEN}✓ Detected: Amazon Linux $VERSION_ID${NC}"
            ;;
        *)
            echo -e "${RED}✗ Unsupported Linux distribution: $OS_TYPE${NC}"
            echo ""
            echo "Please install certbot manually from: https://certbot.eff.org/instructions"
            exit 1
            ;;
    esac
elif [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    OS_TYPE="macos"
    PACKAGE_MANAGER="brew"
    echo -e "${GREEN}✓ Detected: macOS${NC}"
else
    echo -e "${RED}✗ Unsupported operating system${NC}"
    echo ""
    echo "Please install certbot manually from: https://certbot.eff.org/instructions"
    exit 1
fi
echo ""

# Check for required tools
echo -e "${YELLOW}[3/5] Checking prerequisites...${NC}"

# Check for sudo or root access
if [ "$EUID" -ne 0 ] && ! command -v sudo &> /dev/null; then
    echo -e "${RED}✗ This script requires root access or sudo${NC}"
    exit 1
fi

SUDO_CMD=""
if [ "$EUID" -ne 0 ]; then
    SUDO_CMD="sudo"
    echo -e "${CYAN}  Using sudo for package installation${NC}"
fi

# Check package manager
case $PACKAGE_MANAGER in
    apt)
        if ! command -v apt-get &> /dev/null; then
            echo -e "${RED}✗ apt-get not found${NC}"
            exit 1
        fi
        echo -e "${GREEN}✓ Package manager: apt-get${NC}"
        ;;
    yum)
        if ! command -v yum &> /dev/null; then
            echo -e "${RED}✗ yum not found${NC}"
            exit 1
        fi
        echo -e "${GREEN}✓ Package manager: yum${NC}"
        ;;
    dnf)
        if ! command -v dnf &> /dev/null; then
            echo -e "${RED}✗ dnf not found${NC}"
            exit 1
        fi
        echo -e "${GREEN}✓ Package manager: dnf${NC}"
        ;;
    apk)
        if ! command -v apk &> /dev/null; then
            echo -e "${RED}✗ apk not found${NC}"
            exit 1
        fi
        echo -e "${GREEN}✓ Package manager: apk${NC}"
        ;;
    brew)
        if ! command -v brew &> /dev/null; then
            echo -e "${RED}✗ Homebrew not found${NC}"
            echo ""
            echo "Install Homebrew first:"
            echo "  /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
            exit 1
        fi
        echo -e "${GREEN}✓ Package manager: Homebrew${NC}"
        ;;
esac
echo ""

# Install certbot
echo -e "${YELLOW}[4/5] Installing certbot...${NC}"

if [ "$DRY_RUN" = true ]; then
    echo -e "${CYAN}  DRY RUN MODE - Commands that would be executed:${NC}"
    echo ""
fi

case $PACKAGE_MANAGER in
    apt)
        if [ "$DRY_RUN" = true ]; then
            echo "  $SUDO_CMD apt-get update"
            echo "  $SUDO_CMD apt-get install -y certbot python3-certbot-nginx"
        else
            echo -e "${CYAN}  Updating package list...${NC}"
            if [ "$SKIP_UPDATE" = false ]; then
                $SUDO_CMD apt-get update -qq
            fi
            
            echo -e "${CYAN}  Installing certbot and nginx plugin...${NC}"
            $SUDO_CMD apt-get install -y certbot python3-certbot-nginx
            
            echo -e "${GREEN}✓ Certbot installed successfully${NC}"
        fi
        ;;
        
    yum)
        if [ "$DRY_RUN" = true ]; then
            echo "  $SUDO_CMD yum install -y epel-release"
            echo "  $SUDO_CMD yum install -y certbot python3-certbot-nginx"
        else
            echo -e "${CYAN}  Enabling EPEL repository...${NC}"
            if [ "$SKIP_UPDATE" = false ]; then
                $SUDO_CMD yum install -y epel-release 2>/dev/null || true
            fi
            
            echo -e "${CYAN}  Installing certbot and nginx plugin...${NC}"
            $SUDO_CMD yum install -y certbot python3-certbot-nginx
            
            echo -e "${GREEN}✓ Certbot installed successfully${NC}"
        fi
        ;;
        
    dnf)
        if [ "$DRY_RUN" = true ]; then
            echo "  $SUDO_CMD dnf install -y certbot python3-certbot-nginx"
        else
            echo -e "${CYAN}  Installing certbot and nginx plugin...${NC}"
            $SUDO_CMD dnf install -y certbot python3-certbot-nginx
            
            echo -e "${GREEN}✓ Certbot installed successfully${NC}"
        fi
        ;;
        
    apk)
        if [ "$DRY_RUN" = true ]; then
            echo "  $SUDO_CMD apk update"
            echo "  $SUDO_CMD apk add certbot certbot-nginx"
        else
            echo -e "${CYAN}  Updating package index...${NC}"
            if [ "$SKIP_UPDATE" = false ]; then
                $SUDO_CMD apk update
            fi
            
            echo -e "${CYAN}  Installing certbot and nginx plugin...${NC}"
            $SUDO_CMD apk add certbot certbot-nginx
            
            echo -e "${GREEN}✓ Certbot installed successfully${NC}"
        fi
        ;;
        
    brew)
        if [ "$DRY_RUN" = true ]; then
            echo "  brew install certbot"
        else
            echo -e "${CYAN}  Installing certbot...${NC}"
            brew install certbot
            
            echo -e "${GREEN}✓ Certbot installed successfully${NC}"
        fi
        ;;
esac
echo ""

# Verify installation
if [ "$DRY_RUN" = false ]; then
    echo -e "${YELLOW}[5/5] Verifying installation...${NC}"
    
    if command -v certbot &> /dev/null; then
        CERTBOT_VERSION=$(certbot --version 2>&1 | head -1)
        echo -e "${GREEN}✓ Certbot installed: ${CERTBOT_VERSION}${NC}"
        
        # Check for plugins
        echo ""
        echo -e "${CYAN}Available plugins:${NC}"
        certbot plugins 2>/dev/null || echo "  (Unable to list plugins)"
    else
        echo -e "${RED}✗ Certbot installation verification failed${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}[5/5] Skipped verification (dry run mode)${NC}"
fi
echo ""

# Summary and next steps
echo -e "${GREEN}=================================================================================================${NC}"
echo -e "${GREEN}✓ Certbot Installation Completed Successfully!${NC}"
echo -e "${GREEN}=================================================================================================${NC}"
echo ""

if [ "$DRY_RUN" = false ]; then
    echo -e "${BLUE}Certbot Configuration:${NC}"
    echo "  Version:       $(certbot --version 2>&1 | head -1)"
    echo "  Config Dir:    /etc/letsencrypt"
    echo "  Work Dir:      /var/lib/letsencrypt"
    echo "  Log Dir:       /var/log/letsencrypt"
    echo ""
fi

echo -e "${BLUE}Next Steps:${NC}"
echo "  1. Configure certbot for your domain:"
echo "     nx run nginx:tls:setup-letsencrypt -- --domain yourdomain.com --email your@email.com"
echo ""
echo "  2. Or use certbot directly:"
echo "     certbot certonly --nginx -d yourdomain.com"
echo ""
echo "  3. Set up automatic renewal:"
echo "     - Ubuntu/Debian: sudo systemctl enable certbot.timer"
echo "     - CentOS/RHEL:   Add to crontab: 0 0,12 * * * certbot renew --quiet"
echo "     - macOS:         Create a launchd job or cron entry"
echo ""
echo -e "${BLUE}Documentation:${NC}"
echo "  - Certbot: https://certbot.eff.org/instructions"
echo "  - Let's Encrypt: https://letsencrypt.org/docs/"
echo ""
echo -e "${GREEN}=================================================================================================${NC}"
