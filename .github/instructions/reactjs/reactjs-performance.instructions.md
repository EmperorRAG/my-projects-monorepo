---
applyTo: 'apps/**/*.{tsx,jsx,ts,js},libs/**/*.{tsx,jsx,ts,js}'
---

# React Performance Optimization

## Rendering

-   Use `React.memo` for pure components that receive stable props and show profiling evidence of wasted renders.
-   Split bundles with `React.lazy` and `Suspense` to reduce initial load time.

## Data Handling

-   Virtualize large lists and paginate heavy datasets to keep DOM size manageable.
-   Profile components with React DevTools to identify bottlenecks before optimizing.
