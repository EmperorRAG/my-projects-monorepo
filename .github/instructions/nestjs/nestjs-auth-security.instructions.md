---
applyTo: '**/*.ts,**/*.js,**/*.json,**/*.spec.ts,**/*.e2e-spec.ts'
---

# NestJS Authentication & Security

## Authentication
- Integrate Passport strategies (such as JWT) with guards derived from `AuthGuard('jwt')` and override `handleRequest` to normalize errors.
- Use decorators like `@SetMetadata` and custom `@CurrentUser()` helpers to access context in handlers.

## Authorization
- Combine guards (e.g., `JwtAuthGuard`, `RolesGuard`) to enforce role-based access control.
- Document required roles per route and keep permission checks server-side.

## Defensive Coding
- Validate all incoming payloads, sanitize outputs, and configure CORS appropriately.
- Introduce rate limiting (for example via `@Throttle`) on sensitive endpoints to mitigate brute-force attacks.
