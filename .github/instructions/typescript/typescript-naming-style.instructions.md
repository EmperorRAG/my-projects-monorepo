---
applyTo: '**/*.ts'
---

# TypeScript Naming & Style

## Symbols
- Use PascalCase for classes, interfaces, enums, and type aliases.
- Use camelCase for variables, functions, and parameters; skip interface prefixes such as `I`.
- Choose names that reflect behavior or domain meaning rather than implementation details.

## Formatting
- Match the workspace formatting rules (indentation, quotes, trailing commas) and run the lint/format script before submitting changes.
- Keep functions focused; extract helpers when branches or responsibilities grow.
- Favor immutable data structures and pure helper functions where practical.
