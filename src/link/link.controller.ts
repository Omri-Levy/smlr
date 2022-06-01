import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Res,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { LinkService } from './link.service';
import { GetLinkDto } from './dtos/get-link.dto';
import { CreateLinkDto } from './dtos/create-link.dto';

@Controller()
@UsePipes(
	new ValidationPipe({
		transform: true,
	}),
)
export class LinkController {
	constructor(private readonly linkService: LinkService) {}

	@Post()
	async createLink(@Body() createLinkDto: CreateLinkDto) {
		const shortUrl = await this.linkService.createLink(createLinkDto);

		return {
			data: {
				shortUrl,
			},
		};
	}

	@Get(`:slug`)
	async redirect(@Param() params: GetLinkDto, @Res() res) {
		const longUrl = await this.linkService.getLink(params);

		return res.redirect(longUrl);
	}
}
