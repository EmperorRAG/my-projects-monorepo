---
applyTo: '**'
---

# Next.js Instruction Module Index

This file serves as an index for the modular Next.js guidance located in `.github/instructions/nextjs`. Each module defines its own `applyTo` pattern so that the assistant only loads the guidance relevant to the files being edited.

## Module Directory
- `nextjs-structure.instructions.md` — Applies to `apps/**/app/**` and explains directory layout, route grouping, and feature organization.
- `nextjs-components.instructions.md` — Applies to `apps/**/app/**/*.{tsx,jsx}` and covers Server/Client component separation, colocation, and props discipline.
- `nextjs-naming.instructions.md` — Applies to `apps/**/app/**/*.{ts,tsx,js,jsx}` and documents naming conventions for files, symbols, and assets.
- `nextjs-api-routes.instructions.md` — Applies to `apps/**/app/api/**/*.ts` and outlines expectations for Route Handlers, validation, and error reporting.
- `nextjs-general-practices.instructions.md` — Applies to `apps/**/app/**/*.{ts,tsx,js,jsx}` and reinforces testing, security, performance, and documentation habits.
- `nextjs-sample-files.instructions.md` — Applies to `apps/**/app/**/*.{tsx,jsx}` and reminds contributors to avoid committing demo-only components.
- `nextjs-docs-sourcing.instructions.md` — Applies to `apps/**/app/**` and directs contributors to confirm official documentation before adopting new patterns.
- `nextjs-state-management.instructions.md` — Applies to `apps/**/app/**/*.{ts,tsx,js,jsx}` and explains how to split server and client state responsibly.
- `nextjs-data-fetching.instructions.md` — Applies to `apps/**/app/**/*.{ts,tsx}` and covers streaming, caching, error handling, and revalidation.
- `nextjs-implementation-workflow.instructions.md` — Applies to `apps/**/app/**/*.{ts,tsx,js,jsx}` and provides a step-by-step build checklist.

Update this index whenever you add or retire module files so teams can navigate the instruction set quickly.
