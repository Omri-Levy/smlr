import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LinkController } from './link.controller';
import { LinkService } from './link.service';
import { restfulMiddleware } from '../middleware/restful/restful.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from './link.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Link])],
	controllers: [LinkController],
	providers: [LinkService],
})
export class LinkModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(restfulMiddleware([`get`, `post`])).forRoutes(``);
	}
}
