import { Controller, Get, Render, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	/**
	 * Temporary workaround for Postman and Swagger UI. Will do something more secure later.
	 * @param req
	 */
	@Get(`/api/v1/csrf`)
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

	@Get()
	@Render(`index`)
	@ApiOkResponse({ description: `Serves the index view` })
	renderIndex(@Req() req) {
		return {
			csrfToken: req.csrfToken(),
		};
	}
}
