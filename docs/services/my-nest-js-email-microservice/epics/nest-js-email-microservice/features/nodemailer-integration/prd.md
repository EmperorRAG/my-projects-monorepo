# Technical Enabler PRD: Nodemailer Integration

## 1. Enabler Name

Nodemailer Integration

## 2. Epic

- **Epic PRD:** [../../epic.md](./../epic.md)
- **Epic Architecture:** [../../arch.md](./../arch.md)

## 3. Goal

- **Problem:** The email microservice needs a robust, well-supported library to handle the complexities of sending emails over SMTP. Building this functionality from scratch would be time-consuming, error-prone, and difficult to maintain.
- **Solution:** This enabler focuses on integrating the `Nodemailer` library into the `EmailService`. A dedicated module, `SmtpModule`, will be created to encapsulate the Nodemailer transport and configuration, providing a clean interface for the rest of the application to send emails.
- **Impact:** Leverages a mature, industry-standard library for sending emails, which greatly simplifies the implementation of the core email-sending logic. It ensures reliable email delivery and provides features like connection pooling, authentication, and TLS/SSL support out of the box.

## 4. User Personas

- **Primary User (Human):** Platform Developers who will use the `SmtpModule` to send emails from the `EmailService`.
- **Secondary User (Programmatic):** The `EmailService` itself, which is the direct consumer of the `SmtpModule`.

## 5. User Stories

- As a Platform Developer, I want to use a simple, high-level service to send an email so that I don't have to deal with the low-level details of the SMTP protocol.
- As a Platform Developer, I want the SMTP connection to be managed efficiently so that the service can handle a high volume of email requests without performance degradation.
- As a Platform Developer, I want the SMTP credentials to be loaded securely from the environment so that they are not hard-coded in the application.

## 6. Requirements

### Functional Requirements

- The `Nodemailer` package MUST be added as a dependency to the `email-service` application.
- A new `SmtpModule` MUST be created to manage the Nodemailer transport.
- The `SmtpModule` MUST expose a service (`SmtpService`) with a method like `sendEmail(mailOptions: Mail.Options)`.
- The Nodemailer transport MUST be configured using credentials (host, port, user, password) loaded from environment variables.
- The `EmailService` MUST use the `SmtpService` to send emails.

### Non-Functional Requirements

- **Reliability:** The integration should handle SMTP connection errors gracefully and allow for retries where appropriate (though retry logic may be part of the `EmailService` itself).
- **Security:** The integration must not expose sensitive credentials in logs or error messages.
- **Testability:** The `SmtpService` should be designed in a way that it can be easily mocked in unit tests for the `EmailService`.

## 7. Acceptance Criteria

### Scenario 1: Module Initialization

- **Given** the `my-nest-js-email-microservice` application is starting up.
- **When** the `SmtpModule` is initialized.
- **Then** it must successfully create a Nodemailer transport instance configured with credentials from the environment.
- **And** the application should fail to start if the required SMTP environment variables are not set.

### Scenario 2: Sending an Email

- **Given** the `EmailService` has a valid email request.
- **When** it calls the `sendEmail` method on the `SmtpService` with valid mail options.
- **Then** the `SmtpService` should use the Nodemailer transport to send the email.
- **And** it should return the `messageId` from the successful response provided by the SMTP server.

### Scenario 3: Mocking for Tests

- **Given** a unit test for the `EmailService`.
- **When** the `EmailService` attempts to send an email.
- **Then** the test should be able to provide a mock implementation of the `SmtpService` to simulate both successful and failed email sends without making a real network call.

## 8. Out of Scope

- **Email Templating:** The generation of email content (e.g., from HTML templates) is out of scope. This enabler is only concerned with the transport of the email.
- **Complex Retry Logic:** Advanced retry strategies (e.g., exponential backoff) are not part of this enabler but may be built on top of it in the `EmailService`.
- **Management of Multiple Transports:** This enabler will only focus on a single, primary SMTP transport.
