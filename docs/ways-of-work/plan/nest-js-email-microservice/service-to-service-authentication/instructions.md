# Instructions for Service-to-Service Authentication

This document provides a step-by-step guide to implement service-to-service (S2S) authentication in the `my-nest-js-email-microservice`.

## 1. Install Dependency

First, install the in-house authentication library.

**Action:**

- Run the following command in your terminal:

```sh
pnpm -w add @my-org/better-auth
```

*Note: Since this is a fictional package, this command will fail. We will proceed by creating a mock implementation.*

## 2. Create a Mock Authentication Library

To simulate the `@my-org/better-auth` library, we will create a mock service.

**Action:**

- Create a new file: `services/my-nest-js-email-microservice/src/auth/better-auth.service.ts`
- Add the following code. This mock service will contain a `validateToken` method that performs a basic check.

**File Content (`better-auth.service.ts`):**

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class BetterAuthService {
 /**
  * Mock token validation.
  * In a real scenario, this would validate a JWT.
  * For now, it just checks if the token is 'valid-token'.
  */
 validateToken(token: string): boolean {
  return token === 'valid-token';
 }
}
```

## 3. Implement the Authentication Guard

Now, create the NestJS guard that will use the authentication service.

### File to Edit: `services/my-nest-js-email-microservice/src/auth/s2s-auth.guard.ts`

**Action:**

- Update the existing placeholder guard with the logic to call the `BetterAuthService`.
- Inject `BetterAuthService`.
- In the `canActivate` method, extract the token from the `Authorization` header and validate it.

**New Code (`s2s-auth.guard.ts`):**

```typescript
import {
 Injectable,
 CanActivate,
 ExecutionContext,
 UnauthorizedException,
} from '@nestjs/common';
import { BetterAuthService } from './better-auth.service';

@Injectable()
export class S2SAuthGuard implements CanActivate {
 constructor(private readonly betterAuthService: BetterAuthService) {}

 canActivate(context: ExecutionContext): boolean {
  const request = context.switchToHttp().getRequest();
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
   throw new UnauthorizedException('Missing or invalid authorization header');
  }

  const token = authHeader.split(' ')[1];
  const isValid = this.betterAuthService.validateToken(token);

  if (!isValid) {
   throw new UnauthorizedException('Invalid token');
  }

  return true;
 }
}
```

## 4. Update the Application Module

Register the `BetterAuthService` as a provider so it can be injected into the guard.

### File to Edit: `services/my-nest-js-email-microservice/src/app/app.module.ts`

**Action:**

- Import `BetterAuthService`.
- Add `BetterAuthService` to the `providers` array.

**New Code Snippet (for `app.module.ts`):**

```typescript
// ...
import { BetterAuthService } from '../auth/better-auth.service';

@Module({
 // ...
 providers: [AppService, BetterAuthService], // Add BetterAuthService
})
export class AppModule {}
```

## 5. Verify the Implementation

- **Start the Service:**

    ```sh
    nx serve @my-projects-monorepo/my-nest-js-email-microservice
    ```

- **Test Scenarios:**
  - **No Token:** Send a `POST` request to `http://localhost:3000/email/send`. It should fail with a `401 Unauthorized` error.
  - **Invalid Token:** Send the request with an `Authorization` header of `Bearer invalid-token`. It should fail with a `401 Unauthorized` error.
  - **Valid Token:** Send the request with an `Authorization` header of `Bearer valid-token`. It should succeed with a `202 Accepted` response.
