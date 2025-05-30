import {z} from 'zod';

export const createOrderSchema = z.object({
  userId: z.string(),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().min(1, "Quantity must be at least 1"),
      price: z.number().positive("Price must be positive")
    })
  ).nonempty("Order must contain at least one item"),
  totalPrice: z.number().positive("Total price must be positive"),
  paymentMethod: z.enum(["credit_card", "paypal", "bank_transfer"]),
  status: z.enum(["pending", "completed", "cancelled"]).optional().default("pending")
});