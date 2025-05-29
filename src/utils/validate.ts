import { Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";

export const validateRequest = (schema: AnyZodObject) => {
    return (req: Request, res: Response, next: Function) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    status: "error",
                    message: error.errors.map(err => err.message).join(", "),
                });
            }
            return res.status(500).json({
                status: "error",
                message: "Internal server error",
            });
        }
    };
};