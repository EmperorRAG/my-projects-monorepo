# NestJS Email Microservice

A secure email microservice built with NestJS that provides an authenticated API for dispatching SMTP emails.

## Features

- Service-to-service authentication with bearer tokens
- DTO validation for email requests
- SMTP integration via Nodemailer
- Health check endpoint
- Comprehensive unit test coverage

## Prerequisites

- Node.js 20.x or higher
- SMTP server credentials

## Installation

From the monorepo root:

```bash
npm install
```

## Configuration

Create a `.env` file in the service directory with the following variables:

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASS=your-password
API_KEY=valid-token
```

## Running the Application

### Development Mode

```bash
npx nx serve my-nest-js-email-microservice
```

### Production Build

```bash
npx nx build my-nest-js-email-microservice
```

## Testing

The service includes comprehensive unit tests covering:

- **Auth Layer**: Token validation (`BetterAuthService`, `S2SAuthGuard`)
- **DTO Validation**: Email payload validation (`SendEmailDto`)
- **Config Validation**: Environment variable schema validation
- **Service Behavior**: Email sending logic with logging (`AppService`)
- **SMTP Integration**: Nodemailer transport delegation (`SmtpService`)

### Running Tests

From the monorepo root:

```bash
npx nx test my-nest-js-email-microservice
```

### Test Fixtures

Shared test data is available in `test/fixtures/email.ts`:

- `validToken` / `invalidToken` - Authentication tokens
- `validSendEmailDto` - Valid email payload
- `invalidEmailDto` - Invalid email format
- `incompleteSendEmailDto` - Missing required fields
- `cloneDto()` - Helper for mutation-free test scenarios

### Test Coverage

To generate a coverage report:

```bash
npx nx test my-nest-js-email-microservice --coverage
```

Coverage reports are generated in `test-output/jest/coverage/`.

## API Endpoints

### POST /email/send

Send an email via SMTP.

**Headers:**
```
Authorization: Bearer <valid-token>
```

**Request Body:**
```json
{
  "to": "recipient@example.com",
  "subject": "Email Subject",
  "body": "Email content"
}
```

**Response:**
- `202 Accepted` - Email queued for sending
- `401 Unauthorized` - Invalid or missing token
- `400 Bad Request` - Invalid email data

### GET /health

Health check endpoint.

**Response:**
- `200 OK` - Service is healthy

## Project Structure

```
src/
├── app/
│   ├── dto/
│   │   └── send-email.dto.ts       # Email validation DTO
│   ├── app.controller.ts           # Email endpoint controller
│   ├── app.module.ts                # Main application module
│   └── app.service.ts               # Email sending orchestration
├── auth/
│   ├── better-auth.service.ts       # Token validation service
│   └── s2s-auth.guard.ts            # Authorization guard
├── config/
│   └── validation.ts                # Joi schema for env vars
├── health/
│   ├── health.controller.ts         # Health check endpoint
│   └── health.module.ts             # Health module
├── smtp/
│   ├── smtp.module.ts               # SMTP module
│   └── smtp.service.ts              # Nodemailer wrapper
└── main.ts                          # Application entry point

test/
└── fixtures/
    └── email.ts                     # Shared test data
```

## Docker

Build the Docker image:

```bash
npm run docker:build
```

## License

MIT
