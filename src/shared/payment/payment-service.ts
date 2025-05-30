import { Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';
import { z } from 'zod';
import { OrderService } from 'src/orders/orders.service';
import { createOrderSchema } from 'src/orders/order-schema';
import { OrderRepository } from 'src/orders/order.repository';
@Injectable()
export class PaymentService {
  private stripeClient: Stripe;
  private orderrepository:OrderRepository

  constructor(
    private readonly orderService: OrderService,
    orderrepository= new OrderRepository()
  ) {
    this.stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    });
  }

  async createCheckoutSession(orderId:string, userId:string){
    const order = await this.orderrepository.findOrderById(orderId);
    if(!order){
      throw new Error("Order not found");
    }
    if(order.userId !== userId){
      throw new Error("Unauthorized access to order");
    }
    if(order.status !== 'pending'){
      throw new Error("Order is not in a valid state for payment");
    }
    const session = await this.stripeClient.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: order.orderItems.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name:item.product.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    })),
    mode: 'payment',
  success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${process.env.FRONTEND_URL}/cancel`,
  metadata: {
    orderId: order.id,
    userId: userId,
  },
});

return session;
}
}
