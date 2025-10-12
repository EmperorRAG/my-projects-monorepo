# Instructions for Request Validation

This document provides a step-by-step guide to implement robust request validation in the `my-nest-js-email-microservice`.

## 1. Install Dependencies

Ensure that `class-validator` and `class-transformer` are installed. They are typically included with a new NestJS project, but it's good to confirm.

**Action:**

- Run the following command in your terminal if these packages are missing:

```sh
pnpm add -w class-validator class-transformer
```

## 2. Create the Data Transfer Object (DTO)

Define the data structure and validation rules for the email sending endpoint.

**Action:**

- Create a new directory: `services/my-nest-js-email-microservice/src/app/dto`
- Create a new file inside that directory: `send-email.dto.ts`
- Add the following code to `send-email.dto.ts`.

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

## 3. Apply the DTO to the Controller

Update the controller to use the new `SendEmailDto`.

### File to Edit: `services/my-nest-js-email-microservice/src/app/app.controller.ts`

**Action:**

- Import the `SendEmailDto`.
- Add the `@Body()` decorator to the `sendTestEmail` method's parameter to receive the request body.
- Type the body parameter with `SendEmailDto`.
- Pass the DTO to the `appService.sendTestEmail` method.

**New Code Snippet (for `app.controller.ts`):**

```typescript
// ...
import { Controller, Post, HttpCode, Body } from '@nestjs/common';
import { SendEmailDto } from './dto/send-email.dto';
// ...

@Controller()
export class AppController {
 constructor(private readonly appService: AppService) {}

 @Post('send-test-email')
 @HttpCode(202)
 sendTestEmail(@Body() sendEmailDto: SendEmailDto): void {
  this.appService.sendTestEmail(sendEmailDto);
 }
}
```

## 4. Update the Service

Update the service to accept the DTO.

### File to Edit: `services/my-nest-js-email-microservice/src/app/app.service.ts`

**Action:**

- Import the `SendEmailDto`.
- Update the `sendTestEmail` method to accept the `sendEmailDto` as a parameter.
- Use the properties from the DTO in the `smtpService.sendEmail` call.

**New Code Snippet (for `app.service.ts`):**

```typescript
// ...
import { SendEmailDto } from './dto/send-email.dto';
// ...

// ...
async sendTestEmail(sendEmailDto: SendEmailDto): Promise<void> {
    try {
        await this.smtpService.sendEmail({
            to: sendEmailDto.to,
            subject: sendEmailDto.subject,
            text: sendEmailDto.body,
        });
    } catch (error) {
        console.error('Failed to send email:', error);
    }
}
// ...
```

## 5. Configure the Global Validation Pipe

Apply the `ValidationPipe` globally to enable automatic validation for all incoming requests.

### File to Edit: `services/my-nest-js-email-microservice/src/main.ts`

**Action:**

- Import the `ValidationPipe` from `@nestjs/common`.
- Use `app.useGlobalPipes()` to apply the `ValidationPipe` with the recommended settings.

**New Code Snippet (for `main.ts`):**

```typescript
// ...
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
 const app = await NestFactory.create(AppModule);

 app.useGlobalPipes(
  new ValidationPipe({
   whitelist: true, // Strip properties that do not have any decorators
   forbidNonWhitelisted: true, // Throw an error if non-whitelisted values are provided
   transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
  }),
 );

 await app.listen(3000);
}
bootstrap();
```

## 6. Verify the Implementation

- **Start the Service:**

    ```sh
    nx serve @my-projects-monorepo/my-nest-js-email-microservice
    ```

- **Test Scenarios:**
  - **Valid Request:** Send a `POST` request to `http://localhost:3000/send-test-email` with a valid JSON body. It should return `202 Accepted`.
  - **Invalid Email:** Send a request with an invalid email in the `to` field. It should return a `400 Bad Request` with a descriptive error.
  - **Missing Field:** Send a request without the `subject` field. It should return a `400 Bad Request`.
  - **Extra Field:** Send a request with an extra field like `"cc": "test@test.com"`. It should return a `400 Bad Request`.
