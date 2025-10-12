---
applyTo: '**/*.ts'
---

# TypeScript Project Organization

## File Layout
- Follow the repository's folder responsibilities; avoid introducing new top-level areas without consensus.
- Name files with kebab-case (for example `user-session.ts`, `data-service.ts`) unless a project-specific convention overrides it.
- Keep related tests, helpers, and type definitions near their implementation when it improves discovery.

## Shared Utilities
- Prefer extending shared utilities over duplicating logic.
- Centralize shared contracts and re-export them from existing entry points so consumers have one source of truth.
