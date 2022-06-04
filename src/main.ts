import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { resolve } from 'path';
import { AppModule } from './app/app.module';
import * as csurf from 'csurf';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		bodyParser: true,
		cors: {
			origin: process.env.CORS_ORIGIN,
		},
	});

	app.useStaticAssets(resolve(`./src/public`));
	app.setBaseViewsDir(resolve(`./src/views`));
	app.setViewEngine(`ejs`);

	app.use(
		helmet({
			contentSecurityPolicy: {
				directives: {
					'script-src': [
						`'self'`,
						`https://www.google.com/recaptcha/`,
						`https://www.gstatic.com/recaptcha/`,
					],
					'frame-src': [
						`https://www.google.com/recaptcha/`,
						`https://recaptcha.google.com/recaptcha/`,
					],
				},
			},
		}),
	);
	app.use(cookieParser());
	app.use(
		csurf({
			cookie: {
				sameSite: `strict`,
				secure: process.env.NODE_ENV === `production`,
				httpOnly: true,
				maxAge: 1000 * 60 * 60 * 9, // 9 hours
			},
		}),
	);

	const config = new DocumentBuilder()
		.setTitle(`Link shortener`)
		.setDescription(
			`An API to make a simple idea as feature complete as I currently can.`,
		)
		.setVersion(`1.0`)
		.addTag(`link shortener`)
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup(`docs`, app, document, {
		swaggerOptions: {
			requestInterceptor: async (req) => {
				const res = await fetch(`${process.env.API_URL}/csrf`);
				const { data } = await res.json();
				const csrfToken = data?.csrfToken;

				req.headers[`XSRF-TOKEN`] = csrfToken;

				return req;
			},
		},
	});

	await app.listen(3000);
}

bootstrap();
