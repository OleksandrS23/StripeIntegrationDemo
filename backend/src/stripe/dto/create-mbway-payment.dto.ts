import { IsNumber, IsString, IsOptional, IsEmail, Min } from 'class-validator';

/**
 * DTO for creating a payment intent with Portuguese payment methods
 * Supports MB Way, Multibanco, and card payments
 */
export class CreateMBWayPaymentIntentDto {
  @IsNumber()
  @Min(50)
  amount: number;

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
  @IsString()
  customerPhone?: string;
}

