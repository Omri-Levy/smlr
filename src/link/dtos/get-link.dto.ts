import { Length, Matches } from 'class-validator';

export class GetLinkDto {
	@Length(7, 7)
	@Matches(/([a-z]|_|-)+/i)
	slug: string;
}
