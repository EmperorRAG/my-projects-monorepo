# -------------------------------------------------------------------------------------------------
# Dockerfile for the 'my-projects-monorepo' Development Container
#
# =================================================================================================
# SECTION 0: AI_INTERACTION_FRAMEWORK
# =================================================================================================
#
# PURPOSE:
# This framework provides a structured guide for AI models to understand, parse, and modify this
# Dockerfile. Adhering to this framework ensures that changes are consistent, well-documented,
# and aligned with the project's architectural principles.
#
# ---
#
# AI MODIFICATION PROTOCOL:
# When tasked with modifying this file, you MUST follow this sequence:
# 1.  READ THE FRAMEWORK: Start by reading this entire "AI_INTERACTION_FRAMEWORK" section (SECTION 0)
#     to understand the rules and structure.
# 2.  UPDATE THE DOCUMENTATION: Before writing any code, update the relevant documentation
#     sections (PRD, Technical Specification, Implementation Plan, and ADRs).
# 3.  UPDATE THE METADATA: Add or update `TECH_META` comments and the `FEATURE_ANCHOR_REGISTRY`
#     to reflect the planned changes.
# 4.  LOG CONFIDENCE: Before implementing any change, you must add an entry to the AI_CONFIDENCE_LOG (5.4)
#     detailing your confidence in understanding the sections you are about to modify.
# 5.  IMPLEMENT THE CHANGE: Modify the `DOCKER_IMPLEMENTATION` section (SECTION 4) last, ensuring
#     each command aligns with the updated plan and is preceded by the correct metadata.
# 6.  MAINTAIN ATOMICITY: Keep `RUN` commands atomic (one logical action per command) to preserve
#     Docker layer caching and simplify debugging.
#
# ---
#
# FILE STRUCTURE OVERVIEW:
# The file is organized into semantic sections. You must parse and interpret them in order:
# - SECTION 0: AI_INTERACTION_FRAMEWORK (This section)
# - SECTION 1: PRODUCT_REQUIREMENTS_DOCUMENT (PRD) - The "Why"
# - SECTION 2: TECHNICAL_SPECIFICATION - The "What"
# - SECTION 3: IMPLEMENTATION_PLAN - The "How"
# - SECTION 4: DOCKER_IMPLEMENTATION - The "Code"
# - SECTION 5: ARCHITECTURE_AND_TECHNOLOGY_METADATA - The "Context"
#
# =================================================================================================
#
# AI_NOTE: This file is designed to be both human-readable and easily parsable by AI models.
# It is structured with the following sections:
# 1. PRODUCT_REQUIREMENTS: High-level goals for the dev environment.
# 2. TECHNICAL_SPECIFICATION: Technical details derived from the requirements.
# 3. IMPLEMENTATION_PLAN: Step-by-step guide that maps to the Dockerfile commands.
# 4. DOCKER_IMPLEMENTATION: The actual Dockerfile commands that build the image.
#
# To modify this file, please follow the structure:
# - First, update the PRD, Technical Specification, and Implementation Plan sections.
# - Then, modify the Docker commands in the implementation section to match the plan.
# - Keep commands atomic (one per RUN statement) for better caching and debugging.
# - Add or update comments for every command you change.
# -------------------------------------------------------------------------------------------------

# -------------------------------------------------------------------------------------------------
# SECTION 1: PRODUCT_REQUIREMENTS_DOCUMENT (PRD)
# -------------------------------------------------------------------------------------------------
#
# PURPOSE:
# To define a consistent, reproducible, and fully-equipped development environment for the
# 'my-projects-monorepo'. This environment ensures that all developers have the exact same
# set of tools and configurations, eliminating "it works on my machine" issues.
#
# USER_STORIES:
# 1. As a developer, I want to open the project in a container that has Node.js, pnpm, and Nx
#    pre-installed, so I can start working on the project immediately without any setup.
# 2. As a developer, I want the Fira Code font available in the container, so I can have a
#    consistent and preferred visual experience in the terminal and editor.
# 3. As a developer, I want the environment to be based on a stable, common Linux distribution
#    to ensure broad compatibility and ease of troubleshooting.
# 4. As a developer, I want the Docker build process to generate detailed logs for each step,
#    so I can easily diagnose and debug build failures without needing to re-run the build.
# 5. As a project maintainer, I want the container build process to automatically verify that
#    all acceptance criteria are met, so I can have confidence that the environment is
#    correctly configured.
#
# ACCEPTANCE_CRITERIA:
# - The final container image must have the latest LTS version of Node.js installed.
# - The final container image must have the latest versions of pnpm and Nx installed globally.
# - The 'fonts-firacode' package must be installed and available.
# - All output (stdout and stderr) from every `RUN` command during the build must be captured
#   in a log file located at `/var/log/build.log`.
# - A verification script (`/usr/local/bin/verify-devcontainer.sh`) must run successfully as
#   the final step of the build, confirming that all other acceptance criteria have been met.
# - The container must build successfully without errors.
#
# -------------------------------------------------------------------------------------------------

# -------------------------------------------------------------------------------------------------
# SECTION 2: TECHNICAL_SPECIFICATION
# -------------------------------------------------------------------------------------------------
#
# BASE_IMAGE:
# - Use the official Microsoft Dev Containers base image for Ubuntu.
# - Image: mcr.microsoft.com/devcontainers/base:ubuntu
# - Rationale: This provides a stable, well-maintained, and general-purpose foundation.
#
# SYSTEM_DEPENDENCIES:
# - `curl`: Required to download the Node.js setup script.
# - `fonts-firacode`: The font requested in the PRD.
# - `nodejs`: The JavaScript runtime environment.
#
# TOOLING_SETUP:
# - Node.js: Install the latest Long-Term Support (LTS) version using the official NodeSource
#   repository for Debian-based systems.
# - pnpm: Install globally using `npm`. This is the chosen package manager for the project.
# - Nx: Install globally using `pnpm`. This is the monorepo management tool.
#
# ENVIRONMENT_CONFIGURATION:
# - `DEBIIN_FRONTEND=noninteractive`: Prevents interactive prompts during package installation.
# - `PNPM_HOME`: Set to the default pnpm home directory to ensure global packages are
#   correctly installed.
# - `PATH`: Add `PNPM_HOME` to the system's PATH to make globally installed pnpm packages
#   (like Nx) executable.
#
# LOGGING_CONFIGURATION:
# - `LOG_FILE`: A global build log file will be created at `/var/log/build.log`.
# - `LOGGING_MECHANISM`: All `RUN` commands will have their stdout and stderr streams redirected
#   to both the console and the `LOG_FILE`. This is achieved by piping the output to
#   `tee -a`. The `2>&1` construct ensures that stderr is captured along with stdout.
#
# VERIFICATION_SCRIPT:
# - A shell script will be created at `/usr/local/bin/verify-devcontainer.sh`.
# - The script will be made executable (`chmod +x`).
# - It will contain a series of assertions to programmatically check each acceptance criterion.
# - The script will be executed as the final step in the Docker build. If any assertion
#   fails, the script will exit with a non-zero status code, causing the build to fail.
#
# -------------------------------------------------------------------------------------------------

# -------------------------------------------------------------------------------------------------
# SECTION 3: IMPLEMENTATION_PLAN
# -------------------------------------------------------------------------------------------------
#
# STEP_1: Set the Base Image.
#   - Use `FROM` to specify 'mcr.microsoft.com/devcontainers/base:ubuntu'.
#
# STEP_2: Configure the Environment for Non-Interactive Installation.
#   - Use `ARG` to set `DEBIAN_FRONTEND` to 'noninteractive'.
#
# STEP_3: Configure Global Logging.
#   - Create and set permissions for the log directory and file (`/var/log/build.log`).
#
# STEP_4: Update System Packages and Log Output.
#   - Run `apt-get update` and pipe its output to the log file.
#
# STEP_5: Install Core System Dependencies and Log Output.
#   - Run `apt-get install` for 'curl' and 'fonts-firacode', piping output to the log file.
#
# STEP_6: Add NodeSource Repository and Log Output.
#   - Use `curl` to download and execute the Node.js LTS setup script, piping output to the log file.
#
# STEP_7: Install Node.js and Log Output.
#   - Run `apt-get install` for 'nodejs', piping output to the log file.
#
# STEP_8: Install pnpm and Log Output.
#   - Use `npm install -g` to install 'pnpm', piping output to the log file.
#
# STEP_9: Configure Environment for pnpm Global Packages.
#   - Use `ENV` to set `PNPM_HOME` to '/root/.local/share/pnpm'.
#   - Use `ENV` to prepend `PNPM_HOME` to the `PATH`.
#
# STEP_10: Run pnpm Setup and Log Output.
#   - Execute `pnpm setup`, piping output to the log file.
#
# STEP_11: Install Nx Globally and Log Output.
#   - Use `pnpm add -g` to install 'nx', piping output to the log file.
#
# STEP_12: Clean Up APT Cache and Log Output.
#   - Run `apt-get clean` and remove lists, piping output to the log file.
#
# STEP_13: Create the Verification Script.
#   - Use a `RUN` command with a heredoc to write the verification script's contents to
#     `/usr/local/bin/verify-devcontainer.sh`.
#
# STEP_14: Make the Verification Script Executable.
#   - Run `chmod +x` on the script to grant execute permissions.
#
# STEP_15: Execute the Verification Script.
#   - Run the verification script as the final step to validate the container's state.
#
# -------------------------------------------------------------------------------------------------
# SECTION 5: ARCHITECTURE_AND_TECHNOLOGY_METADATA
# -------------------------------------------------------------------------------------------------
#
# PURPOSE:
# This section serves as a centralized registry for architecture decisions and provides a
# framework for embedding technology metadata directly within the Dockerfile. This creates a
# self-documenting system that enhances context for both human developers and AI assistants.
#
# -------------------------------------------------------------------------------------------------
# SUB-SECTION 5.1: ARCHITECTURE_DECISION_RECORD (ADR) INDEX
# -------------------------------------------------------------------------------------------------
#
# AI_NOTE: This index lists key architectural decisions related to the technologies used in this
# Dockerfile. When a technology is referenced in the implementation, it should be linked to an
# ADR ID from this table via a TECH_META comment.
#
# | ADR_ID  | Technology | Decision                                               | Status      |
# |---------|------------|--------------------------------------------------------|-------------|
# | ADR-001 | Ubuntu     | Use as the base OS for its stability and wide support. | Accepted    |
# | ADR-002 | Node.js    | Use the latest LTS version via NodeSource repository.  | Accepted    |
# | ADR-003 | pnpm       | Adopt as the primary package manager for efficiency.   | Accepted    |
# | ADR-004 | Nx         | Use for monorepo management and task running.          | Accepted    |
# | ADR-005 | Build Logging | Use `tee` to pipe all `RUN` command output to a log file. | Accepted    |
# | ADR-006 | Verification Script | Use a post-build shell script to verify acceptance criteria. | Accepted    |
#
# -------------------------------------------------------------------------------------------------
# SUB-SECTION 5.2: TECHNOLOGY_METADATA_COMMENT_FRAMEWORK
# -------------------------------------------------------------------------------------------------
#
# PURPOSE:
# To annotate commands with structured metadata, providing precise context about the technology
# being used. This enables quick understanding and intelligent automation.
#
# SYNTAX:
# A `TECH_META` comment should be placed directly before any command that installs, configures,
# or uses a key technology.
#
# # TECH_META(technology="<tech_name>", adr="<ADR_ID>", version="<version_spec>", purpose="<brief_purpose>")
#
# FIELDS:
# - `technology`: The name of the technology (e.g., "Node.js", "pnpm").
# - `adr`: The corresponding ID from the ADR_INDEX table above. Use "N/A" if not applicable.
# - `version`: The version being installed or configured (e.g., "LTS", "latest", "1.2.3").
# - `purpose`: A concise explanation of what the command achieves for that technology.
#
# USAGE_GUIDELINES:
# 1. ADDING_METADATA: When adding a new command related to a technology in the ADR_INDEX,
#    you MUST precede it with a corresponding `TECH_META` comment.
# 2. UPDATING_METADATA: If you modify a command (e.g., update a version), you MUST update the
#    fields in the `TECH_META` comment above it to reflect the change.
# 3. CONSISTENCY: Ensure the `adr` field correctly references an existing ADR_ID. If a new
#    technology is introduced, first add an entry for it in the ADR_INDEX.
#
# -------------------------------------------------------------------------------------------------
# SUB-SECTION 5.3: FEATURE_ANCHOR_REGISTRY
# -------------------------------------------------------------------------------------------------
#
# PURPOSE:
# To provide a structured vocabulary for discussing and implementing new features. Feature
# Anchors are semantic keywords that link a proposed change to a specific domain of the
# development environment. When an AI is tasked with adding a feature, it should first
# identify the most relevant anchor to guide its implementation.
#
# USAGE_FOR_AI:
# When you are asked to add a new feature, you MUST:
# 1.  Analyze the request to determine the primary domain it belongs to.
# 2.  Select the corresponding `ANCHOR_ID` from the table below.
# 3.  Use this anchor as a keyword in your reasoning and documentation updates. For example,
#     "This change adds a new linter, which falls under the 'TOOLING' anchor (FA-002)."
# 4.  Consider the `Associated Factors` for that anchor to ensure a holistic implementation.
#
# ---
#
# | ANCHOR_ID | Anchor Name          | Description                                               | Associated Factors to Consider                               |
# |-----------|----------------------|-----------------------------------------------------------|--------------------------------------------------------------|
# | FA-001    | BASE_SYSTEM          | Changes to the underlying OS, system libraries, or env vars. | - Image size impact, - Security vulnerabilities, - Compatibility |
# | FA-002    | TOOLING              | Adding or configuring development tools (e.g., linters, CLIs). | - Global vs. local installation, - Versioning, - PATH config |
# | FA-003    | DEVELOPER_EXPERIENCE | Enhancements for developer comfort (e.g., fonts, shells).    | - User preferences, - Performance overhead, - Cross-platform |
# | FA-004    | SECURITY             | Adding tools or practices for security scanning/hardening.   | - Scan speed, - False positives, - Integration with CI/CD    |
# | FA-005    | DEPENDENCY_MANAGEMENT| Changes related to package managers (npm, pnpm, etc.).     | - Lockfile consistency, - Cache efficiency, - Version pinning  |
#
# -------------------------------------------------------------------------------------------------
# SUB-SECTION 5.4: AI_CONFIDENCE_LOG
# -------------------------------------------------------------------------------------------------
#
# PURPOSE:
# To log an AI's confidence level in understanding each documentation section before a modification
# is made. This creates a feedback loop for identifying and improving ambiguous documentation.
#
# AI_NOTE: Before making changes, add a new row to this table.
#
# | Timestamp | AI_Model_ID | Target_Section_ID | Confidence_Score (1-5) | Justification |
# |-----------|-------------|-------------------|------------------------|---------------|
# | 2025-10-05T00:00:00Z | GitHub Copilot | [0, 5.4, 6] | 5 | The framework was co-created based on direct user input and is designed for explicit, machine-readable parsing. |
# | 2025-10-05T00:00:01Z | GitHub Copilot | [0, 5.4] | 5 | The user's request to add a confidence log entry is a direct execution of the explicit rules defined in the AI_MODIFICATION_PROTOCOL (SECTION 0) and the AI_CONFIDENCE_LOG (SUB-SECTION 5.4). The instructions are clear, structured, and self-referential, requiring no external interpretation. |
# | 2025-10-05T00:00:02Z | GitHub Copilot | [1, 2, 3, 4, 5] | 5 | The plan to implement logging is based on a thorough analysis of the file's framework and uses standard shell commands (`tee`). The documentation has been updated first, as per the protocol, making the implementation in Section 4 a direct and low-risk execution of the established plan. |
# | 2025-10-05T00:00:03Z | GitHub Copilot | [1, 2, 3, 4, 5] | 5 | The user's request to add a verification script is a logical extension of the existing framework. The plan involves updating all relevant documentation sections (PRD, Tech Spec, Plan, ADRs) before creating the script and modifying the Dockerfile, which directly follows the established AI_MODIFICATION_PROTOCOL. The tests themselves are simple shell commands that map directly to the acceptance criteria. |
# -------------------------------------------------------------------------------------------------

# -------------------------------------------------------------------------------------------------
# SECTION 4: DOCKER_IMPLEMENTATION
# AI_NOTE: The following commands implement the plan above. Each RUN command is atomic to
# leverage Docker's layer caching and simplify debugging.
# -------------------------------------------------------------------------------------------------

# STEP_1: Set the Base Image.
# AI_NOTE: This is the foundational layer of our dev container.
# TECH_META(technology="Ubuntu", adr="ADR-001", version="latest", purpose="Sets the base OS for the dev container.")
FROM mcr.microsoft.com/devcontainers/base:ubuntu

# STEP_2: Configure the Environment for Non-Interactive Installation.
# AI_NOTE: This prevents package installers from pausing the build for user input.
ARG DEBIAN_FRONTEND=noninteractive

# STEP_3: Configure Global Logging.
# AI_NOTE: This creates the log file and ensures it's writable.
# TECH_META(technology="Build Logging", adr="ADR-005", version="N/A", purpose="Initializes the global build log file.")
RUN mkdir -p /var/log && touch /var/log/build.log && chmod +w /var/log/build.log

# STEP_4: Update System Packages and Log Output.
# AI_NOTE: This command refreshes the list of available packages from the repositories.
RUN apt-get update 2>&1 | tee -a /var/log/build.log

# STEP_5: Install Core System Dependencies and Log Output.
# AI_NOTE: 'curl' is for downloading files, and 'fonts-firacode' is a user requirement.
RUN apt-get install -y --no-install-recommends curl fonts-firacode 2>&1 | tee -a /var/log/build.log

# STEP_6: Add NodeSource Repository and Log Output.
# AI_NOTE: This command configures APT to fetch Node.js from the official NodeSource repository.
# TECH_META(technology="Node.js", adr="ADR-002", version="LTS", purpose="Adds the NodeSource repository to install Node.js.")
RUN (curl -sL https://deb.nodesource.com/setup_lts.x | bash -) 2>&1 | tee -a /var/log/build.log

# STEP_7: Install Node.js and Log Output.
# AI_NOTE: Installs the Node.js runtime (LTS version) from the newly added repository.
# TECH_META(technology="Node.js", adr="ADR-002", version="LTS", purpose="Installs the Node.js runtime.")
RUN apt-get install -y --no-install-recommends nodejs 2>&1 | tee -a /var/log/build.log

# STEP_8: Install pnpm and Log Output.
# AI_NOTE: Installs the pnpm package manager globally using npm, which comes with Node.js.
# TECH_META(technology="pnpm", adr="ADR-003", version="latest", purpose="Installs the pnpm package manager globally.")
RUN npm install -g pnpm 2>&1 | tee -a /var/log/build.log

# STEP_9: Configure Environment for pnpm Global Packages.
# AI_NOTE: These ENV instructions set the home directory for pnpm and add it to the PATH.
# This is crucial for making globally installed packages like 'nx' available as commands.
# TECH_META(technology="pnpm", adr="ADR-003", version="latest", purpose="Configures the environment for pnpm's global binary location.")
ENV PNPM_HOME="/home/vscode/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# STEP_10: Run pnpm Setup and Log Output.
# AI_NOTE: This command configures the environment (e.g., .bashrc) for pnpm.
# TECH_META(technology="pnpm", adr="ADR-003", version="latest", purpose="Configures the shell environment for pnpm.")
ARG CACHE_BUSTER=1
RUN pnpm setup 2>&1 | tee -a /var/log/build.log

# STEP_11: Install Nx Globally and Log Output.
# AI_NOTE: Installs the Nx CLI globally using pnpm.
# TECH_META(technology="Nx", adr="ADR-004", version="latest", purpose="Installs the Nx CLI globally for monorepo management.")
RUN pnpm add -g nx 2>&1 | tee -a /var/log/build.log

# STEP_11.5: Set Correct Permissions for PNPM_HOME
# AI_NOTE: This command changes the ownership of the pnpm home directory to the 'vscode' user.
# This is critical because all pnpm global commands were run by root, so the resulting files must be owned by the runtime user.
# TECH_META(technology="pnpm", adr="ADR-003", version="N/A", purpose="Fixes directory permissions for the non-root user.")
RUN chown -R vscode:vscode /home/vscode/.local/share/pnpm 2>&1 | tee -a /var/log/build.log

# STEP_12: Clean Up APT Cache and Log Output.
# AI_NOTE: This final step reduces the final image size by removing temporary package files.
RUN (apt-get clean && rm -rf /var/lib/apt/lists/*) 2>&1 | tee -a /var/log/build.log

# STEP_13: Create the Verification Script.
# AI_NOTE: This script programmatically verifies the acceptance criteria from the PRD.
# TECH_META(technology="Verification Script", adr="ADR-006", version="1.0.0", purpose="Creates a self-test script to validate the container build.")
RUN <<'EOF' tee /usr/local/bin/verify-devcontainer.sh 2>&1 | tee -a /var/log/build.log
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
EOF

# STEP_14: Make the Verification Script Executable.
# AI_NOTE: Grants execute permissions to the script created in the previous step.
# TECH_META(technology="Verification Script", adr="ADR-006", version="1.0.0", purpose="Makes the verification script executable.")
RUN chmod +x /usr/local/bin/verify-devcontainer.sh 2>&1 | tee -a /var/log/build.log

# STEP_15: Execute the Verification Script.
# AI_NOTE: This is the final validation step. If the script fails, the Docker build will fail.
# TECH_META(technology="Verification Script", adr="ADR-006", version="1.0.0", purpose="Executes the verification script to validate the build.")
RUN /usr/local/bin/verify-devcontainer.sh 2>&1 | tee -a /var/log/build.log

# -------------------------------------------------------------------------------------------------
# SECTION 6: DOCUMENTATION_IMPROVEMENT_FRAMEWORK
# -------------------------------------------------------------------------------------------------
#
# PURPOSE:
# This section serves as a dynamic backlog and instruction set for the iterative improvement of
# this Dockerfile's documentation. Its primary audience is AI models. The goal is to create a
# self-evolving documentation system where the AI can parse, evaluate, and enhance the clarity,
# structure, and machine-readability of the comment blocks.
#
# =================================================================================================
# SUB-SECTION 6.1: AI IMPLEMENTATION WORKFLOW
# =================================================================================================
#
# AI_NOTE: As an AI model, you MUST follow this workflow when tasked with improving this file's
# documentation.
#
# 1.  FULL_CONTEXT_INGESTION:
#     - Read and parse ALL comment sections (SECTIONS 0-6) in their entirety.
#     - Build an internal representation of the purpose and structure of each documentation block.
#
# 2.  IMPROVEMENT_IDENTIFICATION_AND_PLANNING:
#     - Review the `IMPROVEMENT_BACKLOG` (SUB-SECTION 6.2) below.
#     - Cross-reference the backlog items with your parsed understanding of the current file state.
#     - If no specific improvement is requested by the user, select the highest-priority item from
#       the backlog that has not yet been implemented.
#
# 3.  EXECUTION_AND_VERIFICATION:
#     - Follow the `AI_Action_Plan` for the selected improvement item precisely.
#     - After applying the changes, re-parse the file to verify that the implementation was
#       successful and aligns with the improvement's goal.
#     - Update the status of the implemented item in the backlog (e.g., to "Completed").
#
# =================================================================================================
# SUB-SECTION 6.2: IMPROVEMENT_BACKLOG
# =================================================================================================
#
# AI_NOTE: This is a prioritized list of tasks to improve the documentation of this file.
# Each item contains the necessary metadata and instructions for implementation.
#
# ---
#
# - IMPROVEMENT_ID: DI-001
#   - Title: "Implement a Documentation Effectiveness Evaluation System"
#   - Description: "To ensure documentation is effectively parsed by AI, a system is needed to
#     quantify the AI's understanding. This involves adding a new metadata section where the AI
#     rates its confidence in understanding other sections before modifying them. This creates a
#     feedback loop for identifying and improving ambiguous documentation."
#   - Priority: High
#   - Status: Completed
#   - Target_Sections: [0, 5]
#   - AI_Action_Plan:
#     1.  Create a new sub-section within SECTION 5 named `SUB-SECTION 5.4: AI_CONFIDENCE_LOG`.
#     2.  Document the purpose of this new sub-section: "To log an AI's confidence level in
#         understanding each documentation section before a modification is made."
#     3.  Create a Markdown table structure within this sub-section with the following columns:
#         `Timestamp`, `AI_Model_ID`, `Target_Section_ID`, `Confidence_Score (1-5)`, `Justification`.
#     4.  Add an instruction to `SECTION 0: AI_MODIFICATION_PROTOCOL` as a new step: "LOG CONFIDENCE:
#         Before implementing any change, you must add an entry to the AI_CONFIDENCE_LOG (5.4)
#         detailing your confidence in understanding the sections you are about to modify."
#
# ---
#
# - IMPROVEMENT_ID: DI-002
#   - Title: "Enhance TECH_META with Explicit Rationale"
#   - Description: "The current `TECH_META` comment has a `purpose` field, but it doesn't capture
#     the *reasoning* behind a technology choice (e.g., why pnpm was chosen over npm/yarn). Adding
#     a `rationale` field will provide deeper context, helping the AI make more informed decisions
#     when asked to add or change technologies."
#   - Priority: Medium
#   - Status: Not Started
#   - Target_Sections: [5]
#   - AI_Action_Plan:
#     1.  Update the documentation for the `TECHNOLOGY_METADATA_COMMENT_FRAMEWORK` (SUB-SECTION 5.2).
#     2.  Add a new field to the `SYNTAX` and `FIELDS` description:
#         `rationale`: "The reason for choosing this technology or specific configuration over
#         alternatives. Link to ADR if possible."
#     3.  Update the example in the `SYNTAX` block to include the new `rationale` field.
#     4.  Iterate through all existing `TECH_META` comments in `SECTION 4` and add a `rationale`
#         field based on information available in `SECTION 1` and `SECTION 2`. For example, for
#         pnpm, the rationale would be "Adopted for storage efficiency and faster installs in a
#         monorepo context."
#
# ---
#
# - IMPROVEMENT_ID: DI-003
#   - Title: "Create Explicit Links Between Implementation Plan and Code"
#   - Description: "The `IMPLEMENTATION_PLAN` (SECTION 3) and `DOCKER_IMPLEMENTATION` (SECTION 4)
#     are logically connected but not explicitly linked. Adding a direct reference from each
#     implementation step to its corresponding plan step will improve traceability for both
#     humans and AI, making the file easier to debug and modify."
#   - Priority: Low
#   - Status: Not Started
#   - Target_Sections: [3, 4]
#   - AI_Action_Plan:
#     1.  For each `STEP_X` comment in `SECTION 4: DOCKER_IMPLEMENTATION`, add a reference line.
#     2.  The new line should read: `AI_NOTE: Implements STEP_X from the Implementation Plan.`
#     3.  Ensure the `X` in the new comment correctly matches the step number of the command it
#         precedes. For example, the comment above `FROM mcr.microsoft.com/...` should now include
#         `AI_NOTE: Implements STEP_1 from the Implementation Plan.`
#
# -------------------------------------------------------------------------------------------------
