# Instructions: Secure Credential Management

This document provides step-by-step instructions to implement secure credential management in the `my-nest-js-email-microservice` using the `@nestjs/config` module and `Joi` for validation.

## 1. Install Dependencies

First, add the necessary packages to the project.

```sh
pnpm add -w @nestjs/config joi
```

## 2. Create Environment Variable Schema

Create a validation schema to ensure that all required environment variables are present at startup.

### Create New File: `services/my-nest-js-email-microservice/src/config/validation.ts`

**Content:**

```typescript
import * as Joi from 'joi';

export const validationSchema = Joi.object({
  SMTP_HOST: Joi.string().required(),
  SMTP_PORT: Joi.number().required(),
  SMTP_USER: Joi.string().required(),
  SMTP_PASS: Joi.string().required(),
  API_KEY: Joi.string().required(),
});
```

## 3. Configure the `ConfigModule`

Update the `AppModule` to import and configure the `ConfigModule` globally. This will make the `ConfigService` available throughout the application.

### File to Edit: `services/my-nest-js-email-microservice/src/app/app.module.ts`

**Action:**

- Import `ConfigModule`.
- Import the `validationSchema`.
- Add `ConfigModule.forRoot()` to the `imports` array, making it global and providing the validation schema.

**New Code (`app.module.ts`):**

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SmtpModule } from '../smtp/smtp.module';
import { validationSchema } from '../config/validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
    }),
    SmtpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

## 4. Refactor `SmtpModule` to Use `ConfigService`

Modify the `SmtpModule` to dynamically configure the Nodemailer transport using credentials from the `ConfigService`.

### File to Edit: `services/my-nest-js-email-microservice/src/smtp/smtp.module.ts`

**Action:**

- Refactor `SmtpModule` to be a dynamic module.
- Use the `forRoot` pattern to configure it asynchronously.
- Inject `ConfigService` to retrieve SMTP credentials.

**New Code (`smtp.module.ts`):**

```typescript
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { SmtpService } from './smtp.service';

@Module({
  providers: [
    {
      provide: 'SMTP_TRANSPORT',
      useFactory: (configService: ConfigService) => {
        return nodemailer.createTransport({
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

## 5. Create a `.env` File for Local Development

For local testing, create a `.env` file in the root of the `my-nest-js-email-microservice` project.

### Create New File: `services/my-nest-js-email-microservice/.env`

**Content (replace with your actual credentials):**

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-username
SMTP_PASS=your-password
API_KEY=your-secret-api-key
```

**Important:** Add `.env` to your `.gitignore` file to prevent committing it to source control.

## 6. Verification

- **Start the service:** `nx serve @my-projects-monorepo/my-nest-js-email-microservice`
- **Test with all variables:** The app should start successfully.
- **Test with missing variables:** Remove a required variable from `.env` (e.g., `SMTP_HOST`). The app should fail to start and log an error like: `"Config validation error: "SMTP_HOST" is required"`.
- **Send an email:** Use the API to send an email and confirm the `SmtpService` uses the credentials from the `.env` file.
