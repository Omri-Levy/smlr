import { test } from '@playwright/test';

test(`It navigates to /`, async ({ page }) => {
	await page.goto(`/`);

	// // The new page should contain an h1 with "About Page"
	// await expect(page.locator('h1')).toContainText('About Me')
});
