# Epic Architecture Specification: Nest.js Email Microservice

## 1. Epic Architecture Overview

The technical approach for this epic is to implement a decoupled, single-responsibility microservice using a domain-driven architecture pattern. The core of the epic is a stateless Nest.js application, containerized with Docker, which exposes a secure RESTful API for sending transactional emails. This service will be an internal component within the broader platform, consumed by other backend services and AI agents.

Authentication between services will be handled by `better-auth`, ensuring that only trusted internal clients can access the email-sending functionality. The architecture is designed for scalability and reliability, with the service being stateless to allow for horizontal scaling and asynchronous processing to handle email sending without blocking the calling service.

## 2. System Architecture Diagram

```mermaid
graph TD
    subgraph User Layer "Internal Consumers"
        direction LR
        consumer1[AI Agents]
        consumer2[Backend Services]
    end

    subgraph Application Layer
        direction TB
        auth[better-auth Service]
        api_gw[Internal API Gateway]
    end

    subgraph Service Layer
        direction TB
        subgraph email_service [Nest.js Email Microservice]
            direction LR
            controller[EmailController<br>(REST API: /email/send)]
            service[EmailService<br>(with Nodemailer)]
            dto[Validation DTOs]
        end
    end

    subgraph Data Layer
        direction TB
        smtp_provider[External SMTP Provider<br>(e.g., SendGrid, AWS SES)]
        logging_service[Centralized Logging Service]
    end

    subgraph Infrastructure Layer
        direction TB
        docker_email[Docker Container]
        docker_registry[Container Registry]
    end

    %% Data Flow
    consumer1 -- 1. Request to send email --> api_gw
    consumer2 -- 1. Request to send email --> api_gw

    api_gw -- 2. Authenticate Request --> auth
    auth -- 3. Return Auth Token/Status --> api_gw

    api_gw -- "4. Forward Validated Request" --> controller

    controller -- 5. Validate Payload --> dto
    controller -- 6. Invoke Service --> service
    service -- 7. Send Email Asynchronously --> smtp_provider
    service -- 8. Log Status --> logging_service

    %% Infrastructure Flow
    email_service -- Contained In --> docker_email
    docker_email -- Built From Image In --> docker_registry

    %% Styling
    style email_service fill:#f9f,stroke:#333,stroke-width:2px
    style auth fill:#ccf,stroke:#333,stroke-width:2px
    style smtp_provider fill:#f0ad4e,stroke:#333,stroke-width:2px
    style logging_service fill:#f0ad4e,stroke:#333,stroke-width:2px
```

## 3. High-Level Features & Technical Enablers

### High-Level Features

- **Secure Email API**: A single, secure `POST /email/send` endpoint for sending transactional emails.
- **Request Validation**: Strict validation of all incoming API requests using DTOs.
- **Asynchronous Email Sending**: The API will accept requests and queue them for sending without blocking the client, ensuring high performance.
- **Status Logging**: The service will log the outcome (success or failure) of every email send attempt to a centralized logging service for observability.

### Technical Enablers

- **New Nx Application**: A new Nest.js application (`mcp-email-server`) will be generated within the Nx monorepo.
- **Nodemailer Integration**: An email service module will be created to abstract the Nodemailer library for communicating with an SMTP provider.
- **Secure Credential Management**: A system for securely injecting SMTP credentials into the service via environment variables at runtime.
- **Service-to-Service Authentication**: Integration with `better-auth` to secure the API endpoint and ensure only authorized internal services can use it.
- **Base Docker Image**: A standardized, multi-stage Dockerfile for building a lightweight and secure production image for the Nest.js service.

## 4. Technology Stack

- **Backend Framework**: Nest.js
- **Language**: TypeScript
- **Monorepo Tooling**: Nx
- **Authentication**: `better-auth` (for service-to-service security)
- **Email Library**: Nodemailer
- **Containerization**: Docker

## 5. Technical Value

- **Value**: High
- **Justification**: This architecture establishes a reusable, scalable, and secure pattern for a critical piece of platform infrastructure. It reduces technical debt by eliminating redundant email-sending logic across multiple services and improves the overall security posture by centralizing credential management. It provides high technical value by creating a foundational service that other epics can build upon.

## 6. T-Shirt Size Estimate

- **Estimate**: M (Medium)
- **Justification**: The work involves creating a new service from scratch, setting up authentication, integrating with an external provider, and establishing testing patterns. While the core logic is straightforward, the effort to make it production-ready (secure, testable, and observable) places it in the Medium complexity range.
