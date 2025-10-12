---
applyTo: '**/*.ts,**/*.js,**/*.json,**/*.spec.ts,**/*.e2e-spec.ts'
---

# NestJS Performance & Reliability

## Performance
- Cache expensive responses using interceptors or backing stores like Redis when reads vastly outnumber writes.
- Optimize database access with indexes, pagination, and selective field projection.

## Resilience
- Use interceptors or providers to add retries/backoff when calling external services.
- Monitor memory usage and event listener lifecycles to avoid leaks in long-lived services.
