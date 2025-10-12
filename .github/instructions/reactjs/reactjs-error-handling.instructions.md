---
applyTo: '**/*.{tsx,jsx,ts,js}'
---

# React Error Handling

## Boundaries
- Wrap critical sections with Error Boundaries to catch render-time failures and display fallback UI.
- Log captured errors through the application's telemetry pipeline for triage.

## Async Failures
- Handle asynchronous errors in effects and event handlers with try/catch blocks; surface user-friendly messages when actions fail.
- Provide meaningful fallback UI or recovery actions instead of silent failures.
