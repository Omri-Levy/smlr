import { IsUrl } from 'class-validator';

export class CreateLinkDto {
	@IsUrl()
	longUrl: string;
}
