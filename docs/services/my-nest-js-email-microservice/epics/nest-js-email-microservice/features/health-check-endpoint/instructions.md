# Instructions for Health Check Endpoint

This document provides a step-by-step guide to implement the health check endpoint in the `my-nest-js-email-microservice`.

## 1. Install Dependency

First, install the required NestJS Terminus package.

**Action:**

- Run the following command in your terminal:

```sh
pnpm add -w @nestjs/terminus
```

## 2. Create the Health Controller

Create a new controller to handle the health check logic.

**Action:**

- Create a new file: `services/my-nest-js-email-microservice/src/health/health.controller.ts`
- Add the following code to the new file. This controller defines a `/health` endpoint that uses the `HealthCheckService` to confirm the service is responsive.

**File Content:**

```typescript
import { Controller, Get } from '@nestjs/common';
import {
 HealthCheck,
 HealthCheckService,
 HttpHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
 constructor(
  private health: HealthCheckService,
  private http: HttpHealthIndicator,
 ) {}

 @Get()
 @HealthCheck()
 check() {
  // The pingCheck is a basic indicator that the HTTP server is responsive.
  return this.health.check([
   () =>
    this.http.pingCheck(
     'nestjs-app',
     'http://localhost:3000/health/ping',
    ),
  ]);
 }

 @Get('ping')
 ping() {
  return 'pong';
 }
}
```

## 3. Update the Application Module

Register the new `TerminusModule` and `HealthController` in the main application module.

### File to Edit: `services/my-nest-js-email-microservice/src/app/app.module.ts`

**Action:**

- Import `TerminusModule` and `HealthController`.
- Add `TerminusModule` to the `imports` array.
- Add `HealthController` to the `controllers` array.

**New Code Snippet (for `app.module.ts`):**

```typescript
// ... existing imports
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from '../health/health.controller';

@Module({
 imports: [
  ConfigModule.forRoot({ isGlobal: true }),
  SmtpModule,
  TerminusModule, // Add this
 ],
 controllers: [AppController, HealthController], // Add HealthController
 providers: [AppService],
})
export class AppModule {}
```

## 4. Verify the Implementation

After making the changes, start the service and test the new endpoint.

- **Start the Service:**

    ```sh
    nx serve @my-projects-monorepo/my-nest-js-email-microservice
    ```

- **Check the Endpoint:**
    Open your browser or use a tool like `curl` to access `http://localhost:3000/health`. You should see a response like this:

    ```json
    {
      "status": "ok",
      "info": {
        "nestjs-app": {
          "status": "up"
        }
      },
      "error": {},
      "details": {
        "nestjs-app": {
          "status": "up"
        }
      }
    }
    ```
