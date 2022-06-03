import { expect, test } from '@playwright/test';

test(`app`, async ({ page }) => {
	await page.goto(`/`);

	const longUrl = `https://www.google.com`;
	const shortUrl = `http://localhost:3000/`;
	const input = await page.locator(`input[name="long-url"]`);

	await input.click();
	await input.fill(longUrl);

	expect(await input.inputValue()).toContain(longUrl);

	/* Do the recaptcha */
	await page
		.frameLocator(`iframe[role="presentation"]`)
		.locator(`span[role="checkbox"]`)
		.click();

	await page.waitForTimeout(1000);

	/* The submit button should render with the expected text */
	const button = await page.locator(`button[type="submit"]`);

	expect(await button.textContent()).toMatch(/shorten/i);

	await button.click();

	/* Test that the shortened link is present and that it has the expected values. */
	const shortUrlAnchor = await page.locator(
		`.short-url-container a.short-url`,
	);

	expect(await shortUrlAnchor.innerText()).toContain(shortUrl);
	expect(await shortUrlAnchor.getAttribute(`href`)).toContain(shortUrl);

	/* Clicking the link should navigate to the expected url */
	await page.$eval(`.short-url-container a.short-url`, (el) =>
		el.removeAttribute(`target`),
	);

	await shortUrlAnchor.click();

	expect(page.url()).toContain(longUrl);
});
