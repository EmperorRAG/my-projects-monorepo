# Instruction Set: New Nx Application for Email Service

## 1. Objective

This document provides a step-by-step guide to generating a new, dedicated Nest.js application named `email-service` within the Nx monorepo. This process follows the specifications laid out in the PRD and implementation plan.

## 2. Prerequisites

- You have `pnpm` installed and are at the root of the `my-projects-monorepo` workspace.
- The Nx CLI is available in the project.

---

## 3. Step-by-Step Instructions

### Step 1: Generate the Nest.js Application

Execute the following command from the **root of the monorepo**. This command uses the `@nx/nest` generator to scaffold a new Nest.js application.

```sh
nx g @nx/nest:app services/my-nest-js-email-microservice
```

When prompted by the generator, you may be asked for additional configuration options. For the purpose of this initial setup, you can accept the defaults.

- **What to Expect:** This command will:
  1. Create a new directory: `services/my-nest-js-email-microservice`.
  2. Populate it with a standard Nest.js project structure, including `src/main.ts`, `src/app/app.module.ts`, and test files.
  3. Create a project configuration file (`services/my-nest-js-email-microservice/project.json` or similar).
  4. Update the Nx project graph to include the new application.

### Step 2: Verify the Application Structure

After the command completes, verify that the new application has been created correctly. Check for the existence of the following directory:

- `services/my-nest-js-email-microservice`

You can list the contents to ensure the boilerplate files are present.

### Step 3: Run the Development Server

To confirm that the application is runnable, start the development server using the Nx `serve` command.

```sh
nx serve my-nest-js-email-microservice
```

- **What to Expect:** The server will start, and you will see output indicating that the Nest.js application is listening on a specific port (usually `3000` by default).

### Step 4: Test the Default Endpoint

With the server running, use a tool like `curl` or a web browser to make a `GET` request to the default endpoint.

```sh
curl http://localhost:3000/
```

- **Expected Response:** You should receive the default welcome message from the Nest.js boilerplate, which is typically a string like `"Hello World!"`.

## 4. Verification

### Run Unit Tests

Execute the unit tests for the new application to ensure they pass.

```sh
nx test my-nest-js-email-microservice
```

- **Expected Outcome:** The test suite should run and report that all default tests have passed successfully.

### Build the Application

Perform a production build to ensure the build process is correctly configured.

```sh
nx build my-nest-js-email-microservice
```

- **Expected Outcome:** The build should complete without errors, creating a `dist/services/my-nest-js-email-microservice` directory containing the compiled JavaScript code.
