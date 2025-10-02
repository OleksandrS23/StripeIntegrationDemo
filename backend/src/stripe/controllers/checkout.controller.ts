import { Controller, Post, Body } from '@nestjs/common';
import { StripeService } from '../services/stripe.service';
import {
  CreateCheckoutSessionDto,
  CreatePaymentLinkDto,
} from '../dto';

/**
 * Controller for checkout sessions and payment links
 * Provides hosted payment pages and shareable payment links
 */
@Controller('stripe/checkout')
export class CheckoutController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('sessions')
  async createCheckoutSession(
    @Body() createCheckoutSessionDto: CreateCheckoutSessionDto,
  ) {
    try {
      const successUrl = `${
        process.env.APP_URL || 'http://localhost:3000'
      }/payment-success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${
        process.env.APP_URL || 'http://localhost:3000'
      }/payment-cancelled`;

      const session = await this.stripeService.createCheckoutSession(
        createCheckoutSessionDto.amount,
        createCheckoutSessionDto.currency || 'usd',
        createCheckoutSessionDto.connectedAccountId,
        createCheckoutSessionDto.applicationFeeAmount,
        successUrl,
        cancelUrl,
        createCheckoutSessionDto.productName || 'Product',
        createCheckoutSessionDto.customerEmail,
      );

      return {
        success: true,
        data: {
          sessionId: session.id,
          url: session.url,
          message:
            'Checkout session created! Customer can use this URL to pay.',
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Post('payment-links')
  async createPaymentLink(@Body() createPaymentLinkDto: CreatePaymentLinkDto) {
    try {
      const paymentLink = await this.stripeService.createPaymentLinkDirect(
        createPaymentLinkDto.amount - createPaymentLinkDto.applicationFeeAmount,
        createPaymentLinkDto.currency || 'usd',
        createPaymentLinkDto.connectedAccountId,
        createPaymentLinkDto.productName || 'Product',
        createPaymentLinkDto.productDescription,
      );

      return {
        success: true,
        data: {
          paymentLinkId: paymentLink.id,
          url: paymentLink.url,
          message:
            'Payment link created! Customer pays directly to connected account.',
          note: `Product value: $${(
            createPaymentLinkDto.amount / 100
          ).toFixed(2)} | Platform fee: $${(
            createPaymentLinkDto.applicationFeeAmount / 100
          ).toFixed(2)} | Seller receives: $${(
            (createPaymentLinkDto.amount -
              createPaymentLinkDto.applicationFeeAmount) /
            100
          ).toFixed(2)}`,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Post('payment-links/with-fee')
  async createPaymentLinkWithFee(
    @Body() createPaymentLinkDto: CreatePaymentLinkDto,
  ) {
    try {
      const paymentLink = await this.stripeService.createPaymentLink(
        createPaymentLinkDto.amount,
        createPaymentLinkDto.currency || 'usd',
        createPaymentLinkDto.connectedAccountId,
        createPaymentLinkDto.applicationFeeAmount,
        createPaymentLinkDto.productName || 'Product',
        createPaymentLinkDto.productDescription,
      );

      return {
        success: true,
        data: {
          paymentLinkId: paymentLink.id,
          url: paymentLink.url,
          message:
            'Payment link created! Payment goes to your main account first.',
          note: 'You need to transfer funds to connected account manually or via webhook.',
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Post('payment-intents-elements')
  async createPaymentIntentForElements(
    @Body()
    body: {
      amount: number;
      currency?: string;
      connectedAccountId: string;
      applicationFeeAmount?: number;
      customerEmail?: string;
    },
  ) {
    try {
      const paymentIntent =
        await this.stripeService.createPaymentIntentForElements(
          body.amount,
          body.currency,
          body.connectedAccountId,
          body.applicationFeeAmount,
          body.customerEmail,
        );

      return {
        success: true,
        data: {
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
          message:
            'Payment Intent created! Use client_secret with Stripe Elements.',
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

