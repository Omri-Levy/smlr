require(`dotenv/config`);

// @ts-check

/** @type {import("@playwright/test").PlaywrightTestConfig} */
const config = {
	webServer: {
		command: `pnpm start:dev`,
		url: `http://localhost:3000`,
		timeout: 120 * 1000,
		reuseExistingServer: !process.env.CI,
	},
	use: {
		headless: true,
		viewport: { width: 600, height: 900 },
		ignoreHTTPSErrors: true,
		video: `on-first-retry`,
		baseURL: `http://localhost:3000`,
	},
	testDir: `e2e`,
};

module.exports = config;
