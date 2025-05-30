import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { OrderService } from './orders.service';
import { OrdersController } from './orders.controller';
import { AuthModule } from '../auth/auth.module';
import { OrderRepository } from 'src/orders/order.repository';
import { AuthMiddleware } from '../auth/guards/auth.guard';

@Module({
  imports: [
    AuthModule,
  ],
  controllers: [OrdersController],
  providers: [OrderService, OrderRepository],
  exports: [OrderService, OrderRepository], 
})
export class OrdersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ 
        path: '/orders/create',
        method: RequestMethod.POST 
      });

      consumer
      .apply(AuthMiddleware)
      .forRoutes({
        path: '/orders/checkout',
        method: RequestMethod.POST
      });
  }
}