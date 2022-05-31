import {
	Controller,
	Get,
	Param,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { LinkService } from './link.service';
import { GetLinkDto } from './dtos/get-link.dto';

@Controller(`/api/v1/link`)
@UsePipes(
	new ValidationPipe({
		transform: true,
	}),
)
export class LinkController {
	constructor(private readonly linkService: LinkService) {}

	@Get()
	getLink(): { message: string } {
		return this.linkService.getLink();
	}

	@Post(`:slug`)
	redirect(@Param() params: GetLinkDto) {
		return {
			message: `Hello world!`,
		};
	}
}
