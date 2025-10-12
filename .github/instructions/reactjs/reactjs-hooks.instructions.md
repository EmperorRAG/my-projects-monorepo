---
applyTo: '**/*.{tsx,jsx,ts,js}'
---

# React Hooks & Effects

## Usage Rules
- Call hooks at the top level of functional components or custom hooks; never inside conditionals or loops.
- Provide accurate dependency arrays for `useEffect`, `useMemo`, and `useCallback` to prevent stale closures and infinite loops.

## Cleanup & Performance
- Return cleanup functions from effects to avoid memory leaks, especially when subscribing to external resources.
- Memoize expensive computations or stable callbacks only when profiling shows re-render pressure.
