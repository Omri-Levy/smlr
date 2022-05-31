import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../app/app.module';

describe(`Link`, () => {
	let app: INestApplication;
	let httpServer: any;

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

	const badMethods = [`put`, `patch`, `delete`];

	badMethods.forEach((method) => {
		it(`Handles method not allowed ${method.toUpperCase()}`, async () => {
			await request(httpServer)[method](`/api/v1/link`).expect(405);
		});
	});

	afterAll(async () => {
		await app.close();
	});
});
