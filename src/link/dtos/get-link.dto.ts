import { Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { nanoid } from 'nanoid';

export class GetLinkDto {
	@Length(7, 7)
	@Matches(/([a-z]|_|-)+/i)
	@ApiProperty({
		type: String,
		format: `slug`,
		description: `The unique identifier of the shortened url`,
		example: nanoid(7),
	})
	slug: string;
}
