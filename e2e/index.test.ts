import { expect, test } from '@playwright/test';

test(`app`, async ({ page }) => {
	await page.goto(`/`);

	const longUrl = `https://www.google.com`;
	const shortUrl = `http://localhost:3000/`;
	const input = await page.locator(
		`#shorten-url-form input[name="long-url"]`,
	);

	await input.type(longUrl);

	expect(await input.inputValue()).toContain(longUrl);

	const button = await page.locator(
		`#shorten-url-form button[type="submit"]`,
	);

	expect(await button.innerText()).toMatch(/shorten/i);

	await button.click();

	const shortUrlAnchor = await page.locator(
		`.short-url-container a.short-url`,
	);

	expect(await shortUrlAnchor.innerText()).toContain(shortUrl);
	expect(await shortUrlAnchor.getAttribute(`href`)).toContain(shortUrl);

	await page.$eval(`a.short-url`, (el) => el.removeAttribute(`target`));

	await shortUrlAnchor.click();

	expect(page.url()).toContain(longUrl);
});
