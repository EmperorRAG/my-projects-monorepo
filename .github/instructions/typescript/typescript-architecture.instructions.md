---
applyTo: '**/*.ts'
---

# TypeScript Architecture & Patterns

## Composition
- Follow the repository's dependency-injection or composition style; keep modules single-purpose.
- Respect existing initialization and disposal sequences when wiring into lifecycle management.

## Layering
- Keep transport, domain, and presentation layers decoupled through clear interfaces.
- Provide lifecycle hooks (for example `initialize`, `dispose`) and targeted tests when adding services.
