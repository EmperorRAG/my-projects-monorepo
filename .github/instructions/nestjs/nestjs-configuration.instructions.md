---
applyTo: '**/*.ts,**/*.js,**/*.json,**/*.spec.ts,**/*.e2e-spec.ts'
---

# NestJS Configuration Management

## Environment Configuration
- Use `@nestjs/config` with validated configuration schemas to catch issues at boot time.
- Load environment-specific settings via `.env` files or secret stores and inject them through dedicated services.

## Accessors
- Expose configuration values using wrapper services that surface typed getters (for example database URL, JWT secret) to keep usage consistent.
