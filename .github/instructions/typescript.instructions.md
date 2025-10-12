---
description: 'Guidelines for TypeScript Development targeting TypeScript 5.x and ES2022 output'
applyTo: '**/*.ts'
---

# TypeScript Instruction Module Index

Modular TypeScript guidance lives under `.github/instructions/typescript`. Each file has its own `applyTo` scope so only relevant guidance loads for the code you are editing.

## Module Directory
- `typescript-core.instructions.md` — Core guardrails for TypeScript 5.x targeting ES2022.
- `typescript-organization.instructions.md` — File layout, naming, and reuse expectations.
- `typescript-naming-style.instructions.md` — Symbol naming and formatting discipline.
- `typescript-type-system.instructions.md` — Strict typing rules and contract reuse guidance.
- `typescript-async-error.instructions.md` — Async patterns, error reporting, and resource cleanup.
- `typescript-architecture.instructions.md` — Dependency management, layering, and lifecycle hooks.
- `typescript-integrations.instructions.md` — Guidance for external clients, retries, and normalization.
- `typescript-security.instructions.md` — Input validation, data protection, and defensive coding.
- `typescript-configuration.instructions.md` — Configuration usage and documentation expectations.
- `typescript-testing-performance.instructions.md` — Testing strategy plus performance and reliability notes.

Add new TypeScript modules to this directory and update the index when additional guidance is introduced.
