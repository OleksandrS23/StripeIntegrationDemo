import { IsNumber, IsString, IsOptional, IsEmail, IsArray, Min } from 'class-validator';

/**
 * DTO for creating a payment intent
 * Minimum amount is 50 cents to comply with Stripe requirements
 */
export class CreatePaymentIntentDto {
  @IsNumber()
  @Min(50)
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string = 'usd';

  @IsString()
  connectedAccountId: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  applicationFeeAmount?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEmail()
  customerEmail?: string;

  @IsOptional()
  @IsArray()
  paymentMethods?: string[];
}

