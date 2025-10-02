import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { StripeService } from '../services/stripe.service';
import {
  CreatePaymentIntentDto,
  CreateMBWayPaymentIntentDto,
} from '../dto';

/**
 * Controller for handling payment operations
 * Manages payment intents, confirmations, and transfers
 */
@Controller('stripe/payments')
export class PaymentController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('payment-intents')
  async createPaymentIntent(
    @Body() createPaymentIntentDto: CreatePaymentIntentDto,
  ) {
    try {
      const paymentIntent = await this.stripeService.createPaymentIntent(
        createPaymentIntentDto.amount,
        createPaymentIntentDto.currency,
        createPaymentIntentDto.connectedAccountId,
        createPaymentIntentDto.applicationFeeAmount,
        createPaymentIntentDto.description,
        createPaymentIntentDto.customerEmail,
        createPaymentIntentDto.paymentMethods,
      );
      return {
        success: true,
        data: {
          id: paymentIntent.id,
          client_secret: paymentIntent.client_secret,
          status: paymentIntent.status,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          application_fee_amount: paymentIntent.application_fee_amount,
          metadata: paymentIntent.metadata,
          description: paymentIntent.description,
          created: paymentIntent.created,
        },
        message:
          'Payment Intent created successfully! Use the client_secret to confirm the payment.',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Post('payment-intents/:id/confirm')
  async confirmPaymentIntent(
    @Param('id') paymentIntentId: string,
    @Body() body: { paymentMethodId?: string },
  ) {
    try {
      const paymentIntent = await this.stripeService.confirmPaymentIntent(
        paymentIntentId,
        body.paymentMethodId,
      );
      return {
        success: true,
        data: {
          id: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
        },
        message: 'Payment Intent confirmed successfully!',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Post('payment-intents/:id/cancel')
  async cancelPaymentIntent(@Param('id') paymentIntentId: string) {
    try {
      const paymentIntent = await this.stripeService.cancelPaymentIntent(
        paymentIntentId,
      );
      return {
        success: true,
        data: {
          id: paymentIntent.id,
          status: paymentIntent.status,
        },
        message: 'Payment Intent cancelled successfully!',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Get('payment-intents/:id')
  async getPaymentIntent(@Param('id') paymentIntentId: string) {
    try {
      const paymentIntent = await this.stripeService.getPaymentIntent(
        paymentIntentId,
      );
      return {
        success: true,
        data: {
          id: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          application_fee_amount: paymentIntent.application_fee_amount,
          metadata: paymentIntent.metadata,
          description: paymentIntent.description,
          created: paymentIntent.created,
          client_secret: paymentIntent.client_secret,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Get('payment-methods/available')
  async getAvailablePaymentMethods(@Query('currency') currency?: string) {
    try {
      const availableMethods =
        await this.stripeService.getAvailablePaymentMethods(currency || 'eur');

      return {
        success: true,
        data: {
          currency: currency || 'eur',
          available_methods: availableMethods,
          total_methods: availableMethods.length,
        },
        message: `Found ${availableMethods.length} available payment methods.`,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Post('payment-intents/mbway')
  async createMBWayPaymentIntent(
    @Body() createMBWayDto: CreateMBWayPaymentIntentDto,
  ) {
    try {
      const paymentIntent = await this.stripeService.createMBWayPaymentIntent(
        createMBWayDto.amount,
        createMBWayDto.connectedAccountId,
        createMBWayDto.applicationFeeAmount,
        createMBWayDto.description,
        createMBWayDto.customerEmail,
        createMBWayDto.customerPhone,
      );

      const hasMultibanco =
        paymentIntent.payment_method_types.includes('multibanco');
      const hasMBWay = paymentIntent.payment_method_types.includes('mb_way');

      let methodsDescription = 'Card';
      if (hasMultibanco && hasMBWay) {
        methodsDescription = 'MB Way, Multibanco and Card';
      } else if (hasMultibanco) {
        methodsDescription = 'Multibanco and Card';
      }

      return {
        success: true,
        data: {
          id: paymentIntent.id,
          client_secret: paymentIntent.client_secret,
          status: paymentIntent.status,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          application_fee_amount: paymentIntent.application_fee_amount,
          metadata: paymentIntent.metadata,
          description: paymentIntent.description,
          created: paymentIntent.created,
          payment_method_types: paymentIntent.payment_method_types,
        },
        message: `Portugal Payment Intent created! Supports: ${methodsDescription}`,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Post('transfers')
  async createTransfer(
    @Body() body: { amount: number; currency?: string; destination: string },
  ) {
    try {
      const transfer = await this.stripeService.createTransfer(
        body.amount,
        body.currency,
        body.destination,
      );
      return {
        success: true,
        data: transfer,
        message: 'Transfer created successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

