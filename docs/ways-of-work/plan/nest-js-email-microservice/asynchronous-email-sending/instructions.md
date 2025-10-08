# Instructions for Asynchronous Email Sending

This document provides a step-by-step guide to implement the asynchronous email sending feature in the `my-nest-js-email-microservice`.

## 1. Modify the `EmailController`

The primary change is to make the controller's method a "fire-and-forget" call.

### File to Edit: `services/my-nest-js-email-microservice/src/app/app.controller.ts`

**Action:**

- Modify the `sendTestEmail` method.
- Remove the `async` and `await` keywords from the method signature and the call to `appService.sendTestEmail()`.
- Add the `@HttpCode(202)` decorator to the method to ensure it returns a `202 Accepted` status code.

**Current Code:**

```typescript
// ...
@Post('send-test-email')
async sendTestEmail(): Promise<void> {
    return this.appService.sendTestEmail();
}
// ...
```

**New Code:**

```typescript
// ...
import { Controller, Post, HttpCode } from '@nestjs/common';
// ...
@Post('send-test-email')
@HttpCode(202)
sendTestEmail(): void {
    this.appService.sendTestEmail();
}
// ...
```

## 2. Modify the `EmailService`

The service will now handle the asynchronous operation and logging.

### File to Edit: `services/my-nest-js-email-microservice/src/app/app.service.ts`

**Action:**

- Wrap the `smtpService.sendEmail` call in a `try...catch` block.
- In the `catch` block, log the error. For now, we will use `console.error`. In the future, this will be replaced by a dedicated logging service.

**Current Code:**

```typescript
// ...
async sendTestEmail(): Promise<void> {
    await this.smtpService.sendEmail({
        to: 'test@example.com',
        subject: 'Test Email',
        text: 'This is a test email.',
    });
}
// ...
```

**New Code:**

```typescript
// ...
async sendTestEmail(): Promise<void> {
    try {
        await this.smtpService.sendEmail({
            to: 'test@example.com',
            subject: 'Test Email',
            text: 'This is a test email.',
        });
    } catch (error) {
        console.error('Failed to send email:', error);
    }
}
// ...
```

## 3. Verify the Implementation

After making the changes, you can run the tests and start the service to manually verify the behavior.

- **Run Tests:**

    ```sh
    nx run @my-projects-monorepo/my-nest-js-email-microservice:test
    ```

- **Start the Service:**

    ```sh
    nx serve @my-projects-monorepo/my-nest-js-email-microservice
    ```

- **Send a Request:** Use a tool like `curl` or Postman to send a `POST` request to `http://localhost:3000/send-test-email`. You should receive an immediate `202 Accepted` response.
