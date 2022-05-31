import { Length, Matches } from 'class-validator';

export class GetLinkDto {
	@Length(11, 11)
	@Matches(/([a-z]|_|-)/i)
	slug: string;
}
