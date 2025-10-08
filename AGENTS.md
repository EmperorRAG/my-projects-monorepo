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
