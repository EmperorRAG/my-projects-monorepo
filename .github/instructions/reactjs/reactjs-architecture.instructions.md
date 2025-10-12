---
applyTo: '**/*.{tsx,jsx,ts,js}'
---

# React Architecture & Composition

## Structural Patterns
- Favor functional components with hooks; reserve classes only when a legacy area requires them.
- Organize components by feature or domain to keep the tree scalable and discoverable.
- Separate presentational and container responsibilities so rendering logic stays simple.

## Reuse
- Use component composition over inheritance; design reusable primitives that can be assembled into complex views.
- Extract shared stateful logic into custom hooks to avoid duplication across features.
