# Instruction Set: Base Docker Image for Email Service

## 1. Objective

This document provides a step-by-step guide to creating a production-ready, multi-stage `Dockerfile` for the `email-service` application, as specified in the PRD and implementation plan.

## 2. Prerequisites

- Docker Desktop is installed and running.
- You are at the root of the `my-projects-monorepo` workspace.

---

## 3. Step-by-Step Instructions

### Step 1: Create the `Dockerfile`

Create a new file named `Dockerfile` at the following location: `apps/my-programs-app/Dockerfile`.

Populate the file with the following content. This Dockerfile is optimized for an Nx monorepo and creates a small, secure production image.

```dockerfile
# ---- Base Stage ----
# Use a specific Node.js version for consistency.
FROM node:18-alpine AS base
WORKDIR /usr/src/app

# Install pnpm
RUN npm install -g pnpm

# ---- Builder Stage ----
# This stage builds the application.
FROM base AS builder

# Copy dependency-related files first to leverage Docker layer caching.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# Install all dependencies, including devDependencies, required for the build.
RUN pnpm install --frozen-lockfile

# Copy the rest of the monorepo source code.
COPY . .

# Build the specific 'email-service' application.
# This command will be defined in the project's package.json scripts.
RUN pnpm exec nx build my-programs-app

# ---- Production Stage ----
# This stage creates the final, lightweight image.
FROM base AS production

# Create a dedicated, non-root user and group for security.
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy only the necessary production build artifacts from the builder stage.
# The path 'dist/apps/my-programs-app' is the standard output for an Nx build.
COPY --from=builder /usr/src/app/dist/apps/my-programs-app .
# Copy production node_modules.
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json .

# Switch to the non-root user.
USER appuser

# Expose the port the application will run on.
EXPOSE 3000

# The command to start the application.
CMD ["node", "main.js"]
```

### Step 2: Add Build Script to `package.json`

To enable the `docker build` command to work, you need a build script in the `email-service`'s `package.json` file.

**File to Edit:** `apps/my-programs-app/package.json`

Add the following script to the `scripts` section:

```json
{
  "name": "my-programs-app",
  "version": "0.0.1",
  "scripts": {
    "build": "nx build my-programs-app"
  },
  // ... other properties
}
```

*(Note: If the `scripts` section or the file does not exist, create it accordingly.)*

### Step 3: Build the Docker Image

Execute the following command from the **root of the monorepo** to build the Docker image.

```sh
docker build -t email-service:latest -f apps/my-programs-app/Dockerfile .
```

- **`docker build`**: The command to build an image.
- **`-t email-service:latest`**: Tags the image with the name `email-service` and tag `latest`.
- **`-f apps/my-programs-app/Dockerfile`**: Specifies the path to the `Dockerfile`.
- **`.`**: Sets the build context to the current directory (the monorepo root).

### Step 4: Run the Container

Once the image is built successfully, run it as a container with this command:

```sh
docker run -d -p 3000:3000 --name email-service-container -e SMTP_HOST="your_smtp_host" -e SMTP_USER="your_user" -e SMTP_PASS="your_password" email-service:latest
```

- **`-d`**: Runs the container in detached mode (in the background).
- **`-p 3000:3000`**: Maps port 3000 on your local machine to port 3000 inside the container.
- **`--name email-service-container`**: Assigns a name to the running container.
- **`-e "KEY=VALUE"`**: Sets environment variables required by the application (e.g., SMTP credentials). **Replace the placeholder values.**
- **`email-service:latest`**: The image to run.

## 4. Verification

### Verify Container is Running

Check that the container has started successfully:

```sh
docker ps
```

You should see `email-service-container` in the list of running containers.

### Verify Application Logs

Check the logs to ensure the Nest.js application started without errors:

```sh
docker logs email-service-container
```

### Verify Security (Non-Root User)

Exec into the running container and check the current user:

```sh
docker exec -it email-service-container whoami
```

The command should output `appuser`, confirming the application is not running as root.
