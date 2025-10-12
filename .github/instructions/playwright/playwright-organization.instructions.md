---
applyTo: 'apps/**/*-e2e/**/*.spec.ts,services/**/*-e2e/**/*.spec.ts'
---

# Playwright File Organization

## Placement & Naming

-   Store Playwright specs under the dedicated e2e project (for example `apps/my-programs-app-e2e/src`).
-   Name spec files after the feature they cover: `<feature>.spec.ts` (e.g., `login.spec.ts`, `movies-search.spec.ts`).

## Scope Discipline

-   Aim for one major feature or page per file to keep suites focused and fast.
-   Co-locate helper utilities or page objects nearby (e.g., `pages/` or `fixtures/`) to promote reuse without large imports.

## Test Data

-   Keep deterministic fixtures inside the repository; avoid pulling remote test data during runs.
