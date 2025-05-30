import { Controller, Post, Req, Res, Headers, RawBodyRequest } from '@nestjs/common';
import { Request, Response } from 'express';
import { OrderService } from './orders.service';
import Stripe from 'stripe';

@Controller('webhook')
export class WebhookController {
  private readonly stripeClient: Stripe;

  constructor(private readonly orderService: OrderService) {
    this.stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
    });
  }

  @Post('stripe')
  async handleStripeWebhook(
    @Req() req: RawBodyRequest<Request>, // Use RawBodyRequest type
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    console.log('🔔 Webhook received!');
    console.log('Headers:', req.headers);
    console.log('Signature:', signature);

    try {
      const event = this.stripeClient.webhooks.constructEvent(
        req.rawBody, // Use rawBody instead of req.body
        signature,
        process.env.STRIPE_WEBHOOK_SECRET,
      );

      console.log('✅ Webhook verified!', event.type);
      await this.orderService.handleStripeWebhook(event);
      res.status(200).send('OK');
    } catch (error) {
      console.error('❌ Webhook error:', error);
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  }
}