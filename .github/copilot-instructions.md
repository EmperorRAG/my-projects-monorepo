# GitHub Copilot Instructions

This document provides guidance for AI coding agents to effectively contribute to this Nx monorepo.

## Workspace Overview

This is an Nx monorepo containing a Next.js application (`my-programs-app`) and a utility library (`utilities`).

-   `apps/my-programs-app`: The main Next.js application.
-   `libs/utilities`: A shared utility library.
-   `apps/my-programs-app-e2e`: Playwright end-to-end tests for `my-programs-app`.

## Developer Workflow

### Running Tasks

Always use `nx` to run tasks. This ensures that dependencies are handled correctly and caching is utilized.

-   **Run dev server for the app:**

    ```sh
    npx nx dev my-programs-app
    ```

-   **Build the app for production:**

    ```sh
    npx nx build my-programs-app
    ```

-   **Run tests for the app:**

    ```sh
    npx nx test my-programs-app
    ```

-   **Run tests for the utilities library:**

    ```sh
    npx nx test utilities
    ```

-   **Run e2e tests:**
    ```sh
    npx nx e2e my-programs-app-e2e
    ```

### Generating Code

Use Nx generators to scaffold new code.

-   **Generate a new Next.js app:**

    ```sh
    npx nx g @nx/next:app <app-name>
    ```

-   **Generate a new React library:**
    ```sh
    npx nx g @nx/react:lib <lib-name>
    ```

## Project-Specific Conventions

-   **State Management**: The application does not appear to have a centralized state management library like Redux or Zustand. Assume component-level state using React hooks unless specified otherwise.
-   **Styling**: The application uses Tailwind CSS. You can find the configuration in `apps/my-programs-app/tailwind.config.js`.
-   **Testing**: Jest is used for unit tests and Playwright for end-to-end tests. Test files are located alongside the source files with a `.spec.ts` or `.spec.tsx` extension.

## Key Files

-   `nx.json`: The main Nx workspace configuration file.
-   `apps/my-programs-app/project.json`: Project-specific configuration for the Next.js app (Note: this project uses `package.json` for configuration).
-   `libs/utilities/project.json`: Project-specific configuration for the utility library (Note: this project uses `package.json` for configuration).
-   `AGENTS.md`: Contains general guidelines for AI agents. Please review this file.
