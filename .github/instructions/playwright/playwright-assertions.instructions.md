---
applyTo: '**/*.spec.ts'
---

# Playwright Assertions

## Accessibility Checks
- Use `toMatchAriaSnapshot` or role-based assertions when validating large UI regions to confirm both structure and accessible names.

## Counts & Collections
- Leverage `toHaveCount` for lists or tables instead of manual length checks, since Playwright auto-retries until the expectation is stable.

## Navigation & URLs
- After navigational actions, assert using `await expect(page).toHaveURL(expected)` to verify routing rather than checking `page.url()` directly.

## Text & Content
- Prefer `toHaveText`/`toContainText` for textual content and pass `useInnerText: true` only when styling keeps accessible names separate from visible text.
