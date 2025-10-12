---
applyTo: 'apps/**/*-e2e/**/*.spec.ts,services/**/*-e2e/**/*.spec.ts'
---

# Playwright Test Structure

## Describe Blocks & Hooks

-   Group related scenarios with `test.describe()` and establish shared setup in `beforeEach` (for example navigating to entry pages).
-   Keep hook logic minimal—delegate heavy lifting to helper functions so tests remain readable.

## Test Naming

-   Name tests using the pattern `Feature - outcome` so reports are scannable (e.g., `Checkout - applies discount code`).
-   Prefer active, user-centric wording that explains the goal of the scenario.

## Sample Layout

```ts
import {
	test,
	expect,
} from '@playwright/test';

test.describe('Movie Search', () => {
	test.beforeEach(
		async ({
			page,
		}) => {
			await page.goto(
				'https://debs-obrien.github.io/playwright-movies-app'
			);
		}
	);

	test('Search - returns Garfield result', async ({
		page,
	}) => {
		await test.step('Submit search term', async () => {
			await page
				.getByRole(
					'textbox',
					{
						name: 'Search Input',
					}
				)
				.fill(
					'Garfield'
				);
			await page.keyboard.press(
				'Enter'
			);
		});

		await test.step('Validate primary result', async () => {
			await expect(
				page.getByRole(
					'heading',
					{
						name: 'Garfield',
					}
				)
			).toBeVisible();
		});
	});
});
```
