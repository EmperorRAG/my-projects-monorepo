---
applyTo: '**/*.spec.ts'
---

# Playwright Quality Checklist

Before committing a spec:
- [ ] Locators are resilient, accessible, and avoid strict mode violations.
- [ ] Tests are grouped with clear `test.describe` blocks and meaningful titles.
- [ ] Assertions rely on Playwright's auto-retrying expectations.
- [ ] No hard-coded sleeps or unnecessary global timeout increases remain.
- [ ] Test data and helpers are deterministic and cleaned up between runs.
