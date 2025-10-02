import { IsString, IsUrl, IsOptional } from 'class-validator';

/**
 * DTO for creating an account onboarding link
 */
export class CreateAccountLinkDto {
  @IsString()
  accountId: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  refreshUrl?: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  returnUrl?: string;
}

