import { Controller, Injectable, Req, Post, Res } from '@nestjs/common';
import { OrderService } from './orders.service';
import { Request, Response } from 'express';
import { AuthRepository } from 'src/auth/auth.repository';

// Extend the Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string | number;
        [key: string]: any;
      };
    }
  }
}

@Controller('orders')
export class OrdersController {
    constructor(
        private readonly orderService: OrderService,
        private readonly authRepository: AuthRepository
    ) {}

    @Post('create')
    async createOrder(@Req() req: Request, @Res() res: Response) {
        try {
            const data = req.body;
            const userId = String(req.userId);
            console.log("User ID from request:", userId);
            const result = await this.orderService.createOrder(data, userId);
            res.status(201).json(result);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: `Failed to create order: ${error.message}` });
            } else {
                res.status(500).json({ message: "An unexpected error occurred while creating the order." });
            }
        }
    }


    @Post('checkout')
    async checkout(@Req() req: Request, @Res() res: Response) {
        try {
          const orderId = req.body.orderId;
                const userId = String(req.userId);
                console.log("User ID from request:", userId);
                const user = await this.authRepository.findUserById(userId);
                if(!user){
                    return res.status(404).json({ message: "User not found" });
                }
                if(!user.isVerified){
                    return res.status(403).json({ message: "User is not verified" });
                }
                if (!orderId) {
                    return res.status(400).json({ message: "Order ID is required" });
                }
                const result = await this.orderService.createCheckoutSession(orderId, userId);
                res.status(200).json(result);
            } catch (error) {
                if (error instanceof Error) {
                    res.status(400).json({ message: `Failed to checkout: ${error.message}` });
                } else {
                    res.status(500).json({ message: "An unexpected error occurred while checking out." });
                }
            }
        }

        @Post('get-orders')
        async getOrders(@Req() req: Request, @Res() res: Response) {
            try {
                const userId = String(req.userId);
                console.log("User ID from request:", userId);
                const user = await this.authRepository.findUserById(userId);
                if(!user){
                    return res.status(404).json({ message: "User not found" });
                }
                if(!user.isVerified){
                    return res.status(403).json({ message: "User is not verified" });
                }
                const orders = await this.orderService.getOrderByUserId(userId);
                res.status(200).json(orders);
            } catch (error) {
                if (error instanceof Error) {
                    res.status(400).json({ message: `Failed to get orders: ${error.message}` });
                } else {
                    res.status(500).json({ message: "An unexpected error occurred while getting orders." });
                }
            }
        }
    }
    



