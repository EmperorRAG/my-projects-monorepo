---
applyTo: '**/*.ts'
---

# TypeScript Security Practices

## Input Handling
- Validate and sanitize external inputs using schema validators or well-documented type guards.
- Avoid dynamic code execution and untrusted template rendering.

## Data Protection
- Encode untrusted content before rendering HTML; rely on framework escaping or trusted types.
- Use parameterized queries or prepared statements when executing database calls.
- Keep secrets in secure storage, rotate them regularly, and request least-privilege scopes.

## Defensive Coding
- Favor immutable data flows and defensive copies for sensitive information.
- Use vetted cryptographic libraries only, and stay current with dependency advisories.
