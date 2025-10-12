---
applyTo: 'apps/**/*-e2e/**/*.spec.ts,services/**/*-e2e/**/*.spec.ts'
---

# Playwright Execution Strategy

## Running Suites

-   Use `npx playwright test --project=chromium` for the default workflow and add `--headed` or `--debug` only when investigating failures.
-   Capture trace artifacts (`--trace on`) when debugging flaky runs and commit configuration updates to share fixes.

## Iteration Loop

-   Reproduce failures locally before editing tests, then refine locators or expectations rather than bumping timeouts.
-   Keep CI runs deterministic by avoiding reliance on ambient state (e.g., browser storage) between tests.

## Reporting

-   Review HTML reports and trace viewers to confirm that each `test.step` reads like a user journey.
-   Document discovered app issues separately from test bugs to maintain a clean backlog.
