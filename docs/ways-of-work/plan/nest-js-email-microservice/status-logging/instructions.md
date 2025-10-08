# Instructions for Status Logging

This document provides a step-by-step guide to implement structured status logging in the `my-nest-js-email-microservice`.

## 1. Use the Built-in Logger

For simplicity, we will use the default NestJS `Logger` and manually structure our log messages. A more advanced implementation would involve a custom logger service, but this approach is sufficient for the current scope.

## 2. Update the Email Service

Modify the `EmailService` to log the outcome of each email sending attempt.

### File to Edit: `services/my-nest-js-email-microservice/src/app/app.service.ts`

**Action:**

- Import the `Logger` from `@nestjs/common`.
- Instantiate the logger within the `AppService`.
- In the `sendTestEmail` method, add logging for both success and failure cases.

**New Code (`app.service.ts`):**

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { SmtpService } from '../smtp/smtp.service';
import { SendEmailDto } from './dto/send-email.dto';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly smtpService: SmtpService) {}

  async sendTestEmail(sendEmailDto: SendEmailDto): Promise<void> {
    const { to, subject } = sendEmailDto;

    try {
      const result = await this.smtpService.sendEmail(sendEmailDto);
      this.logger.log(
        `Email sent successfully to: ${to}, subject: ${subject}, messageId: ${result.messageId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send email to: ${to}, subject: ${subject}`,
        error.stack,
      );
    }
  }
}
```

## 3. Verify the Implementation

After making the changes, start the service and send a request to see the logs.

- **Start the Service:**

  ```sh
  pnpm exec nx serve @my-projects-monorepo/my-nest-js-email-microservice
  ```

- **Send a Request:**
  - Use a tool like `curl` or Postman to send a `POST` request to `http://localhost:3000/email/send` with a valid body and the `Authorization: Bearer valid-token` header.
  - Check the terminal where the service is running. You should see a log message indicating either success or failure.

**Example Success Log:**

```
[Nest] 34567  - 10/08/2025, 10:00:00 AM     LOG [AppService] Email sent successfully to: test@example.com, subject: Test, messageId: <some-id@example.com>
```

**Example Failure Log:**

```text
[Nest] 34567  - 10/08/2025, 10:01:00 AM   ERROR [AppService] Failed to send email to: test@example.com, subject: Test
Error: Invalid login: 535-5.7.8 Username and Password not accepted.
    at ...
```
