#!/usr/bin/env bash

# =================================================================================================
# Nx Cache Directory Setup Script
# =================================================================================================
#
# This script reads the cache directory configuration from .nx-cache-config and sets up
# the NX_CACHE_DIRECTORY environment variable for the current shell session.
#
# DESCRIPTION:
#   This script provides a mechanism to configure a custom Nx cache directory, allowing
#   developers to store Nx cache files outside of cloud-synced directories (like OneDrive).
#   This prevents unnecessary synchronization of temporary files and improves performance.
#
# USAGE:
#   Source this script before running Nx commands:
#   
#   Linux/macOS/WSL:
#     source ./scripts/nx-setup-cache.sh
#   
#   Windows (Git Bash):
#     source ./scripts/nx-setup-cache.sh
#   
#   Then run Nx commands as usual:
#     nx build my-app
#     nx test my-lib
#
# CONFIGURATION:
#   1. Copy .nx-cache-config.example to .nx-cache-config
#   2. Edit .nx-cache-config and set NX_CACHE_DIR to your desired cache directory
#   3. Source this script before running Nx commands
#
# ENVIRONMENT VARIABLES SET:
#   - NX_CACHE_DIRECTORY: The directory where Nx will store cache files
#
# EXIT CODES:
#   0 - Success
#   1 - Configuration file not found or invalid
#
# NOTES:
#   - This script must be sourced (not executed) to affect the current shell
#   - The cache directory will be created automatically if it doesn't exist
#   - Supports both absolute and relative paths
#   - Cross-platform compatible (Linux, macOS, Windows with Git Bash/WSL)
#
# =================================================================================================

# Color codes for output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m' # No Color

# Configuration file path
readonly CONFIG_FILE=".nx-cache-config"
readonly WORKSPACE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Function to print colored messages
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Function to print error and exit
print_error() {
    print_message "$RED" "ERROR: $1"
    return 1
}

# Function to print info
print_info() {
    print_message "$BLUE" "INFO: $1"
}

# Function to print success
print_success() {
    print_message "$GREEN" "SUCCESS: $1"
}

# Function to print warning
print_warning() {
    print_message "$YELLOW" "WARNING: $1"
}

# Function to validate and normalize path
normalize_path() {
    local input_path=$1
    local normalized_path
    
    # Handle empty path
    if [ -z "$input_path" ]; then
        return 1
    fi
    
    # Convert Windows-style paths to Unix-style (for Git Bash on Windows)
    input_path="${input_path//\\//}"
    
    # If path starts with a drive letter (Windows), it's absolute
    if [[ "$input_path" =~ ^[A-Za-z]:/ ]]; then
        normalized_path="$input_path"
    # If path starts with /, it's absolute (Unix-style)
    elif [[ "$input_path" =~ ^/ ]]; then
        normalized_path="$input_path"
    # If path starts with ~, expand it
    elif [[ "$input_path" =~ ^~ ]]; then
        normalized_path="${input_path/#\~/$HOME}"
    # Otherwise, it's relative to workspace root
    else
        normalized_path="${WORKSPACE_ROOT}/${input_path}"
    fi
    
    echo "$normalized_path"
}

# Main function
setup_nx_cache() {
    print_info "Setting up Nx cache directory configuration..."
    
    # Check if configuration file exists
    if [ ! -f "${WORKSPACE_ROOT}/${CONFIG_FILE}" ]; then
        print_warning "Configuration file '${CONFIG_FILE}' not found."
        print_info "Using Nx default cache directory (.nx/cache)"
        print_info ""
        print_info "To configure a custom cache directory:"
        print_info "  1. Copy ${CONFIG_FILE}.example to ${CONFIG_FILE}"
        print_info "  2. Edit ${CONFIG_FILE} and set NX_CACHE_DIR"
        print_info "  3. Run 'source ./scripts/nx-setup-cache.sh' again"
        return 0
    fi
    
    # Source the configuration file
    # shellcheck source=/dev/null
    source "${WORKSPACE_ROOT}/${CONFIG_FILE}"
    
    # Check if NX_CACHE_DIR is set
    if [ -z "$NX_CACHE_DIR" ]; then
        print_warning "NX_CACHE_DIR is not set in ${CONFIG_FILE}"
        print_info "Using Nx default cache directory (.nx/cache)"
        return 0
    fi
    
    # Normalize the cache directory path
    local cache_dir
    cache_dir=$(normalize_path "$NX_CACHE_DIR")
    
    if [ -z "$cache_dir" ]; then
        print_error "Invalid cache directory path: $NX_CACHE_DIR"
        return 1
    fi
    
    # Create the cache directory if it doesn't exist
    if [ ! -d "$cache_dir" ]; then
        print_info "Creating cache directory: $cache_dir"
        if mkdir -p "$cache_dir" 2>/dev/null; then
            print_success "Cache directory created successfully"
        else
            print_error "Failed to create cache directory: $cache_dir"
            print_info "Please check permissions and try again"
            return 1
        fi
    fi
    
    # Set the environment variable
    export NX_CACHE_DIRECTORY="$cache_dir"
    
    print_success "Nx cache directory configured: $NX_CACHE_DIRECTORY"
    print_info ""
    print_info "You can now run Nx commands normally:"
    print_info "  nx build my-app"
    print_info "  nx test my-lib"
    print_info "  nx run-many -t build"
    print_info ""
    print_info "To make this permanent, add this to your shell profile:"
    print_info "  echo 'source ${WORKSPACE_ROOT}/scripts/nx-setup-cache.sh' >> ~/.bashrc"
    print_info ""
}

# Run the main function
setup_nx_cache
