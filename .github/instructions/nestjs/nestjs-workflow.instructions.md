---
applyTo: 'services/**/*.ts,services/**/*.js,services/**/*.json,services/**/*.spec.ts,services/**/*.e2e-spec.ts,libs/**/*.ts,libs/**/*.js,libs/**/*.json,libs/**/*.spec.ts,libs/**/*.e2e-spec.ts'
---

# NestJS Development Workflow

## Setup

-   Use the Nest CLI (`nest generate ...`) to scaffold modules, controllers, and services with consistent conventions.
-   Enable TypeScript strict mode, ESLint, and Prettier to maintain code quality.

## Review Checklist

-   [ ] Proper decorator usage and DI wiring.
-   [ ] Validation applied to all external inputs.
-   [ ] Error handling routed through filters or consistent responses.
-   [ ] Modules import/export only what they need.
-   [ ] Security and performance considerations documented.
-   [ ] Tests cover critical paths (unit, integration, or e2e as appropriate).
