import { IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLinkDto {
	@IsUrl({}, { message: `Please provide a valid url` })
	@ApiProperty({
		type: String,
		format: `url`,
		description: `The url to be shortened`,
		example: `https://www.google.com`,
	})
	longUrl: string;
}
