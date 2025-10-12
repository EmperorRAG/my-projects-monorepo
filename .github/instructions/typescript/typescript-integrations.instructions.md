---
applyTo: '**/*.ts'
---

# TypeScript External Integrations

## Client Management
- Instantiate external clients outside hot paths and inject them for easier testing.
- Avoid hardcoding secrets; load them from the project's secure configuration sources.

## Resilience
- Apply retries, exponential backoff, and cancellation semantics to network or IO calls where appropriate.
- Normalize external responses and map them onto domain-specific error types before propagating them through the app.
