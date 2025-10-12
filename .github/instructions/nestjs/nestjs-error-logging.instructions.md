---
applyTo: '**/*.ts,**/*.js,**/*.json,**/*.spec.ts,**/*.e2e-spec.ts'
---

# NestJS Error Handling & Logging

## Exception Filters
- Implement global or scoped filters using `@Catch()` to map exceptions into consistent HTTP responses.
- Log request context (method, URL) alongside the exception to aid incident response.

## Logger Usage
- Use NestJS `Logger` or a custom logger service to emit logs at appropriate levels (error, warn, log, debug, verbose).
- Ensure sensitive data never leaves the process in log statements.
