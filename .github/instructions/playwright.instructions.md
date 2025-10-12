---
description: 'Playwright test generation instructions'
applyTo: 'apps/**/*-e2e/**/*.spec.ts,services/**/*-e2e/**/*.spec.ts'
---

# Playwright Instruction Module Index

Playwright-specific guidance lives under `.github/instructions/playwright`. Each module declares its own `applyTo` scope so only the relevant advice loads while you write tests.

## Module Directory

-   `playwright-code-quality.instructions.md` — Locator selection, assertion discipline, and timing guidance.
-   `playwright-structure.instructions.md` — Test.describe organization, hooks, and example layouts.
-   `playwright-organization.instructions.md` — File naming, placement, and helper colocation.
-   `playwright-assertions.instructions.md` — Recommended expectation patterns for content, navigation, and accessibility.
-   `playwright-execution.instructions.md` — Execution workflow, debugging practices, and reporting tips.
-   `playwright-checklist.instructions.md` — Pre-commit checklist for resilient, deterministic specs.

Add new Playwright modules to this directory and update the index when additional guidance is created.
