import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../app/app.module';
import { nanoid } from 'nanoid';

describe(`Link`, () => {
	let app: INestApplication;
	let httpServer: any;
	const badMethods = [`put`, `patch`, `delete`];
	const longUrl = `https://www.google.com/`;
	let slug: string;
	const invalidSlugs = [
		// Too short
		nanoid(9),
		// Too long
		nanoid(12),
		// Symbols
		`!@#$%^&*()!@#`,
	];

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleRef.createNestApplication();
		await app.init();

		httpServer = app.getHttpServer();
	});

	it(`Handles 404`, async () => {
		await request(httpServer).get(`/api/v1/test`).expect(404);
	});

	badMethods.forEach((method) => {
		it(`Handles method not allowed ${method.toUpperCase()}`, async () => {
			await request(httpServer)[method](`/api/v1/link`).expect(405);
		});
	});

	it(`Handles invalid longUrl`, async () => {
		await request(httpServer)
			.post(`/api/v1/link`)
			.send({
				longUrl: `google`,
			})
			.expect(400);
	});

	it(`Creates and returns a shortened url if longUrl is valid`, async () => {
		const res = await request(httpServer)
			.post(`/api/v1/link`)
			.send({
				longUrl,
			})
			.expect(201);
		const { shortUrl } = res.body;
		slug = shortUrl.slice(shortUrl.lastIndexOf(`/`) + 1);

		expect(slug).toHaveLength(11);
		expect(slug).toMatch(/([a-z]|_|-)/i);
	});

	invalidSlugs.forEach((slug) => {
		it(`Handles invalid slug ${slug}`, async () => {
			await request(httpServer).post(`/api/v1/link/${slug}`).expect(400);
		});
	});

	it(`Passes with valid slug`, async () => {
		const res = await request(httpServer)
			.post(`/api/v1/link/${slug}`)
			.expect(302);

		expect(res.headers.location).toBe(longUrl);
	});

	afterAll(async () => {
		await app.close();
	});
});
