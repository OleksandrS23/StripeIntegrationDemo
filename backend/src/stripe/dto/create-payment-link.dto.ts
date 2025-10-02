import { IsNumber, IsString, IsOptional, Min } from 'class-validator';

/**
 * DTO for creating a shareable payment link
 * Can be shared via social media, email, SMS, etc.
 */
export class CreatePaymentLinkDto {
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
  @IsString()
  productDescription?: string;
}

