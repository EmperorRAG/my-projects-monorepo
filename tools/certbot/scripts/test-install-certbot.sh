#!/bin/bash
# =================================================================================================
# Test Script for install-certbot.sh
# =================================================================================================
#
# This script tests the install-certbot.sh script to ensure it works correctly.
#
# =================================================================================================

set -e

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INSTALL_SCRIPT="${SCRIPT_DIR}/install-certbot.sh"

# Test counter
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

# Function to run a test
run_test() {
    local test_name=$1
    local test_command=$2
    
    TESTS_RUN=$((TESTS_RUN + 1))
    
    echo -e "${BLUE}Running test: ${test_name}${NC}"
    
    if eval "$test_command"; then
        TESTS_PASSED=$((TESTS_PASSED + 1))
        echo -e "${GREEN}✓ PASSED${NC}"
    else
        TESTS_FAILED=$((TESTS_FAILED + 1))
        echo -e "${RED}✗ FAILED${NC}"
    fi
    echo ""
}

echo -e "${BLUE}=================================================================================================${NC}"
echo -e "${BLUE}Testing install-certbot.sh${NC}"
echo -e "${BLUE}=================================================================================================${NC}"
echo ""

# Test 1: Script exists and is executable
run_test "Script exists and is executable" "[ -x '$INSTALL_SCRIPT' ]"

# Test 2: Help option works
run_test "Help option works" "bash '$INSTALL_SCRIPT' --help > /dev/null 2>&1"

# Test 3: Dry run mode works
run_test "Dry run mode works" "bash '$INSTALL_SCRIPT' --dry-run > /dev/null 2>&1"

# Test 4: OS detection works
run_test "OS detection works" "bash '$INSTALL_SCRIPT' --dry-run 2>&1 | grep -q 'Detected:'"

# Test 5: Package manager detection works
run_test "Package manager detection works" "bash '$INSTALL_SCRIPT' --dry-run 2>&1 | grep -q 'Package manager:'"

# Test 6: Invalid option handling
run_test "Invalid option handling" "! bash '$INSTALL_SCRIPT' --invalid-option > /dev/null 2>&1"

# Test 7: Script has proper shebang
run_test "Script has proper shebang" "head -1 '$INSTALL_SCRIPT' | grep -q '^#!/bin/bash'"

# Test 8: Shellcheck passes
if command -v shellcheck &> /dev/null; then
    run_test "Shellcheck validation" "shellcheck '$INSTALL_SCRIPT'"
else
    echo -e "${YELLOW}⚠ Skipping shellcheck test (shellcheck not installed)${NC}"
    echo ""
fi

# Test 9: Script handles certbot already installed case
# This test simulates certbot being already installed
run_test "Certbot already installed detection" "
    # Create a temporary PATH with a fake certbot
    TEMP_DIR=\$(mktemp -d)
    echo '#!/bin/bash
echo \"certbot 2.0.0\"' > \"\$TEMP_DIR/certbot\"
    chmod +x \"\$TEMP_DIR/certbot\"
    PATH=\"\$TEMP_DIR:\$PATH\" bash '$INSTALL_SCRIPT' 2>&1 | grep -q 'already installed'
    rm -rf \"\$TEMP_DIR\"
"

# Test 10: Script output contains expected sections
run_test "Output contains all required sections" "
    bash '$INSTALL_SCRIPT' --dry-run 2>&1 | grep -q '\\[1/5\\]' &&
    bash '$INSTALL_SCRIPT' --dry-run 2>&1 | grep -q '\\[2/5\\]' &&
    bash '$INSTALL_SCRIPT' --dry-run 2>&1 | grep -q '\\[3/5\\]' &&
    bash '$INSTALL_SCRIPT' --dry-run 2>&1 | grep -q '\\[4/5\\]' &&
    bash '$INSTALL_SCRIPT' --dry-run 2>&1 | grep -q '\\[5/5\\]'
"

# Summary
echo -e "${BLUE}=================================================================================================${NC}"
echo -e "${BLUE}Test Summary${NC}"
echo -e "${BLUE}=================================================================================================${NC}"
echo ""
echo -e "Tests run:    ${TESTS_RUN}"
echo -e "${GREEN}Tests passed: ${TESTS_PASSED}${NC}"
if [ $TESTS_FAILED -gt 0 ]; then
    echo -e "${RED}Tests failed: ${TESTS_FAILED}${NC}"
else
    echo -e "Tests failed: ${TESTS_FAILED}"
fi
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed!${NC}"
    exit 1
fi
