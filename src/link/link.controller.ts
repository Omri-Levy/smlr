import {
	Body,
	Controller,
	Get,
	NotFoundException,
	Param,
	Post,
	Res,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { LinkService } from './link.service';
import { GetLinkDto } from './dtos/get-link.dto';
import { CreateLinkDto } from './dtos/create-link.dto';
import {
	ApiBadRequestResponse,
	ApiBody,
	ApiCreatedResponse,
	ApiForbiddenResponse,
	ApiFoundResponse,
	ApiInternalServerErrorResponse,
	ApiNotFoundResponse,
	ApiParam,
} from '@nestjs/swagger';
import { nanoid } from 'nanoid';

@Controller()
@UsePipes(
	new ValidationPipe({
		transform: true,
	}),
)
export class LinkController {
	constructor(private readonly linkService: LinkService) {}

	@Post(`/api/v1`)
	@ApiCreatedResponse({
		description: `A short url was created`,
		schema: {
			example: {
				data: {
					shortUrl: `http://localhost:3000/${nanoid(7)}`,
				},
			},
		},
	})
	@ApiBadRequestResponse({
		description: `Invalid longUrl was provided`,
		schema: {
			example: {
				errors: [
					{
						message: `Please provide a valid url`,
						field: `longUrl`,
					},
				],
			},
		},
	})
	@ApiForbiddenResponse({
		description: `Invalid CSRF token was provided`,
		schema: {
			example: {
				statusCode: 403,
				message: `invalid csrf token`,
			},
		},
	})
	@ApiInternalServerErrorResponse({
		description: `A database error, or an unexpected error has occurred.`,
		schema: {
			example: {
				statusCode: 500,
				message: `Internal Server Error`,
			},
		},
	})
	@ApiNotFoundResponse({
		description: `The database did not return a result from creating a short url`,
		schema: {
			example: {
				statusCode: 404,
				message: `Short url was not found`,
			},
		},
	})
	@ApiBody({ type: CreateLinkDto })
	async createLink(@Body() createLinkDto: CreateLinkDto) {
		const shortUrl = await this.linkService.createLink(createLinkDto);

		if (!shortUrl) {
			throw new NotFoundException(`Short url was not found`);
		}

		return {
			data: {
				shortUrl,
			},
		};
	}

	@Get(`:slug`)
	@ApiFoundResponse({
		description: `Redirect to the long url if the slug was found`,
	})
	@ApiBadRequestResponse({
		description: `Invalid slug was provided`,
		schema: {
			example: {
				errors: [
					{
						message: `Please provide a valid slug`,
						field: `slug`,
					},
				],
			},
		},
	})
	@ApiNotFoundResponse({
		description: `A valid slug was provided, but it does not exist.`,
		schema: {
			example: {
				statusCode: 404,
				message: `Url was not found`,
			},
		},
	})
	@ApiParam({
		name: `slug`,
		format: `slug`,
		type: String,
	})
	async redirect(@Param() params: GetLinkDto, @Res() res) {
		const longUrl = await this.linkService.getLink(params);

		if (!longUrl) {
			throw new NotFoundException(`Url was not found`);
		}

		return res.redirect(longUrl);
	}
}
