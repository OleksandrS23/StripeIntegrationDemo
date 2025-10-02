import { IsString, IsUrl } from 'class-validator';

/**
 * DTO for creating an account onboarding link
 */
export class CreateAccountLinkDto {
  @IsString()
  accountId: string;

  @IsUrl()
  refreshUrl: string;

  @IsUrl()
  returnUrl: string;
}

