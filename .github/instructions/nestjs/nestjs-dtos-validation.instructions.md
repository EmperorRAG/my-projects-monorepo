---
applyTo: '**/*.ts,**/*.js,**/*.json,**/*.spec.ts,**/*.e2e-spec.ts'
---

# NestJS DTOs & Validation

## DTO Patterns
- Create dedicated DTO classes per operation (create, update, query) so validation rules remain clear.
- Decorate properties with `class-validator` decorators like `@IsString`, `@IsEmail`, and `@Length`.
- Use `class-transformer` to coerce primitives (for example `@Type(() => Number)`).

## Validation Pipes
- Attach `ValidationPipe` globally or per handler to enforce DTO rules; enable `whitelist` to strip unknown fields.
- Surface descriptive validation error messages to help clients correct requests quickly.
