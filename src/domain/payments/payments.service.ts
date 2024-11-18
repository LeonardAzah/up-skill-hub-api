import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(this.configService.get('STRIPE_KEY'));

  constructor(private readonly configService: ConfigService) {}

  async create({ amount, email }: CreatePaymentDto) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'usd',
      payment_method: 'pm_card_visa',
    });
    return paymentIntent;
  }
}
