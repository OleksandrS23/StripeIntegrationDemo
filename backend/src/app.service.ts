import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Stripe Connect API - Backend is running!';
  }
}

