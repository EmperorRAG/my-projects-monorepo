# Instructions for Secure Email API

This document provides a step-by-step guide to implement the secure email API endpoint in the `my-nest-js-email-microservice`.

## 1. Create the DTO

If you haven't already from the "Request Validation" instructions, create the Data Transfer Object for the email request.

**Action:**

- Ensure the file `services/my-nest-js-email-microservice/src/app/dto/send-email.dto.ts` exists with the following content:

**File Content (`send-email.dto.ts`):**

```typescript
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendEmailDto {
 @IsEmail({}, { message: 'A valid email address must be provided for the "to" field.' })
 @IsNotEmpty({ message: 'The "to" field cannot be empty.' })
 to: string;

 @IsString()
 @IsNotEmpty()
 subject: string;

 @IsString()
 @IsNotEmpty()
 body: string;
}
```

## 2. Create the Secure Controller

Create a new controller that will be dedicated to handling email-related requests. This controller will be protected by an authentication guard.

**Action:**

- Create a new file: `services/my-nest-js-email-microservice/src/email/email.controller.ts`
- Add the following code. This sets up the `POST /email/send` endpoint, protects it with a placeholder `S2SAuthGuard`, and uses the `SendEmailDto`.

**File Content (`email.controller.ts`):**

```typescript
import { Body, Controller, Post, UseGuards, HttpCode } from '@nestjs/common';
import { AppService } from '../app/app.service';
import { SendEmailDto } from '../app/dto/send-email.dto';

// NOTE: The S2SAuthGuard is a placeholder for now.
// It will be fully implemented in the 'service-to-service-authentication' feature.
import { S2SAuthGuard } from '../auth/s2s-auth.guard';

@UseGuards(S2SAuthGuard)
@Controller('email')
export class EmailController {
 constructor(private readonly appService: AppService) {}

 @Post('send')
 @HttpCode(202)
 sendEmail(@Body() sendEmailDto: SendEmailDto): void {
  this.appService.sendTestEmail(sendEmailDto);
 }
}
```

## 3. Create a Placeholder Authentication Guard

To make the controller work before the full authentication feature is built, create a placeholder guard.

**Action:**

- Create a new directory: `services/my-nest-js-email-microservice/src/auth`
- Create a new file: `services/my-nest-js-email-microservice/src/auth/s2s-auth.guard.ts`
- Add the following code. This guard will simply allow all requests to pass for now.

**File Content (`s2s-auth.guard.ts`):**

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class S2SAuthGuard implements CanActivate {
 canActivate(
  context: ExecutionContext,
 ): boolean | Promise<boolean> | Observable<boolean> {
  // For now, this guard will always return true.
  // It will be replaced with a real authentication mechanism.
  return true;
 }
}
```

## 4. Update the Application Module

Register the new `EmailController` in the main application module.

### File to Edit: `services/my-nest-js-email-microservice/src/app/app.module.ts`

**Action:**

- Import the `EmailController`.
- Add `EmailController` to the `controllers` array.

**New Code Snippet (for `app.module.ts`):**

```typescript
// ...
import { EmailController } from '../email/email.controller';

@Module({
 imports: [
  ConfigModule.forRoot({ isGlobal: true }),
  SmtpModule,
  TerminusModule,
 ],
 controllers: [AppController, HealthController, EmailController], // Add EmailController
 providers: [AppService],
})
export class AppModule {}
```

## 5. Remove Old Endpoint

The test endpoint in `AppController` is now replaced by the secure `EmailController`.

### File to Edit: `services/my-nest-js-email-microservice/src/app/app.controller.ts`

**Action:**

- Remove the `sendTestEmail` method and its associated imports (`Post`, `HttpCode`, `Body`, `SendEmailDto`).

**New Code (`app.controller.ts`):**

```typescript
import { Controller } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
 constructor(private readonly appService: AppService) {}
}
```
