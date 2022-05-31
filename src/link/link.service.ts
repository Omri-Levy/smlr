import { Injectable } from '@nestjs/common';

@Injectable()
export class LinkService {
	getLink(): { message: string } {
		return { message: `Hello World!!` };
	}
}
