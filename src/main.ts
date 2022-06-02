import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { resolve } from 'path';
import { AppModule } from './app/app.module';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	app.use(helmet());

	app.useStaticAssets(resolve(`./src/public`));
	app.setBaseViewsDir(resolve(`./src/views`));
	app.setViewEngine(`ejs`);

	await app.listen(3000);
}

bootstrap();
