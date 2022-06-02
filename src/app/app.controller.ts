import { Controller, Get, Render, Req } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	@Render(`index`)
	renderIndex(@Req() req) {
		return { csrfToken: req.csrfToken() };
	}
}
