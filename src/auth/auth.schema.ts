import {z} from "zod";

export const registerUserDto = z.object({
    email:z.string().email(),
    password:z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, "Password must contain at least one uppercase letter, one lowercase letter, one number, and be at least 6 characters long"),   
    name:z.string().min(1, "Name is required").max(50, "Name must be at most 50 characters long"),
})