import { z } from "zod";
import { registerUserDto } from "./auth.schema";
export declare class AuthRepository {
    createUser(data: z.infer<typeof registerUserDto>): Promise<{
        name: string;
        id: string;
        email: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
