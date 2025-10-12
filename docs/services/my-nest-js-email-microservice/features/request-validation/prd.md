# Feature PRD: Request Validation

## 1. Feature Name

Request Validation

## 2. Epic

- **Epic PRD:** [../../epic.md](./../epic.md)
- **Epic Architecture:** [../../arch.md](./../arch.md)

## 3. Goal

- **Problem:** To maintain the integrity and security of the Email Microservice, all incoming data must be strictly validated. Unvalidated input can lead to application errors, security vulnerabilities, and unpredictable behavior.
- **Solution:** This feature will implement robust request validation using Data Transfer Objects (DTOs) in Nest.js, powered by the `class-validator` library. This ensures that every request to the `/email/send` endpoint conforms to a strict data contract.
- **Impact:** Improves the API's security and reliability, prevents malformed data from entering the system, and provides clear, immediate feedback to developers, which speeds up integration and debugging.

## 4. User Personas

- **Primary User (Programmatic):** AI Agents / Backend Services making requests to the API.
- **Secondary User (Human):** Platform Developers integrating their services with the API.

## 5. User Stories

- As a Platform Developer, I want the API to validate the data type and format of each field in my request so that I can be confident I am sending correct data.
- As a Platform Developer, I want to receive a specific, structured error message that tells me exactly which field is invalid and why, so that I can quickly debug and fix my request.
- As a Backend Service, I want the API to reject requests that contain extra, undefined fields so that I know my service is strictly adhering to the API contract.

## 6. Requirements

### Functional Requirements

- The system MUST define a `SendEmailDto` class for the `/email/send` endpoint.
- The `SendEmailDto` MUST use `class-validator` decorators to enforce validation rules.
- The `to` property MUST be validated as a non-empty string in a valid email format.
- The `subject` property MUST be validated as a non-empty string.
- The `body` property MUST be validated as a non-empty string.
- The validation pipeline MUST be configured to strip any properties not explicitly defined in the `SendEmailDto` (forbid non-whitelisted properties).
- If validation fails, the API MUST automatically return a `400 Bad Request` response.
- The `400` response body MUST contain a structured JSON object detailing the validation errors, including the invalid property and the reason for failure.

### Non-Functional Requirements

- **Performance:** The validation process should add no more than 50ms to the overall request latency.
- **Maintainability:** Validation rules should be co-located with the DTOs for easy maintenance.

## 7. Acceptance Criteria

### Scenario 1: Valid Request

- **Given** a `POST` request to `/email/send`
- **When** the request body contains a valid `to` (email string), `subject` (string), and `body` (string)
- **Then** the request should pass validation and be forwarded to the `EmailService`.

### Scenario 2: Invalid Email Address Format

- **Given** a `POST` request to `/email/send`
- **When** the `to` field in the request body is not a valid email format (e.g., "not-an-email")
- **Then** the API should respond with a `400 Bad Request` status code.
- **And** the response body should contain an error message like `["to must be an email"]`.

### Scenario 3: Missing Required Field

- **Given** a `POST` request to `/email/send`
- **When** the request body is missing the `subject` field
- **Then** the API should respond with a `400 Bad Request` status code.
- **And** the response body should contain an error message like `["subject should not be empty"]`.

### Scenario 4: Request with Extraneous Property

- **Given** a `POST` request to `/email/send`
- **When** the request body includes an extra property not defined in the DTO, such as `"cc": "someone@example.com"`
- **Then** the API should respond with a `400 Bad Request` status code.
- **And** the response body should contain an error message indicating the extraneous property is not allowed.

## 8. Out of Scope

- Input sanitization (e.g., stripping HTML tags or preventing XSS). This feature is strictly for validation of format and presence.
- Complex business logic validation (e.g., checking if the email address exists in a user database).
