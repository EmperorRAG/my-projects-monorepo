---
applyTo: 'apps/**/app/**/*.{tsx,jsx}'
---

# Next.js Component Practices

## Component Types
- Treat files as Server Components by default; add `'use client'` only when browser-only APIs or interactive state is required.
- Wrap all client-only behavior inside dedicated Client Components and import them into Server Components instead of using `next/dynamic` with `ssr: false`.

## Composition Patterns
- Decompose complex client experiences into a single Client Component that manages its interactive children.
- Prefer smaller, reusable components when a UI pattern appears more than once or contains intricate logic.

## File Organization
- Store shared UI inside `components/` and place route-specific components beside their routes.
- Keep component tests adjacent to implementations (for example `ComponentName.test.tsx`).

## Prop Hygiene
- Define props with explicit TypeScript interfaces and provide sensible defaults when optional.
- Pass only the data a component needs; avoid leaking large objects through the tree.
