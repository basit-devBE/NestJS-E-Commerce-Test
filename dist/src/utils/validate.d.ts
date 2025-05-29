import { Request, Response } from "express";
import { AnyZodObject } from "zod";
export declare const validateRequest: (schema: AnyZodObject) => (req: Request, res: Response, next: Function) => Response<any, Record<string, any>>;
