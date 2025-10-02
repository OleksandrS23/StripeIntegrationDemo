import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConnectAccountController } from './controllers/connect-account.controller';
import { PaymentController } from './controllers/payment.controller';
import { CheckoutController } from './controllers/checkout.controller';
import { StripeService } from './services/stripe.service';

@Module({
  imports: [ConfigModule],
  controllers: [
    ConnectAccountController,
    PaymentController,
    CheckoutController,
  ],
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeModule {}

