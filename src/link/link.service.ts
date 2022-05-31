import { Injectable } from '@nestjs/common';
import { GetLinkDto } from './dtos/get-link.dto';
import { nanoid } from 'nanoid';
import { CreateLinkDto } from './dtos/create-link.dto';

@Injectable()
export class LinkService {
	getLink(getLinkDto: GetLinkDto) {
		return `https://www.google.com/`;
	}

	createLink(createLinkDto: CreateLinkDto) {
		return {
			shortUrl: `http://localhost:3000/${nanoid(11)}`,
		};
	}
}
