import type { ClientOpts } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { LinkModule } from '../link/link.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from '../config/typeorm.config';

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
		TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
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
