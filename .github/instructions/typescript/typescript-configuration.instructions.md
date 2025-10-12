---
applyTo: '**/*.ts'
---

# TypeScript Configuration & Documentation

## Configuration Handling
- Access configuration through shared helpers and validate values with schemas or dedicated validators.
- Guard against `undefined` secrets or configuration drift, and document new keys when they are introduced.

## Documentation
- Add JSDoc to public APIs; include `@remarks` or `@example` blocks when context aids comprehension.
- Refresh architecture or design docs when you introduce notable patterns that others must follow.
