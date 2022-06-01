import { Injectable } from '@nestjs/common';
import { GetLinkDto } from './dtos/get-link.dto';
import { CreateLinkDto } from './dtos/create-link.dto';
import { nanoid } from 'nanoid';
import { Repository } from 'typeorm';
import { Link } from './link.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LinkService {
	constructor(
		@InjectRepository(Link)
		private linkRepository: Repository<Link>,
	) {}

	async getLink({ slug }: GetLinkDto) {
		const link = await this.linkRepository.findOne({
			where: {
				slug,
			},
			select: [`longUrl`],
		});

		return link?.longUrl;
	}

	async createLink({ longUrl }: CreateLinkDto) {
		const BASE_URL = `http://localhost:3000`;
		const link = await this.linkRepository.findOne({
			where: {
				longUrl,
			},
			select: [`slug`],
		});

		if (link) {
			return `${BASE_URL}/${link.slug}`;
		}

		const newLink = await this.linkRepository.save({
			longUrl,
			slug: nanoid(7),
		});

		return `${BASE_URL}/${newLink.slug}`;
	}
}
