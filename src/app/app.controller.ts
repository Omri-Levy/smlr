import { Controller, Get, Render, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	/**
	 * Temporary workaround for Postman and Swagger UI. Will do something more secure later.
	 * @param req
	 */
	@Get(`${process.env.API_URL}/csrf`)
	@ApiOkResponse({
		description: `Sends a CSRF token to be consumed by Postman and Swagger UI`,
		schema: {
			example: {
				data: {
					csrfToken: `token`,
				},
			},
		},
	})
	getCsrfToken(@Req() req) {
		return {
			data: {
				csrfToken: req.csrfToken(),
			},
		};
	}

	@SkipThrottle()
	@Get()
	@Render(`index`)
	@ApiOkResponse({ description: `Serves the index view` })
	renderIndex(@Req() req) {
		return {
			error: ``,
			csrfToken: req.csrfToken(),
			recaptchaSiteKey:
				process.env.NODE_ENV === `test` || process.env.CI
					? process.env.RECAPTCHA_TEST_SITE_KEY
					: process.env.RECAPTCHA_SITE_KEY,
		};
	}
}
