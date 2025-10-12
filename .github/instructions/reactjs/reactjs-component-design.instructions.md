---
applyTo: 'apps/**/*.{tsx,jsx},libs/**/*.{tsx,jsx}'
---

# React Component Design

## Responsibilities

-   Keep components focused on a single concern and compose them for complex flows.
-   Use descriptive, consistent naming; document props with concise comments when behavior is non-obvious.

## Props & Reuse

-   Validate props with TypeScript or PropTypes so consumers understand required inputs.
-   Supply sensible defaults and avoid passing unnecessary object graphs through the tree.
-   Design components for testability by exposing deterministic inputs and outputs.
