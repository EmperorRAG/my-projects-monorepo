# Epic PRD: Nest.js Email Microservice

## 1. Epic Name

Nest.js Email Microservice

## 2. Goal

- **Problem:** AI agents and other backend services within the platform require a standardized, secure, and reliable method to send transactional emails. Currently, there is no centralized service, leading to duplicated effort, inconsistent implementation, and insecure management of SMTP credentials across different parts of the system.
- **Solution:** This epic will deliver a standalone microservice built with Nest.js. It will provide a single, secure RESTful API endpoint for sending emails, abstracting away the complexities of SMTP provider integration. This creates a single source of truth for email functionality.
- **Impact:** The expected outcome is a significant improvement in developer productivity by providing a simple, reusable service. It will also enhance security by centralizing credentials and create a scalable foundation for all future email-related features.

## 3. User Personas

- **Primary User (Programmatic):** AI Agents / Backend Services. These are internal, programmatic clients that need to send emails for various purposes, such as sending notifications, reports, or alerts. They require a simple, reliable, and well-documented API.
- **Secondary User (Human):** Platform Developers. The developers building and maintaining the various services that will consume this email microservice. They need a straightforward integration process and clear error feedback.

## 4. High-Level User Journeys

### Journey 1: A Backend Service Sends an Email

1. **Trigger:** A backend service (e.g., a user management service) needs to send a "password reset" email.
2. **Action:** The service constructs a JSON payload containing the recipient's address, subject, and email body.
3. **Integration:** The service sends a secure POST request to the `/email/send` endpoint of the Nest.js Email Microservice.
4. **Processing:** The Email Microservice validates the incoming request data (DTOs).
5. **Execution:** Upon successful validation, the microservice uses its `EmailService` (with Nodemailer) to connect to the configured SMTP provider and send the email.
6. **Feedback:** The microservice returns a `202 Accepted` status code to the calling service to indicate the request has been successfully queued for sending. If validation fails, it returns a `400 Bad Request` with a descriptive error message.

## 5. Business Requirements

### Functional Requirements

- The service MUST provide a RESTful API endpoint (e.g., `POST /email/send`) to send an email.
- The API MUST accept a JSON payload with `to`, `subject`, and `body` (HTML) fields.
- The service MUST use Data Transfer Objects (DTOs) for strict validation of all incoming requests.
- The service MUST integrate with an external SMTP provider (e.g., SendGrid, Mailgun, AWS SES) using Nodemailer.
- The service MUST log the status of each email send request (success or failure) for traceability.
- The service MUST be created as a new, distinct application (`mcp-email-server`) within the Nx monorepo.

### Non-Functional Requirements

- **Security:** SMTP credentials MUST be managed securely via environment variables and never be hardcoded. The API endpoint should be protected from public access.
- **Performance:** The API should respond within 200ms for a valid request. The actual email sending can be an asynchronous process.
- **Reliability:** The service should be highly available and include retry logic for transient SMTP connection failures.
- **Testability:** The service MUST have comprehensive unit and integration test coverage to ensure reliability.
- **Scalability:** The service should be designed to be stateless to allow for horizontal scaling.

## 6. Success Metrics

- **API Uptime:** > 99.9% availability of the email-sending endpoint.
- **API Latency:** Average API response time < 200ms.
- **Email Delivery Rate:** > 99% successful delivery rate as reported by the SMTP provider.
- **Adoption Rate:** Number of internal services integrated with the email microservice within the first 3 months.
- **Error Rate:** API error rate (4xx/5xx responses) < 0.1%.

## 7. Out of Scope

- **Email Templating:** The service will only accept pre-rendered HTML. It will not be responsible for managing or rendering email templates.
- **User Interface:** This is a backend-only service and will not have any UI.
- **Email Analytics:** Tracking email opens or clicks is not part of this epic.
- **Attachments:** The first version will not support sending email attachments.
- **Bulk Emailing:** The service is intended for transactional emails, not bulk marketing campaigns.

## 8. Business Value

- **Value:** High
- **Justification:** This epic provides a foundational capability required for numerous current and future features across the platform. It reduces redundant engineering work, improves the platform's security posture, and establishes a scalable pattern for handling all email communications, directly enabling future product development.
