---
applyTo: '**/*.ts,**/*.js,**/*.json,**/*.spec.ts,**/*.e2e-spec.ts'
---

# NestJS Common Pitfalls

- Avoid circular module dependencies by extracting shared pieces into separate modules.
- Keep controllers thin and never instantiate services manually when DI can supply them.
- Validate every incoming payload; skipping validation invites runtime errors and security issues.
- Use async/await for I/O to prevent blocking the event loop and leaking resources.
- Dispose of subscriptions or intervals so long-running processes do not accumulate listeners.
