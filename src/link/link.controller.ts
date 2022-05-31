import { Controller, Get } from '@nestjs/common';
import { LinkService } from './link.service';

@Controller(`/api/v1/link`)
export class LinkController {
	constructor(private readonly linkService: LinkService) {}

	@Get()
	getLink(): { message: string } {
		return this.linkService.getLink();
	}
}
