---
applyTo: 'apps/**/app/**/*.{ts,tsx,js,jsx}'
---

# Next.js Implementation Workflow

Follow this checklist when building or refactoring features:

1. Outline the component hierarchy and decide which parts must be Client Components.
2. Define shared types and interfaces in `types/` or colocated files before writing implementation code.
3. Implement server-side logic (data fetching, actions, validations) and exercise it with unit tests where practical.
4. Build client components that consume the server outputs, keeping client scope as small as possible.
5. Add explicit error boundaries and loading states to support resilient navigation.
6. Coordinate with the Tailwind modules to deliver responsive styling that matches the design system.
7. Verify data flows with optimistic updates or suspense transitions where appropriate.
8. Write automated tests (unit, integration, and/or Playwright) that capture the newly added behavior.
