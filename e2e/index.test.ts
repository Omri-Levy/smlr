import { expect, test } from '@playwright/test';

test(`index`, async ({ page }) => {
	await page.goto(`/`);

	const longUrl = `https://www.google.com`;
	const shortUrl = page.url();

	/* The submit button should render with the expected text */
	const button = await page.locator(`button[type="submit"]`);

	expect(await button.textContent()).toMatch(/shorten/i);

	await button.click();

	await page.waitForTimeout(1000);

	/* Renders invalid url error */
	let error = await page.locator(`.error`);

	expect(await error.textContent()).toMatch(
		/please\sprovide\sa\svalid\surl\s\(400\)/i,
	);

	const input = await page.locator(`input[name="long-url"]`);

	await input.click();
	await input.fill(longUrl);

	expect(await input.inputValue()).toContain(longUrl);

	await button.click();

	await page.waitForTimeout(1000);

	/* Renders you are not a robot */
	expect(await error.textContent()).toMatch(
		/please\sverify\sthat\syou\sare\snot\sa\srobot\s\(400\)/i,
	);

	/* Do the recaptcha */
	await page
		.frameLocator(`iframe[role="presentation"]`)
		.locator(`span[role="checkbox"]`)
		.click();

	await page.waitForTimeout(1000);

	await button.click();

	await page.waitForTimeout(1000);

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

	/* Renders invalid slug error */
	error = await page.locator(`pre`);

	await page.goto(`/test`);

	expect(await error.textContent()).toMatch(
		/please\sprovide\sa\sslug\sof\s7\scharacter\(s\)/i,
	);

	await page.waitForTimeout(1000);

	/* Renders url not found error */
	await page.goto(`/testtes`);

	expect(await error.textContent()).toMatch(/url\swas\snot\sfound/i);
});
