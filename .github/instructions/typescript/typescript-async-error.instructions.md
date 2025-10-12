---
applyTo: '**/*.ts'
---

# TypeScript Async & Error Handling

## Async Patterns
- Use `async/await` for asynchronous flows; guard each await with appropriate error handling.
- Handle edge cases early to avoid deep nesting and to make failure paths obvious.

## Error Reporting
- Wrap awaits in `try/catch` blocks that create structured errors; pass them through the project's logging or telemetry utilities.
- Surface user-facing errors with the repository's established notification pattern rather than ad-hoc console output.
- Debounce configuration-driven updates and dispose of resources deterministically when the API provides lifecycle hooks.
