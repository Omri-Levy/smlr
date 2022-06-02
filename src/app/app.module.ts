import { LinkModule } from '../link/link.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
	imports: [
		ThrottlerModule.forRoot(
			process.env.NODE_ENV === `test` || process.env.CI
				? {}
				: {
						ttl: 1,
						limit: 3,
				  },
		),
		ConfigModule.forRoot(),
		TypeOrmModule.forRoot({
			type: process.env.CI ? `sqlite` : `mysql`,
			host:
				process.env.NODE_ENV === `test`
					? `localhost`
					: process.env.MYSQL_HOST,
			port: Number(process.env.MYSQL_PORT),
			username: process.env.MYSQL_USER,
			password: process.env.MYSQL_PASSWORD,
			database: process.env.CI
				? `:memory`
				: process.env.NODE_ENV === `test`
				? `link-shortener-test`
				: process.env.MYSQL_DATABASE,
			entities: [__dirname + `/../**/*.entity.{js,ts}`],
			synchronize: process.env.NODE_ENV !== `production`,
			dropSchema: process.env.NODE_ENV === `test` || !!process.env.CI,
		}),
		LinkModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
	],
})
export class AppModule {}
