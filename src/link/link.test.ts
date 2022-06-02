import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { Link } from './link.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppModule } from '../app/app.module';

describe(`Link`, () => {
	let slug: string;
	let app: INestApplication;
	let httpServer: any;
	let linkRepository: Repository<Link>;
	const badMethods = [`put`, `patch`, `delete`];
	const longUrl = `https://www.google.com/`;

	const LINK_REPOSITORY_TOKEN = getRepositoryToken(Link);
	const invalidSlugs = [
		// Too short
		nanoid(6),
		// Too long
		nanoid(8),
		// Symbols
		`!@#$%^&*()!@#`,
	];

	beforeAll(async () => {
		const moduleRef: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleRef.createNestApplication();
		await app.init();

		httpServer = app.getHttpServer();
		linkRepository = moduleRef.get(LINK_REPOSITORY_TOKEN);
	});

	it(`Handles 404`, async () => {
		await request(httpServer).get(`/test/test`).expect(404);
	});

	badMethods.forEach((method) => {
		it(`Handles method not allowed ${method.toUpperCase()}`, async () => {
			await request(httpServer)[method](`/`).expect(405);
		});
	});

	it(`Handles invalid longUrl`, async () => {
		await request(httpServer)
			.post(`/`)
			.send({
				longUrl: `google`,
			})
			.expect(400);

		const newLink = await linkRepository.findOne({
			where: { longUrl: `google` },
		});

		expect(newLink).toBeNull();
	});

	it(`Creates and returns a shortened url if longUrl is valid`, async () => {
		const {
			body: {
				data: { shortUrl },
			},
		} = await request(httpServer)
			.post(`/`)
			.send({
				longUrl,
			})
			.expect(201);
		slug = shortUrl.slice(shortUrl.lastIndexOf(`/`) + 1);

		expect(slug).toHaveLength(7);
		expect(slug).toMatch(/([a-z]|_|-)+/i);

		const newLink = await linkRepository.findOne({
			where: { longUrl },
			select: [`longUrl`, `slug`],
		});

		expect(newLink).toEqual({
			slug,
			longUrl,
		});
	});

	invalidSlugs.forEach((slug) => {
		it(`Handles invalid slug ${slug}`, async () => {
			await request(httpServer).get(`/${slug}`).expect(400);
		});
	});

	it(`Passes with valid slug`, async () => {
		const {
			headers: { location },
		} = await request(httpServer).get(`/${slug}`).expect(302);
		expect(location).toBe(longUrl);
	});

	afterAll(async () => {
		await app.close();
	});
});
