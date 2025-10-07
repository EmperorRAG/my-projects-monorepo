# Instruction Set: Nodemailer Integration

## 1. Objective

This document provides a step-by-step guide to integrating the `Nodemailer` library into the `my-nest-js-email-microservice` application. This involves creating a dedicated, configurable `SmtpModule` and an `SmtpService` to handle all email-sending logic.

## 2. Prerequisites

- The `my-nest-js-email-microservice` application has been generated.
- You are at the root of the `my-projects-monorepo` workspace.
- You have access to SMTP server credentials (host, port, user, password).

---

## 3. Step-by-Step Instructions

### Step 1: Install Dependencies

Install `nodemailer` and its TypeScript type definitions.

```sh
pnpm add -w nodemailer
pnpm add -w -D @types/nodemailer
```

### Step 2: Create the SMTP Module and Service

Create the necessary files for the new `SmtpModule`.

1. **Create the directory:**

    ```sh
    mkdir -p services/my-nest-js-email-microservice/src/smtp/interfaces
    ```

2. **Create `smtp.module.ts`:**
    - **File:** `services/my-nest-js-email-microservice/src/smtp/smtp.module.ts`
    - **Content:**

        ```typescript
        import { Module } from '@nestjs/common';
        import { ConfigModule, ConfigService } from '@nestjs/config';
        import { createTransport } from 'nodemailer';
        import { SmtpService } from './smtp.service';

        @Module({
          imports: [ConfigModule],
          providers: [
            {
              provide: 'NODEMAILER_TRANSPORT',
              useFactory: (configService: ConfigService) => {
                return createTransport({
                  host: configService.get<string>('SMTP_HOST'),
                  port: configService.get<number>('SMTP_PORT'),
                  secure: configService.get<number>('SMTP_PORT') === 465, // true for 465, false for other ports
                  auth: {
                    user: configService.get<string>('SMTP_USER'),
                    pass: configService.get<string>('SMTP_PASS'),
                  },
                });
              },
              inject: [ConfigService],
            },
            SmtpService,
          ],
          exports: [SmtpService],
        })
        export class SmtpModule {}
        ```

3. **Create `smtp.service.ts`:**
    - **File:** `services/my-nest-js-email-microservice/src/smtp/smtp.service.ts`
    - **Content:**

        ```typescript
        import { Inject, Injectable } from '@nestjs/common';
        import { Transporter, SendMailOptions } from 'nodemailer';

        @Injectable()
        export class SmtpService {
          constructor(
            @Inject('NODEMAILER_TRANSPORT') private readonly transport: Transporter,
          ) {}

          async sendEmail(options: SendMailOptions) {
            return this.transport.sendMail(options);
          }
        }
        ```

4. **Create `mail-options.interface.ts`:**
    - **File:** `services/my-nest-js-email-microservice/src/smtp/interfaces/mail-options.interface.ts`
    - **Content:**

        ```typescript
        import { SendMailOptions } from 'nodemailer';

        export type MailOptions = SendMailOptions;
        ```

### Step 3: Integrate `SmtpModule` into the Main Application

Import the newly created `SmtpModule` into the root `AppModule`.

- **File to Edit:** `services/my-nest-js-email-microservice/src/app/app.module.ts`
- **Modification:** Add `SmtpModule` and `ConfigModule` to the `imports` array.

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // Import ConfigModule
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SmtpModule } from '../smtp/smtp.module'; // Import SmtpModule

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes config available everywhere
    }),
    SmtpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### Step 4: Use the `SmtpService`

Inject and use the `SmtpService` in your `AppService` to send an email.

- **File to Edit:** `services/my-nest-js-email-microservice/src/app/app.service.ts`
- **Modification:** Inject `SmtpService` and modify the `getHello` method to send a test email.

```typescript
import { Injectable } from '@nestjs/common';
import { SmtpService } from '../smtp/smtp.service';

@Injectable()
export class AppService {
  constructor(private readonly smtpService: SmtpService) {}

  async getHello(): Promise<string> {
    try {
      const result = await this.smtpService.sendEmail({
        from: '"Your Name" <your-email@example.com>',
        to: 'recipient@example.com',
        subject: 'Hello from NestJS ✔',
        text: 'This is a test email.',
        html: '<b>This is a test email.</b>',
      });
      console.log('Message sent: %s', result.messageId);
      return 'Hello World! Test email sent.';
    } catch (error) {
      console.error('Failed to send email', error);
      return 'Hello World! Failed to send email.';
    }
  }
}
```

### Step 5: Configure Environment Variables

Create a `.env` file in the root of the `my-nest-js-email-microservice` project.

- **File:** `services/my-nest-js-email-microservice/.env`
- **Content:**

    ```plaintext
    SMTP_HOST=your_smtp_host
    SMTP_PORT=587
    SMTP_USER=your_smtp_username
    SMTP_PASS=your_smtp_password
    ```

    **Important:** Replace the placeholder values with your actual SMTP credentials.

## 4. Verification

1. **Start the application:**

    ```sh
    nx serve my-nest-js-email-microservice
    ```

2. **Trigger the email:**
    Make a `GET` request to `http://localhost:3001/`.

3. **Check the console logs:**
    - You should see a "Message sent: <message-id>" log if the email was sent successfully.
    - You should see a "Failed to send email" error if it failed.

4. **Check the recipient's inbox:**
    Verify that the test email has been received.
