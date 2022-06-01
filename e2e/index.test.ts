import { test } from '@playwright/test';

test(`It navigates to /`, async ({ page }) => {
	await page.goto(`/`);

	// The page title should render
	// await expect(page.locator(`h1`)).toContainText(/link-shortener/i);
});
