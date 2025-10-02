import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

/**
 * Service for handling all Stripe API operations
 * Manages Connect accounts, payments, and transfers
 */
@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    const secretKey = this.configService.get('STRIPE_SECRET_KEY');

    if (
      !secretKey ||
      secretKey.includes('PLACEHOLDER') ||
      secretKey === 'sk_test_dummy_key_for_development_only'
    ) {
      console.warn(
        '⚠️  Stripe secret key not properly configured. Please update your .env file with real Stripe keys.',
      );
      console.warn(
        '🔗 Get your keys at: https://dashboard.stripe.com/test/apikeys',
      );
      throw new Error(
        'Stripe API key is not configured. Please check your .env file.',
      );
    } else {
      console.log(
        '✅ Stripe initialized with key:',
        secretKey.substring(0, 20) + '...',
      );
      this.stripe = new Stripe(secretKey, {
        apiVersion: '2025-09-30.clover',
      });
    }
  }

  async createConnectAccount(
    email: string,
    country: string = 'US',
    type: 'express' | 'standard' | 'custom' = 'express',
  ): Promise<Stripe.Account> {
    try {
      const basicCapabilities = {
        card_payments: { requested: true },
        transfers: { requested: true },
      };

      const countrySpecificCapabilities =
        this.getCountrySpecificCapabilities(country);

      const account = await this.stripe.accounts.create({
        type,
        country,
        email,
        capabilities: {
          ...basicCapabilities,
          ...countrySpecificCapabilities,
        },
      });

      return account;
    } catch (error) {
      throw new Error(`Error creating Connect account: ${error.message}`);
    }
  }

  private getCountrySpecificCapabilities(
    country: string,
  ): Record<string, { requested: boolean }> {
    const capabilities: Record<string, { requested: boolean }> = {};

    switch (country.toLowerCase()) {
      case 'br':
        capabilities.pix_payments = { requested: true };
        break;
      case 'mx':
        capabilities.oxxo_payments = { requested: true };
        break;
      case 'my':
        capabilities.fpx_payments = { requested: true };
        break;
      default:
        break;
    }

    return capabilities;
  }

  async createAccountLink(
    accountId: string,
    refreshUrl: string,
    returnUrl: string,
  ): Promise<Stripe.AccountLink> {
    try {
      const accountLink = await this.stripe.accountLinks.create({
        account: accountId,
        refresh_url: refreshUrl,
        return_url: returnUrl,
        type: 'account_onboarding',
      });

      return accountLink;
    } catch (error) {
      throw new Error(`Error creating account link: ${error.message}`);
    }
  }

  async getAccount(accountId: string): Promise<Stripe.Account> {
    try {
      const account = await this.stripe.accounts.retrieve(accountId);
      return account;
    } catch (error) {
      throw new Error(`Error retrieving account: ${error.message}`);
    }
  }

  async createPaymentIntent(
    amount: number,
    currency: string = 'usd',
    connectedAccountId: string,
    applicationFeeAmount?: number,
    description?: string,
    customerEmail?: string,
    paymentMethods?: string[],
  ): Promise<Stripe.PaymentIntent> {
    try {
      let defaultPaymentMethods = ['card'];

      if (currency.toLowerCase() === 'eur') {
        defaultPaymentMethods = ['card', 'multibanco', 'mb_way', 'sepa_debit'];
      } else if (currency.toLowerCase() === 'brl') {
        defaultPaymentMethods = ['card', 'pix'];
      } else if (currency.toLowerCase() === 'mxn') {
        defaultPaymentMethods = ['card', 'oxxo'];
      }

      const paymentIntentData: Stripe.PaymentIntentCreateParams = {
        amount,
        currency,
        transfer_data: {
          destination: connectedAccountId,
        },
        metadata: {
          connected_account: connectedAccountId,
          platform_fee: applicationFeeAmount?.toString() || '0',
          seller_amount: (amount - (applicationFeeAmount || 0)).toString(),
        },
        confirm: false,
        payment_method_types: paymentMethods || defaultPaymentMethods,
      };

      if (applicationFeeAmount) {
        paymentIntentData.application_fee_amount = applicationFeeAmount;
      }

      if (description) {
        paymentIntentData.description = description;
      }

      if (customerEmail) {
        paymentIntentData.receipt_email = customerEmail;
      }

      const paymentIntent = await this.stripe.paymentIntents.create(
        paymentIntentData,
      );

      return paymentIntent;
    } catch (error) {
      throw new Error(`Error creating payment intent: ${error.message}`);
    }
  }

  async confirmPaymentIntent(
    paymentIntentId: string,
    paymentMethodId?: string,
  ): Promise<Stripe.PaymentIntent> {
    try {
      const confirmData: Stripe.PaymentIntentConfirmParams = {};

      if (paymentMethodId) {
        confirmData.payment_method = paymentMethodId;
      }

      const paymentIntent = await this.stripe.paymentIntents.confirm(
        paymentIntentId,
        confirmData,
      );

      return paymentIntent;
    } catch (error) {
      throw new Error(`Error confirming payment intent: ${error.message}`);
    }
  }

  async cancelPaymentIntent(
    paymentIntentId: string,
  ): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.cancel(
        paymentIntentId,
      );
      return paymentIntent;
    } catch (error) {
      throw new Error(`Error canceling payment intent: ${error.message}`);
    }
  }

  async getPaymentIntent(
    paymentIntentId: string,
  ): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(
        paymentIntentId,
      );
      return paymentIntent;
    } catch (error) {
      throw new Error(`Error retrieving payment intent: ${error.message}`);
    }
  }

  async createMBWayPaymentIntent(
    amount: number,
    connectedAccountId: string,
    applicationFeeAmount?: number,
    description?: string,
    customerEmail?: string,
    customerPhone?: string,
  ): Promise<Stripe.PaymentIntent> {
    const methodsToTry = [
      ['card', 'multibanco', 'mb_way'],
      ['card', 'multibanco'],
      ['card'],
    ];

    let lastError: Error | null = null;

    for (const methods of methodsToTry) {
      try {
        const paymentIntentData: Stripe.PaymentIntentCreateParams = {
          amount,
          currency: 'eur',
          transfer_data: {
            destination: connectedAccountId,
          },
          metadata: {
            connected_account: connectedAccountId,
            platform_fee: applicationFeeAmount?.toString() || '0',
            seller_amount: (amount - (applicationFeeAmount || 0)).toString(),
            payment_methods_tried: methods.join(','),
          },
          confirm: false,
          payment_method_types: methods,
        };

        if (applicationFeeAmount) {
          paymentIntentData.application_fee_amount = applicationFeeAmount;
        }

        if (description) {
          paymentIntentData.description = description;
        }

        if (customerEmail) {
          paymentIntentData.receipt_email = customerEmail;
        }

        if (customerPhone) {
          paymentIntentData.metadata.customer_phone = customerPhone;
        }

        const paymentIntent = await this.stripe.paymentIntents.create(
          paymentIntentData,
        );

        console.log(
          `✅ Payment Intent created with methods: ${methods.join(', ')}`,
        );
        return paymentIntent;
      } catch (error) {
        lastError = error;
        console.warn(
          `⚠️ Attempt with methods [${methods.join(', ')}] failed: ${
            error.message
          }`,
        );

        if (
          !error.message.toLowerCase().includes('payment method') &&
          !error.message.toLowerCase().includes('invalid')
        ) {
          break;
        }

        continue;
      }
    }

    throw new Error(
      `Error creating Portugal payment intent. Last error: ${
        lastError?.message || 'Unknown error'
      }`,
    );
  }

  async getAvailablePaymentMethods(
    currency: string = 'eur',
  ): Promise<string[]> {
    const methodsToTest = [
      'card',
      'multibanco',
      'mb_way',
      'sepa_debit',
      'bancontact',
      'ideal',
    ];

    const availableMethods: string[] = [];

    for (const method of methodsToTest) {
      try {
        const testIntent = await this.stripe.paymentIntents.create({
          amount: 100,
          currency,
          payment_method_types: [method],
        });

        await this.stripe.paymentIntents.cancel(testIntent.id);
        availableMethods.push(method);
      } catch (error) {
        continue;
      }
    }

    return availableMethods;
  }

  async createTransfer(
    amount: number,
    currency: string = 'usd',
    destination: string,
  ): Promise<Stripe.Transfer> {
    try {
      const transfer = await this.stripe.transfers.create({
        amount,
        currency,
        destination,
      });

      return transfer;
    } catch (error) {
      throw new Error(`Error creating transfer: ${error.message}`);
    }
  }

  async listAccounts(
    limit: number = 10,
  ): Promise<Stripe.ApiList<Stripe.Account>> {
    try {
      const accounts = await this.stripe.accounts.list({ limit });
      return accounts;
    } catch (error) {
      throw new Error(`Error listing accounts: ${error.message}`);
    }
  }

  async getAccountBalance(accountId: string): Promise<Stripe.Balance> {
    try {
      const balance = await this.stripe.balance.retrieve({
        stripeAccount: accountId,
      });
      return balance;
    } catch (error) {
      throw new Error(`Error retrieving account balance: ${error.message}`);
    }
  }

  async createCheckoutSession(
    amount: number,
    currency: string = 'usd',
    connectedAccountId: string,
    applicationFeeAmount: number,
    successUrl: string,
    cancelUrl: string,
    productName: string = 'Product',
    customerEmail?: string,
  ): Promise<Stripe.Checkout.Session> {
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card', 'multibanco'],
        line_items: [
          {
            price_data: {
              currency,
              product_data: {
                name: productName,
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        payment_intent_data: {
          application_fee_amount: applicationFeeAmount,
          transfer_data: {
            destination: connectedAccountId,
          },
        } as any,
        ...(customerEmail && { customer_email: customerEmail }),
      });

      return session;
    } catch (error) {
      throw new Error(`Error creating checkout session: ${error.message}`);
    }
  }

  async createPaymentLink(
    amount: number,
    currency: string = 'usd',
    connectedAccountId: string,
    applicationFeeAmount: number,
    productName: string = 'Product',
    productDescription?: string,
  ): Promise<Stripe.PaymentLink> {
    try {
      const product = await this.stripe.products.create({
        name: productName,
        description: productDescription,
        metadata: {
          connected_account: connectedAccountId,
          application_fee_amount: applicationFeeAmount.toString(),
          payment_type: 'connect_payment',
        },
      });

      const price = await this.stripe.prices.create({
        unit_amount: amount,
        currency,
        product: product.id,
      });

      const paymentLink = await this.stripe.paymentLinks.create({
        line_items: [
          {
            price: price.id,
            quantity: 1,
          },
        ],
        metadata: {
          connected_account: connectedAccountId,
          application_fee_amount: applicationFeeAmount.toString(),
          transfer_amount: (amount - applicationFeeAmount).toString(),
        },
      });

      return paymentLink;
    } catch (error) {
      throw new Error(`Error creating payment link: ${error.message}`);
    }
  }

  async createPaymentLinkDirect(
    amount: number,
    currency: string = 'usd',
    connectedAccountId: string,
    productName: string = 'Product',
    productDescription?: string,
  ): Promise<Stripe.PaymentLink> {
    try {
      const product = await this.stripe.products.create(
        {
          name: productName,
          description: productDescription,
        },
        {
          stripeAccount: connectedAccountId,
        },
      );

      const price = await this.stripe.prices.create(
        {
          unit_amount: amount,
          currency,
          product: product.id,
        },
        {
          stripeAccount: connectedAccountId,
        },
      );

      const paymentLink = await this.stripe.paymentLinks.create(
        {
          line_items: [
            {
              price: price.id,
              quantity: 1,
            },
          ],
        },
        {
          stripeAccount: connectedAccountId,
        },
      );

      return paymentLink;
    } catch (error) {
      throw new Error(`Error creating direct payment link: ${error.message}`);
    }
  }

  async createPaymentIntentForElements(
    amount: number,
    currency: string = 'usd',
    connectedAccountId: string,
    applicationFeeAmount?: number,
    customerEmail?: string,
  ): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntentData: Stripe.PaymentIntentCreateParams = {
        amount,
        currency,
        automatic_payment_methods: {
          enabled: true,
        },
        transfer_data: {
          destination: connectedAccountId,
        },
        metadata: {
          connected_account: connectedAccountId,
        },
      };

      if (applicationFeeAmount) {
        paymentIntentData.application_fee_amount = applicationFeeAmount;
      }

      if (customerEmail) {
        paymentIntentData.receipt_email = customerEmail;
      }

      const paymentIntent = await this.stripe.paymentIntents.create(
        paymentIntentData,
      );

      return paymentIntent;
    } catch (error) {
      throw new Error(
        `Error creating payment intent for elements: ${error.message}`,
      );
    }
  }

  constructWebhookEvent(payload: Buffer, signature: string): Stripe.Event {
    const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');

    try {
      return this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret,
      );
    } catch (error) {
      throw new Error(
        `Webhook signature verification failed: ${error.message}`,
      );
    }
  }
}

