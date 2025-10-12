---
applyTo: 'apps/**/app/**/*.{ts,tsx}'
---

# Next.js Data Fetching Guidance

## Server Components
- Execute database and API queries inside Server Components or dedicated libraries so results render on the server by default.
- Use streaming and Suspense boundaries to parallelize expensive calls and keep above-the-fold content fast.

## Error and Retry Strategy
- Wrap fetches with error handling that converts failures into typed results; surface meaningful fallbacks in `error.tsx` boundaries.
- Apply retry logic (with exponential backoff) to transient failures, and log persistent errors for observability.

## Caching and Revalidation
- Leverage `fetch` cache options (`cache`, `next.revalidate`) or `revalidatePath`/`revalidateTag` to control staleness.
- Document cache invalidation triggers alongside the route to prevent outdated data from lingering.
