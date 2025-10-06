---
mode: 'agent'
description: 'Automate the process of loading the NPM_TOKEN from .env, incrementing the npm package version, building, and publishing the npm project. If any build or publish issues occur, paste the errors, explain them, and provide possible solutions. Require user approval before important steps.'
---

Automate the following steps for this npm project, **requiring explicit user approval before each important step** (version increment, build, publish). Use the built-in user approval mechanism for confirmations:

**Before starting:**

1. **Ensure all desired symbols are exported from src/form-checkbox-cards-input.tsx.**
    - First, follow the instructions in `.github/prompts/sync-exports.prompt.md` to synchronize all exports in `src/form-checkbox-cards-input.tsx` with the module files in `src/components`. Only proceed to the next steps if this completes successfully.

**Main workflow:**

2. **Load the NPM_TOKEN from the `.env` file into the terminal environment.**
    - Use a tool like `dotenv-cli` or manually export the variable.
    - Example (Linux/macOS): `export $(grep NPM_TOKEN .env | xargs)`
    - Example (Windows CMD): `for /f "usebackq tokens=*" %i in (.env) do set %i`
    - Example (Windows PowerShell): `$env:NPM_TOKEN="$(Get-Content .env | Select-String NPM_TOKEN | ForEach-Object { $_.ToString().Split('=')[1].Trim() })"`
    - Example (dotenv-cli): `dotenv -e .env -- <your command>`

3. **Increment the npm package version.**
    - Before running `npm version <patch|minor|major>`, prompt the user for approval and confirm the version bump type.
    - Use `npm version <patch|minor|major>` as appropriate.

4. **Commit and push changes.**
    - After updating `src/form-checkbox-cards-input.tsx` and/or bumping the npm version, commit these changes before proceeding.
    - When committing, use the "Generate Commit Message" action if available, unless the agent can generate a more descriptive and context-aware commit message based on the actual changes. If so, prefer the agent-generated message.
    - Push the commit to the repository before proceeding.

5. **Run the build command.**
    - Before executing `npm run build`, prompt the user for approval.
    - Execute `npm run build`.
    - If there are any build issues, paste the error output in the chat.
    - Analyze the errors, explain what they mean, and provide possible solutions based on the project workspace.

6. **Run a dry-run publish.**
    - Before executing `npm publish --dry-run`, prompt the user for approval.
    - Execute `npm publish --dry-run`.
    - If there are any issues, paste the error output, explain, and provide possible solutions.

7. **Publish the package.**
    - Before executing `npm publish`, prompt the user for final approval.
    - Execute `npm publish`.

**Notes:**

- If any step fails, stop and provide a detailed explanation and troubleshooting steps.
- Ensure the NPM_TOKEN is not exposed in logs or output.
- This automation is intended to streamline the build and publish workflow for this npm project while minimizing risk by requiring user approval at each important step.
