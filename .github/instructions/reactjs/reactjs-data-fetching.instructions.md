---
applyTo: 'apps/**/*.{tsx,jsx,ts,js},libs/**/*.{tsx,jsx,ts,js}'
---

# React Data Fetching

## Patterns

-   Use modern data libraries (React Query, SWR, Apollo) to manage caching, retries, and background refresh.
-   Provide explicit loading, empty, and error states for each fetch to keep UX predictable.

## Reliability

-   Cancel in-flight requests when components unmount or dependencies change to avoid state updates after teardown.
-   Implement optimistic updates carefully and reconcile with server results to prevent visual drift.
