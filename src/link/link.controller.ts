import {
	Body,
	Controller,
	Param,
	Post,
	Res,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { LinkService } from './link.service';
import { GetLinkDto } from './dtos/get-link.dto';
import { CreateLinkDto } from './dtos/create-link.dto';

@Controller(`/api/v1/link`)
@UsePipes(
	new ValidationPipe({
		transform: true,
	}),
)
export class LinkController {
	constructor(private readonly linkService: LinkService) {}

	@Post()
	createLink(@Body() createLinkDto: CreateLinkDto) {
		return this.linkService.createLink(createLinkDto);
	}

	@Post(`:slug`)
	redirect(@Param() params: GetLinkDto, @Res() res) {
		const longUrl = this.linkService.getLink(params);

		return res.redirect(longUrl);
	}
}
