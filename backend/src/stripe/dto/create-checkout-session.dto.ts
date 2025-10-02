import { IsNumber, IsString, IsOptional, IsEmail, Min } from 'class-validator';

/**
 * DTO for creating a Stripe Checkout Session
 * Used for hosted payment pages
 */
export class CreateCheckoutSessionDto {
  @IsNumber()
  @Min(50)
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string = 'usd';

  @IsString()
  connectedAccountId: string;

  @IsNumber()
  @Min(0)
  applicationFeeAmount: number;

  @IsOptional()
  @IsString()
  productName?: string = 'Product';

  @IsOptional()
  @IsEmail()
  customerEmail?: string;
}

