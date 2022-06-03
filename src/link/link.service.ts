import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { GetLinkDto } from './dtos/get-link.dto';
import { CreateLinkDto } from './dtos/create-link.dto';
import { nanoid } from 'nanoid';
import { FindOneOptions, Repository } from 'typeorm';
import { Link } from './link.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';

@Injectable()
export class LinkService {
	constructor(
		@InjectRepository(Link)
		private linkRepository: Repository<Link>,
		@Inject(CACHE_MANAGER)
		private cacheManager: Cache,
	) {}

	async getLink({ slug }: GetLinkDto) {
		const query: FindOneOptions<Link> = {
			where: {
				slug,
			},
			select: [`longUrl`],
		};
		const cacheKey = JSON.stringify(query);

		/**
		 * Allows caching of the query result, and cache bust if the query or slug changes. Could easily include order, offset, userId, etc.
		 */
		const cachedLongUrl: string | undefined = await this.cacheManager.get(
			cacheKey,
		);

		if (cachedLongUrl) {
			return cachedLongUrl;
		}

		/* The query changed, clean the cache. */
		await this.cacheManager.reset();

		const link = await this.linkRepository.findOne(query);

		if (link) {
			await this.cacheManager.set(cacheKey, link?.longUrl);
		}

		return link?.longUrl;
	}

	async createLink({ longUrl }: CreateLinkDto) {
		/**
		 * See if the query is in cache, if so, return the cached value
		 */
		const query: FindOneOptions<Link> = {
			where: {
				longUrl,
			},
			select: [`slug`],
		};
		const cacheKey = JSON.stringify(query);
		const BASE_URL = `http://localhost:3000`;
		const cachedSlug: string | undefined = await this.cacheManager.get(
			cacheKey,
		);

		if (cachedSlug) {
			return `${BASE_URL}/${cachedSlug}`;
		}

		/* The query changed, clean the cache. */
		await this.cacheManager.reset();

		/**
		 * Create the link if it doesn't exist, then cache the query.
		 */
		let link = await this.linkRepository.findOne(query);

		if (!link) {
			link = await this.linkRepository.save({
				longUrl,
				slug: nanoid(7),
			});
		}

		await this.cacheManager.set(cacheKey, link?.slug);

		return `${BASE_URL}/${link?.slug}`;
	}
}
