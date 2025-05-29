import {z} from "zod";

export const registerUserDto = z.object({
    email:z.string().email(),
    password: z.string().min(6).max(255).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        message:
          "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character",
      }
    ),

    name:z.string().min(1, "Name is required").max(50, "Name must be at most 50 characters long"),
})

export const verifyUserDto = z.object({
    email: z.string({required_error: "Email is required"}).email(),
    verificationCode: z.string().length(6, "Verification code must be exactly 6 characters long"),
})


export const loginUserDto = z.object({
    email: z.string({required_error: "Email is required"}).email(),
    password: z.string({required_error: "Password is required"}).min(6, "Password must be at least 6 characters long")
});