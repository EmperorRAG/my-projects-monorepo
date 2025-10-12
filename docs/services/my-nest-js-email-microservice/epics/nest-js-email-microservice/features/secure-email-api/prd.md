# Feature PRD: Secure Email API

## 1. Feature Name

Secure Email API

## 2. Epic

- **Epic PRD:** [../../epic.md](./../epic.md)
- **Epic Architecture:** [../../arch.md](./../arch.md)

## 3. Goal

- **Problem:** Internal services and AI agents need a single, reliable, and secure endpoint to send transactional emails without having to manage SMTP logic or credentials themselves.
- **Solution:** This feature provides a dedicated RESTful API endpoint (`POST /email/send`) within the Nest.js Email Microservice. It will serve as the primary, secure gateway for all email-sending requests.
- **Impact:** Centralizes email-sending functionality, improves security by abstracting credentials, and reduces redundant code across the platform.

## 4. User Personas

- **Primary User (Programmatic):** AI Agents / Backend Services that need to programmatically send emails.
- **Secondary User (Human):** Platform Developers who will integrate their services with this API.

## 5. User Stories

- As a Backend Service, I want to send a POST request to a single endpoint so that I can trigger a transactional email without implementing SMTP logic.
- As a Platform Developer, I want to receive a clear and immediate response from the API so that I know if my email request was successfully accepted for processing.
- As a Backend Service, I want the API to be protected so that only authorized services within the platform can send emails.

## 6. Requirements

### Functional Requirements

- The system MUST expose a `POST` endpoint at the path `/email/send`.
- The endpoint MUST accept a JSON object with the following properties: `to` (string), `subject` (string), and `body` (string, containing HTML).
- The endpoint MUST be protected and only accessible by authenticated internal services (via `better-auth`).
- Upon receiving a valid request, the API MUST return a `202 Accepted` HTTP status code to indicate the request has been queued.
- If the request is invalid (e.g., missing fields, bad data types), the API MUST return a `400 Bad Request` status code with a descriptive error message.
- If the request is from an unauthorized service, the API MUST return a `401 Unauthorized` or `403 Forbidden` status code.

### Non-Functional Requirements

- **Performance:** The API endpoint must have an average response time of less than 200ms.
- **Security:** All communication with the endpoint must be over HTTPS. The endpoint must be protected against common vulnerabilities (e.g., CSRF, if applicable in a service-to-service context).
- **Reliability:** The endpoint must have an uptime of > 99.9%.

## 7. Acceptance Criteria

### Scenario 1: Successful Email Request

- **Given** an authorized backend service
- **When** it sends a `POST` request to `/email/send` with a valid JSON payload (`to`, `subject`, `body`)
- **Then** the API should respond with a `202 Accepted` status code.
- **And** the email sending job should be added to an asynchronous processing queue.

### Scenario 2: Invalid Email Request

- **Given** an authorized backend service
- **When** it sends a `POST` request to `/email/send` with a missing `subject` field
- **Then** the API should respond with a `400 Bad Request` status code.
- **And** the response body should contain a message indicating that the `subject` field is required.

### Scenario 3: Unauthorized Email Request

- **Given** an external, unauthorized client
- **When** it sends a `POST` request to `/email/send`
- **Then** the API should respond with a `401 Unauthorized` or `403 Forbidden` status code.

## 8. Out of Scope

- The actual sending of the email (this is handled by the `EmailService` and Nodemailer integration).
- Rate limiting on the API endpoint.
- API versioning.
