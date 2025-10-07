# Feature PRD: Status Logging

## 1. Feature Name

Status Logging

## 2. Epic

- **Epic PRD:** [../../epic.md](./../epic.md)
- **Epic Architecture:** [../../arch.md](./../arch.md)

## 3. Goal

- **Problem:** To ensure observability and traceability, the outcome of every email-sending attempt must be recorded. Without proper logging, it is impossible to debug failures, monitor the service's health, or understand how it is being used.
- **Solution:** This feature will implement structured logging within the `EmailService`. It will log the status (success or failure) of each asynchronous email-sending job to a centralized logging service.
- **Impact:** Provides crucial visibility into the service's operations, enabling effective monitoring, alerting, and troubleshooting. It is a critical component for maintaining a production-ready, reliable service.

## 4. User Personas

- **Primary User (Human):** Platform Developers / DevOps Engineers who are responsible for monitoring the health of the system and debugging issues.
- **Secondary User (Programmatic):** Alerting systems that may consume structured logs to trigger alerts based on error rates.

## 5. User Stories

- As a DevOps Engineer, I want to view structured logs for every email attempt so that I can monitor the success and failure rates of the service.
- As a Platform Developer, I want to be able to trace a specific email request through the logs so that I can debug why a particular email failed to send.
- As a DevOps Engineer, I want logs to include a correlation ID so that I can trace a single request across multiple services.

## 6. Requirements

### Functional Requirements

- The `EmailService` MUST log the outcome of every email-sending attempt.
- Logs MUST be in a structured format (e.g., JSON).
- A successful email log MUST include a status of `SUCCESS`, a timestamp, and the `messageId` returned by the SMTP provider.
- A failed email log MUST include a status of `FAILURE`, a timestamp, and a detailed error message.
- All logs related to a single request should contain a unique correlation ID to allow for distributed tracing.
- The service should integrate with the platform's centralized logging service.

### Non-Functional Requirements

- **Performance:** Logging should be a non-blocking operation and have a negligible impact on the performance of the email-sending process.
- **Consistency:** Log formats must be consistent and well-documented to allow for easy parsing and querying.

## 7. Acceptance Criteria

### Scenario 1: Successful Email Send

- **Given** the `EmailService` is processing an email request.
- **When** the email is successfully sent via the SMTP provider.
- **Then** a log entry with `status: "SUCCESS"` must be written to the logging service.
- **And** the log entry must contain the `messageId` from the provider.

### Scenario 2: Failed Email Send

- **Given** the `EmailService` is processing an email request.
- **When** the SMTP provider returns an error (e.g., invalid credentials, recipient address blocked).
- **Then** a log entry with `status: "FAILURE"` must be written to the logging service.
- **And** the log entry must contain the specific error message returned by the provider.

### Scenario 3: Log Correlation

- **Given** a request is received by the `EmailController`.
- **When** the request is passed to the `EmailService` and processed.
- **Then** all log entries generated for that request, both in the controller and the service, must share the same unique correlation ID.

## 8. Out of Scope

- **Log-based Alerting:** The configuration of alerts based on these logs is out of scope for this feature.
- **Log Dashboards:** The creation of dashboards to visualize log data is out of scope.
- **Log Retention Policies:** Defining how long logs are stored is a platform-level concern and is out of scope.
