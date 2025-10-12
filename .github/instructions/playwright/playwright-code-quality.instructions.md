---
applyTo: '**/*.spec.ts'
---

# Playwright Code Quality Standards

## Locators
- Prefer user-facing locators such as `getByRole`, `getByLabel`, or `getByText` to stay resilient and accessible.
- Avoid brittle selectors (e.g., generated CSS classes) unless there is no stable alternative.

## Assertions
- Use Playwright's web-first assertions (prefixed with `await expect(...)`) so timing is handled automatically.
- Reserve `expect(locator).toBeVisible()` for transitions you explicitly validate and favor semantic checks such as `toHaveText`.

## Timeouts & Waits
- Rely on Playwright's auto-waiting behavior; never add fixed `waitForTimeout` pauses unless you have documented justification.
- When necessary, adjust per-step timeouts via options instead of changing global defaults.

## Test Narration
- Wrap multi-step flows inside `test.step()` to produce readable reports and clarify the intent of each phase.
- Keep comments focused on rationale when behavior is non-obvious rather than restating the code.
