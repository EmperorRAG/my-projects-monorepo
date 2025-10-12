---
applyTo: '**/*.ts,**/*.js,**/*.json,**/*.spec.ts,**/*.e2e-spec.ts'
---

# NestJS Project Structure

## Directory Layout
- Organize source code into `modules/` for features, `common/` for cross-cutting pieces (decorators, guards, interceptors, pipes), and `config/` for environment setup.
- Keep shared services that span modules inside dedicated `shared/` folders to prevent repeated implementations.

## Naming Conventions
- Use suffixed filenames that match NestJS defaults: `*.module.ts`, `*.controller.ts`, `*.service.ts`, `*.dto.ts`, `*.entity.ts`, `*.guard.ts`, `*.interceptor.ts`, `*.pipe.ts`, and `*.filter.ts`.
- Ensure exported class names mirror the filenames to support CLI generators and developer tooling.
