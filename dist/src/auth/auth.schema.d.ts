import { z } from "zod";
export declare const registerUserDto: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email?: string;
    password?: string;
    name?: string;
}, {
    email?: string;
    password?: string;
    name?: string;
}>;
export declare const verifyUserDto: z.ZodObject<{
    email: z.ZodString;
    verificationCode: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email?: string;
    verificationCode?: string;
}, {
    email?: string;
    verificationCode?: string;
}>;
export declare const loginUserDto: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email?: string;
    password?: string;
}, {
    email?: string;
    password?: string;
}>;
