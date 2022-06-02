import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { resolve } from 'path';
import { AppModule } from './app/app.module';
import * as csurf from 'csurf';
import * as cookieParser from 'cookie-parser';

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

	app.use(helmet());
	app.use(cookieParser());
	app.use(csurf({ cookie: true }));

	await app.listen(3000);
}

bootstrap();
