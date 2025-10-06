#!/bin/bash
set -e

# --- Helper for logging ---
log_test() {
    echo "✅ PASSED: $1"
}

# --- Test Functions ---
assert_node_lts() {
    # Simple check: NodeSource LTS setup script should configure for v20 or higher.
    # A more robust check could parse `node -v` output precisely.
    if ! node -v | grep -q "v2[0-9]\\."; then
        echo "❌ FAILED: Node.js is not the latest LTS version." >&2
        exit 1
    fi
    log_test "Node.js is a recent LTS version."
}

assert_pnpm_installed() {
    if ! command -v pnpm &> /dev/null; then
        echo "❌ FAILED: pnpm is not installed or not in PATH." >&2
        exit 1
    fi
    log_test "pnpm is installed."
}

assert_nx_installed() {
    if ! command -v nx &> /dev/null; then
        echo "❌ FAILED: Nx is not installed or not in PATH." >&2
        exit 1
    fi
    log_test "Nx is installed."
}

assert_firacode_installed() {
    if ! dpkg -l | grep -q "fonts-firacode"; then
        echo "❌ FAILED: fonts-firacode is not installed." >&2
        exit 1
    fi
    log_test "Fira Code font is installed."
}

assert_build_log_exists() {
    if [ ! -f "/var/log/build.log" ]; then
        echo "❌ FAILED: Build log file /var/log/build.log does not exist." >&2
        exit 1
    fi
    log_test "Build log file exists."
}

# --- Run All Tests ---
echo "--- Running Dev Container Verification Tests ---"
assert_node_lts
assert_pnpm_installed
assert_nx_installed
assert_firacode_installed
assert_build_log_exists
echo "--- All Verification Tests Passed ---"
