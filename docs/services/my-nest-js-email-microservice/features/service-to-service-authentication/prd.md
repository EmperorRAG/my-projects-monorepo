# Technical Enabler PRD: Service-to-Service Authentication

## 1. Enabler Name

Service-to-Service Authentication

## 2. Epic

- **Epic PRD:** [../../epic.md](./../epic.md)
- **Epic Architecture:** [../../arch.md](./../arch.md)

## 3. Goal

- **Problem:** The email microservice API needs to be protected from unauthorized access. Any internal service that calls the email API must be authenticated to ensure it has the proper permissions.
- **Solution:** This enabler will implement a service-to-service (S2S) authentication mechanism using the in-house `better-auth` library. A Nest.js guard will be created to protect the API endpoints, requiring all incoming requests to have a valid, machine-generated JWT.
- **Impact:** Secures the email microservice by ensuring that only trusted internal services can request emails to be sent. This prevents potential abuse and provides a clear audit trail of which services are using the API.

## 4. User Personas

- **Primary User (Programmatic):** Internal microservices that need to send emails and will be calling this service's API.
- **Secondary User (Human):** Platform Developers who will need to configure their services to acquire and use the S2S JWTs.

## 5. User Stories

- As an internal service, I want to authenticate with the email service using a JWT so that I can prove my identity and be granted access to the API.
- As the email service, I want to reject any API request that does not have a valid S2S JWT so that I am protected from unauthorized access.
- As a Platform Developer, I want a clear and simple way to integrate with the S2S authentication so that I can easily use the email service from my own service.

## 6. Requirements

### Functional Requirements

- The `@my-org/better-auth` library MUST be added as a dependency to the `email-service` application.
- A Nest.js guard (e.g., `S2SAuthGuard`) MUST be implemented using the `better-auth` library.
- The `S2SAuthGuard` MUST be applied to all endpoints in the `EmailController`.
- The guard MUST validate the incoming JWT for signature, expiration, and issuer.
- If the JWT is invalid, the API MUST respond with a `401 Unauthorized` status code.
- If the JWT is valid, the request MUST be allowed to proceed to the controller.

### Non-Functional Requirements

- **Performance:** The authentication check should add minimal latency to API requests. The `better-auth` library should handle caching of public keys to ensure fast validation.
- **Security:** The implementation must be robust against common JWT vulnerabilities.
- **Standardization:** The authentication mechanism must adhere to the organization's standards for S2S communication.

## 7. Acceptance Criteria

### Scenario 1: Valid Token

- **Given** a client service has a valid S2S JWT.
- **When** the client makes a POST request to the `/send` endpoint with the JWT in the `Authorization` header.
- **Then** the `S2SAuthGuard` should validate the token successfully.
- **And** the request should be processed by the `EmailController`.
- **And** the API should respond with a `202 Accepted` status code.

### Scenario 2: Invalid or Missing Token

- **Given** a client makes a request without a JWT, or with an expired/malformed token.
- **When** the client makes a POST request to the `/send` endpoint.
- **Then** the `S2SAuthGuard` should reject the request.
- **And** the API should respond with a `401 Unauthorized` status code and a descriptive error message.

### Scenario 3: Token from Untrusted Issuer

- **Given** a client presents a JWT that is correctly signed but from an untrusted issuer.
- **When** the client makes a POST request to the `/send` endpoint.
- **Then** the `S2SAuthGuard` should fail the validation check.
- **And** the API should respond with a `401 Unauthorized` status code.

## 8. Out of Scope

- **User-level Authentication (OAuth/OIDC):** This enabler is strictly for machine-to-machine authentication. Human user authentication is not in scope.
- **Authorization/Permissions:** This enabler is only concerned with *authentication* (who the caller is). *Authorization* (what the caller is allowed to do) is out of scope for this feature.
- **Token Issuance:** The infrastructure and process for issuing S2S JWTs to client services is a separate concern and is out of scope.
