---
applyTo: '**/*.ts'
---

# TypeScript Type System Expectations

## Strictness
- Avoid `any` (implicit or explicit); prefer `unknown` with type guards to narrow intent.
- Model state and events with discriminated unions and shared interfaces to keep control flow explicit.
- Use TypeScript utility types (`Readonly`, `Partial`, `Record`, etc.) to express intent without redefining shapes.

## Reuse
- Consolidate contract definitions so multiple modules share the same source of truth.
- Document significant type aliases with JSDoc when the meaning may be unclear to future contributors.
