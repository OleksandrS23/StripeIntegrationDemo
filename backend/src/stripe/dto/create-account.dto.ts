import { IsEmail, IsOptional, IsIn } from 'class-validator';

/**
 * DTO for creating a new Stripe Connect account
 */
export class CreateAccountDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsIn(['US', 'BR', 'CA', 'GB', 'DE', 'FR', 'PT', 'MX', 'MY'])
  country?: string = 'US';

  @IsOptional()
  @IsIn(['express', 'standard', 'custom'])
  type?: 'express' | 'standard' | 'custom' = 'express';
}

