import type { ClientOpts } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { LinkModule } from '../link/link.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Module({
	imports: [
		CacheModule.register<ClientOpts>({
			/* As long as the query is the same */
			ttl: 0,
			store: process.env.CI ? undefined : redisStore,
			host: process.env.REDIS_HOST,
			port: Number(process.env.REDIS_PORT),
			isGlobal: true,
		}),
		ThrottlerModule.forRoot(
			process.env.NODE_ENV === `test` || process.env.CI
				? {}
				: {
						ttl: 1,
						limit: 3,
				  },
		),
		ConfigModule.forRoot(),
		TypeOrmModule.forRootAsync({
			useFactory: async (): Promise<TypeOrmModuleOptions> => {
				return {
					type: process.env.CI ? `sqlite` : `mysql`,
					host:
						process.env.NODE_ENV === `test`
							? `localhost`
							: process.env.MYSQL_HOST,
					port: Number(process.env.MYSQL_PORT),
					username: process.env.MYSQL_USER,
					password: process.env.MYSQL_PASSWORD,
					database: process.env.CI
						? `:memory:`
						: process.env.NODE_ENV === `test`
						? `link-shortener-test`
						: process.env.MYSQL_DATABASE,
					entities: [__dirname + `/../**/*.entity{.js,.ts}`],
					synchronize: process.env.NODE_ENV !== `production`,
					dropSchema:
						process.env.NODE_ENV === `test` || !!process.env.CI,
					migrations: [__dirname + `/../migrations/*{.js,.ts}`],
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					cli: {
						migrationsDir: __dirname + `/../migrations`,
					},
					extra: {
						charset: `utf8mb4_unicode_ci`,
					},
				};
			},
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
