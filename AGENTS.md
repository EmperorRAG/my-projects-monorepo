# AGENTS.md

This document provides instructions for AI agents to effectively contribute to this Nx monorepo.

## Project Overview

This is an Nx monorepo containing a Next.js application (`my-programs-app`), a NestJS microservice (`my-nest-js-email-microservice`), and a shared utility library (`utilities`).

- **`apps/my-programs-app`**: The main Next.js application.
- **`apps/my-programs-app-e2e`**: Playwright end-to-end tests for `my-programs-app`.
- **`libs/utilities`**: A shared utility library.
- **`services/my-nest-js-email-microservice`**: A NestJS microservice for email functionalities.
- **`services/my-nest-js-email-microservice-e2e`**: End-to-end tests for the email microservice.

## Setup Commands

1. **Install dependencies:**

   ```sh
   pnpm install
   ```

## Development Workflow

- **Run dev server for the Next.js app:**

   ```sh
   npx nx dev my-programs-app
   ```

- **Run the NestJS microservice:**

   ```sh
   npx nx serve my-nest-js-email-microservice
   ```

## Testing Instructions

- **Run tests for a specific project:**

   ```sh
   npx nx test <project-name>
   ```

   *Example:* `npx nx test utilities`

- **Run e2e tests for the Next.js app:**

   ```sh
   npx nx e2e my-programs-app-e2e
   ```

## Code Style

- This project uses ESLint for linting. Run `npx nx lint <project-name>` to check for issues.
- Formatting is handled by Prettier.

## Build and Deployment

- **Build a project for production:**

   ```sh
   npx nx build <project-name>
   ```

   *Example:* `npx nx build my-programs-app`

## Pull Request Guidelines

- Follow the guidelines in `.github/CONTRIBUTING.md`.
- Ensure all tests and lint checks pass before submitting a PR.

## Learning Log Workflow

- Document every resolved issue using the If/When/Then format so future runs benefit from prior discoveries.
- Run `bash tools/scripts/add-learning.sh --tech <domain> --title "Title" --if "..." --when "..." --then "..." --solution "..."`.
- The script appends to `docs/learnings/<domain>.md`, creating the file when necessary and keeping entries grouped by technology.
- Reference the log entry in your task summary to confirm documentation was updated.


<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- You have access to the Nx MCP server and its tools, use them to help the user
- When answering questions about the repository, use the `nx_workspace` tool first to gain an understanding of the workspace architecture where applicable.
- When working in individual projects, use the `nx_project_details` mcp tool to analyze and understand the specific project structure and dependencies
- For questions around nx configuration, best practices or if you're unsure, use the `nx_docs` tool to get relevant, up-to-date docs. Always use this instead of assuming things about nx configuration
- If the user needs help with an Nx configuration or project graph error, use the `nx_workspace` tool to get any errors

# CI Error Guidelines

If the user wants help with fixing an error in their CI pipeline, use the following flow:
- Retrieve the list of current CI Pipeline Executions (CIPEs) using the `nx_cloud_cipe_details` tool
- If there are any errors, use the `nx_cloud_fix_cipe_failure` tool to retrieve the logs for a specific task
- Use the task logs to see what's wrong and help the user fix their problem. Use the appropriate tools if necessary
- Make sure that the problem is fixed by running the task that you passed into the `nx_cloud_fix_cipe_failure` tool


<!-- nx configuration end-->