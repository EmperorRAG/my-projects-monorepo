---
applyTo: '**/*.ts'
---

# TypeScript Testing & Performance

## Testing
- Add or update unit tests using the project's preferred framework and naming conventions.
- Expand integration or end-to-end coverage when behavior crosses module boundaries or platform APIs.
- Avoid brittle timing assertions; rely on fake timers or injected clocks when necessary.

## Performance & Reliability
- Lazy-load heavy dependencies and dispose of them when no longer needed.
- Defer expensive work until users demand it, and batch or debounce high-frequency events to reduce thrash.
- Track resource lifetimes to prevent leaks in long-running processes.
