---
applyTo: 'apps/**/app/api/**/*.ts'
---

# Next.js API Route Guidance

## Route Location
- Define route handlers inside `app/api/<segment>/route.ts` and prefer this structure over legacy API folders.
- Use dynamic segments like `[id]` when parameterizing routes, keeping folder names descriptive.

## Handler Implementation
- Export async functions named for HTTP verbs (`GET`, `POST`, and so on) that rely on Web-standard `Request` and `Response` objects.
- Validate and sanitize all inputs with libraries such as `zod`; return precise status codes for success and failure paths.
- Protect sensitive endpoints with authentication checks and guard clauses.

## Reliability
- Provide structured error payloads to support client observability.
- Document any middleware dependencies so maintainers can trace the request flow quickly.
