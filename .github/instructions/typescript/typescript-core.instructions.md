---
applyTo: '**/*.ts'
---

# TypeScript Core Guardrails

## Intent
- Respect existing architecture and coding standards; prefer clarity over cleverness.
- Extend current abstractions before inventing new ones so the codebase stays cohesive.
- Target TypeScript 5.x outputting ES2022 modules; prefer native platform features over polyfills.

## Baseline Rules
- Emit pure ES modules; never fall back to CommonJS helpers such as `require` or `module.exports`.
- Use the repository's build, lint, and test tooling for validation unless a maintainer requests otherwise.
- Highlight design trade-offs inside comments or PR notes when the intent may be unclear to future readers.
