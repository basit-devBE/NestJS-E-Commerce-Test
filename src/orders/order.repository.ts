import prisma from "prisma/prismaClient";
import { z } from "zod";
import { Injectable } from "@nestjs/common";
import { createOrderSchema } from "./order-schema";
import { Prisma } from "@prisma/client";

@Injectable()
export class OrderRepository{
    async findProductById(productId: string) {
        try {
            const product = await prisma.product.findUnique({
                where: {
                    id: productId,
                },
            });
            return product;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to find product by ID: ${error.message}`);
            } else {
                throw new Error("An unexpected error occurred while finding the product.");
            }
        }
    }

    async updateProductStock(productId:string, new_stock:number){
        try{
            const product = await prisma.product.update({
                where: {
                    id: productId,
                },
                data: {
                    stock: new_stock,
                },
            });
            return product;
        }
        catch(error){
            throw new Error(`Failed to update product stock: ${error instanceof Error ? error.message : "An unexpected error occurred"}`);
        }
    }

    async findOrderById(orderId:string){
        try {
            const order = await prisma.order.findUnique({
                where: {
                    id: orderId,
                },
                include:{
                    orderItems:{
                        include:{
                            product:true
                        }
                    }
                }
            });
            return order;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to find order by ID: ${error.message}`);
            } else {
                throw new Error("An unexpected error occurred while finding the order.");
            }
        }
    }

    async createOrder(data: Prisma.OrderCreateInput) {
        try {
          console.log('Creating order with data:', JSON.stringify(data, null, 2));
          const order = await prisma.order.create({
            data,
            include: {
              orderItems: {
                include: {
                  product: true
                }
              }
            }
          });
          return order;
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(`Failed to create order: ${error.message}`);
          } else {
            throw new Error("An unexpected error occurred while creating the order.");
          }
        }
      }
}