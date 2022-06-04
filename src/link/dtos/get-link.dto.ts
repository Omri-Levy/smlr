import { Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { nanoid } from 'nanoid';

export class GetLinkDto {
	@Length(7, 7, { message: `Please provide a slug of 7 character(s)` })
	@Matches(/([a-z]|_|-)+/i, {
		message: `A slug must contain only English letters, underscores, and dashes`,
	})
	@ApiProperty({
		type: String,
		format: `slug`,
		description: `The unique identifier of the shortened url`,
		example: nanoid(7),
	})
	slug: string;
}
