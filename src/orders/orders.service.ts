import { Injectable } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { AuthRepository } from '../auth/auth.repository';
import { createOrderSchema } from './order-schema';
import Stripe from 'stripe';
import { EmailService } from 'src/shared/emails/emailservice';

@Injectable()
export class OrderService {
  private readonly stripeClient: Stripe;
  
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly authRepository: AuthRepository,
  ) {
    this.stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
    });
  }
  

  async createOrder(
    data: {
      items: Array<{ productId: string; quantity: number }>;
      paymentMethod: "credit_card" | "paypal" | "bank_transfer";
    },
    userId: string
  ) {
    // 1. Validate user
    const user = await this.authRepository.findUserById(userId);
    if (!user) throw new Error("User not found");
    if (!user.isVerified) throw new Error("User is not verified");
  
    // 2. Process products with actual prices from DB
    const products = await Promise.all(
      data.items.map(async (item) => {
        const product = await this.orderRepository.findProductById(item.productId);
        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product ${product.name}`);
        }
        return {
          product,
          quantity: item.quantity,
          price: product.price 
        };
      })
    );
  
    const totalPrice = products.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  
    const orderData = {
      user: { connect: { id: userId } },
      totalPrice,
      paymentMethod: data.paymentMethod,
      status: 'pending',
      orderItems: {
        create: products.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.price
        }))
      }
    };
  
    const order = await this.orderRepository.createOrder(orderData);
  
    return {
      order
    };
  }

  async createCheckoutSession(orderId: string, userId: string) {
    const order = await this.orderRepository.findOrderById(orderId);
    if (!order) throw new Error("Order not found");

  
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
      })),      mode: 'payment',
      success_url: `http://localhost:4000/orders/success?session_id={CHECKOUT_SESSION_ID}`, // Add /orders prefix
      cancel_url: `http://locahost:4000/cancel`,
      metadata: { orderId, userId },
    });
  
    return {
      sessionId: session.id,
      url: session.url,
      sucecssurl:session.success_url,
      cancelurl: session.cancel_url
    };
  }

  async getOrderByUserId(userId: string) {
    const user = await this.authRepository.findUserById(userId);
    if(!user){
      throw new Error("User not found");
    }
    if(!user.isVerified){
      throw new Error("User is not verified")
    }
    const orders =  await this.orderRepository.findOrdersByUserId(userId);
    if(!orders || orders.length === 0){
      throw new Error("No orders found for this user");
    }
    return orders;
  }



async handleStripeWebhook(event: Stripe.Event) {
  if(event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata.orderId;
    const userId = session.metadata.userId;
    const user = await this.authRepository.findUserById(userId)
    console.log(`Payment completed for order ${orderId} by user ${userId}`);
    
    // Update product stock
    const order = await this.orderRepository.findOrderById(orderId);
    if(!order){
      throw new Error(`Order ${orderId} not found`);
    }
      await this.orderRepository.updateOrderStatus(orderId, 'paid');
      const sendEmail = await EmailService.sendConfirmationemail(user.name,user.email,orderId)
      if(!sendEmail){
        throw new Error("Failed to send confirmation email");
      }
      console.log(`Confirmation email sent to ${user.email} for order ${orderId}`);
    if (order) {
      await Promise.all(
        order.orderItems.map(async (item) => {
          const newStock = item.product.stock - item.quantity;
          await this.orderRepository.updateProductStock(item.productId, newStock);
        })
      );
    }
  }
}

}
