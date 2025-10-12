---
applyTo: 'apps/**/app/**/*.{ts,tsx,js,jsx}'
---

# Next.js Naming Conventions

## Files and Folders
- Use `kebab-case` for folders such as `user-profile/`.
- Name React components and their files with `PascalCase`, and export hooks or utilities with `camelCase` filenames when appropriate.
- Keep static assets in `kebab-case` (for example `logo_dark.svg`).

## Symbols
- Declare variables and functions in `camelCase`.
- Name types and interfaces with `PascalCase` and constants with `UPPER_SNAKE_CASE`.
- Align file names with their default exports to reduce lookup time.
