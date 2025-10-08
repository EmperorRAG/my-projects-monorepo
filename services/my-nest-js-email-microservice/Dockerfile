# ---- Base Stage ----
# Use a specific Node.js version for consistency.
FROM node:22-alpine AS base
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
RUN npx nx build my-nest-js-email-microservice

# ---- Production Stage ----
# This stage creates the final, lightweight image.
FROM node:20-slim AS production

# Set working directory
WORKDIR /usr/src/app

# Install pnpm
RUN npm install -g pnpm

# Copy build artifacts from the builder stage
COPY --from=builder /usr/src/app/services/my-nest-js-email-microservice/dist .

# Install production dependencies
RUN pnpm install --prod

# Expose the port the app runs on.
EXPOSE 3000

# The command to start the application.
CMD ["node", "main.js"]
