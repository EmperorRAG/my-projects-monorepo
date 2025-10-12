---
description: 'NestJS development standards and best practices for building scalable Node.js server-side applications'
applyTo: 'services/**/*.ts,services/**/*.js,services/**/*.json,services/**/*.spec.ts,services/**/*.e2e-spec.ts,libs/**/*.ts,libs/**/*.js,libs/**/*.json,libs/**/*.spec.ts,libs/**/*.e2e-spec.ts'
---

# NestJS Instruction Module Index

NestJS guidance lives under `.github/instructions/nestjs`. Each module declares its own `applyTo` pattern so the assistant only loads the guidance relevant to the services and libraries in play.

## Module Directory

-   `nestjs-core-principles.instructions.md` — Dependency injection, modular architecture, and decorator usage.
-   `nestjs-architecture.instructions.md` — Project layout conventions and naming discipline.
-   `nestjs-controllers-services.instructions.md` — Guidance for thin controllers and focused providers.
-   `nestjs-dtos-validation.instructions.md` — DTO design, validation decorators, and pipes.
-   `nestjs-database.instructions.md` — Persistence patterns, migrations, and repository usage.
-   `nestjs-auth-security.instructions.md` — Authentication flows, authorization, and defensive coding.
-   `nestjs-error-logging.instructions.md` — Exception filters, logging structure, and observability hooks.
-   `nestjs-performance.instructions.md` — Caching strategies, resilience, and resource tuning.
-   `nestjs-configuration.instructions.md` — Environment management, typed configs, and secrets handling.
-   `nestjs-testing.instructions.md` — Unit, integration, and e2e coverage expectations.
-   `nestjs-pitfalls.instructions.md` — Common mistakes to avoid in NestJS services and shared libs.
-   `nestjs-workflow.instructions.md` — Development workflow, review checklist, and release hygiene.

## Extending This Set

-   Scope new modules with focused topics and matching `applyTo` globs for services or shared libraries.
-   Update this index whenever modules are added, renamed, or removed so downstream agents discover the new guidance.
-   Preserve the concise, bullet-first writing style used here to stay consistent with other instruction families.
