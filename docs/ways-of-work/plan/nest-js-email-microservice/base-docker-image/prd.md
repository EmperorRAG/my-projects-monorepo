# Technical Enabler PRD: Base Docker Image

## 1. Enabler Name

Base Docker Image

## 2. Epic

- **Epic PRD:** [../../epic.md](./../epic.md)
- **Epic Architecture:** [../../arch.md](./../arch.md)

## 3. Goal

- **Problem:** To deploy the new email microservice consistently and reliably across different environments, it needs to be packaged into a container. Creating a `Dockerfile` from scratch for a Nest.js application requires knowledge of Node.js best practices, multi-stage builds, and security hardening.
- **Solution:** This enabler involves creating a standardized, multi-stage `Dockerfile` for the `email-service` application. The Dockerfile will be optimized for production, resulting in a small, secure, and efficient image.
- **Impact:** Enables the microservice to be deployed as a standard Docker container, which is fundamental for a cloud-native architecture. It ensures consistency between development and production environments and simplifies the deployment process.

## 4. User Personas

- **Primary User (Human):** DevOps Engineers who will build and push the Docker image as part of the CI/CD pipeline.
- **Secondary User (Programmatic):** The CI/CD system (e.g., GitHub Actions, Jenkins) that will execute the `docker build` command.

## 5. User Stories

- As a DevOps Engineer, I want a standardized `Dockerfile` for the email service so that I can build a production-ready container image.
- As a Platform Developer, I want the `Dockerfile` to be easy to use so that I can build and run the service locally for testing.
- As a DevOps Engineer, I want the final Docker image to be as small as possible to reduce storage costs and deployment times.
- As a Security Engineer, I want the Docker image to be secure, running with a non-root user and containing only the necessary production dependencies.

## 6. Requirements

### Functional Requirements

- A `Dockerfile` MUST be created in the root of the `email-service` application directory.
- The `Dockerfile` MUST use a multi-stage build approach.
- The `builder` stage MUST install all dependencies (including `devDependencies`) and build the Nest.js application.
- The final `production` stage MUST copy the build artifacts from the `builder` stage.
- The final stage MUST install *only* production dependencies (`npm ci --omit=dev`).
- The final image MUST use a minimal base image (e.g., `node:18-alpine`).
- The container MUST run as a non-root user.
- The `CMD` instruction MUST be set to start the Nest.js application.

### Non-Functional Requirements

- **Image Size:** The final image should be optimized for size.
- **Security:** The image should not contain unnecessary tools or libraries. It should follow security best practices for building Node.js images.
- **Build Time:** The Docker build should leverage caching effectively to minimize build times for subsequent builds.

## 7. Acceptance Criteria

### Scenario 1: Building the Docker Image

- **Given** a developer is in the root of the monorepo.
- **When** they run the `docker build` command pointing to the `email-service`'s `Dockerfile`.
- **Then** the build process must complete successfully.
- **And** a new Docker image for the `email-service` is created.

### Scenario 2: Running the Container

- **Given** the Docker image has been built successfully.
- **When** a container is started from the image, with the necessary environment variables for SMTP credentials passed in.
- **Then** the Nest.js application should start up correctly inside the container.
- **And** the application should be able to accept requests on the exposed port.

### Scenario 3: Security and Size Checks

- **Given** the final Docker image.
- **When** the image is inspected.
- **Then** it must be based on the specified Alpine image.
- **And** the `USER` instruction in the Dockerfile must be set to a non-root user.
- **And** the image size should be reasonably small (e.g., under 200MB).

## 8. Out of Scope

- **Container Orchestration:** The deployment of the container to a platform like Kubernetes or ECS is out of scope.
- **Pushing to a Registry:** The process of tagging and pushing the image to a container registry (e.g., Docker Hub, ECR) is part of the CI/CD pipeline and is out of scope for this enabler.
