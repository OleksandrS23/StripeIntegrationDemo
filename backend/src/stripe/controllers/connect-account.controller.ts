import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { StripeService } from '../services/stripe.service';
import { CreateAccountDto, CreateAccountLinkDto } from '../dto';

/**
 * Controller for managing Stripe Connect accounts
 * Handles account creation, onboarding, and account management
 */
@Controller('stripe/connect')
export class ConnectAccountController {
  constructor(private readonly stripeService: StripeService) {}

  @Get('accounts')
  async listAccounts(@Query('limit') limit?: string) {
    try {
      const accounts = await this.stripeService.listAccounts(
        limit ? parseInt(limit) : 10,
      );
      return {
        success: true,
        data: accounts,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Post('accounts')
  async createAccount(@Body() createAccountDto: CreateAccountDto) {
    try {
      const account = await this.stripeService.createConnectAccount(
        createAccountDto.email,
        createAccountDto.country,
        createAccountDto.type,
      );
      return {
        success: true,
        data: account,
        message: 'Connect account created successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Get('accounts/:accountId')
  async getAccount(@Param('accountId') accountId: string) {
    try {
      const account = await this.stripeService.getAccount(accountId);
      return {
        success: true,
        data: account,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Get('accounts/:accountId/balance')
  async getAccountBalance(@Param('accountId') accountId: string) {
    try {
      const balance = await this.stripeService.getAccountBalance(accountId);
      return {
        success: true,
        data: balance,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Post('account-links')
  async createAccountLink(@Body() createAccountLinkDto: CreateAccountLinkDto) {
    try {
      const accountLink = await this.stripeService.createAccountLink(
        createAccountLinkDto.accountId,
        createAccountLinkDto.refreshUrl,
        createAccountLinkDto.returnUrl,
      );
      return {
        success: true,
        data: accountLink,
        message: 'Account link created successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Post('simulate-flow')
  async simulateCompleteFlow(@Body() body: { email: string; amount: number }) {
    try {
      const account = await this.stripeService.createConnectAccount(body.email);

      const accountLink = await this.stripeService.createAccountLink(
        account.id,
        'http://localhost:3000/refresh',
        'http://localhost:3000/return',
      );

      return {
        success: true,
        message: 'Complete flow simulation started',
        data: {
          account,
          onboardingUrl: accountLink.url,
          instructions: [
            '1. Account created successfully',
            '2. Use the onboarding URL to complete account setup',
            '3. After onboarding, you can create payments and transfers',
          ],
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

