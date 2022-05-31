import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LinkController } from './link.controller';
import { LinkService } from './link.service';
import { restful } from '../middleware/restful/restful';

@Module({
	imports: [],
	controllers: [LinkController],
	providers: [LinkService],
})
export class LinkModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(restful([`get`, `post`])).forRoutes(``);
	}
}
