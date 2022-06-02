import { LinkModule } from '../link/link.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
		ConfigModule.forRoot(),
		TypeOrmModule.forRoot({
			type: `mysql`,
			host:
				process.env.NODE_ENV === `test` || process.env.CI
					? `localhost`
					: process.env.MYSQL_HOST,
			port: Number(process.env.MYSQL_PORT),
			username: process.env.MYSQL_USER,
			password: process.env.MYSQL_PASSWORD,
			database:
				process.env.NODE_ENV === `link-shortener-test`
					? `test`
					: process.env.MYSQL_DATABASE,
			entities: [__dirname + `/../**/*.entity.{js,ts}`],
			synchronize: process.env.NODE_ENV !== `production`,
			dropSchema: process.env.NODE_ENV === `test` || process.env.CI,
		}),
		LinkModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}