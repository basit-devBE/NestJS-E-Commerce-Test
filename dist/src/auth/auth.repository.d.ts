import { z } from "zod";
import { registerUserDto } from "./auth.schema";
export declare class AuthRepository {
    createUser(data: z.infer<typeof registerUserDto>, isVerified: boolean): Promise<{
        id: string;
        name: string;
        email: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
        isVerified: boolean;
    }>;
    findUserByEmail(email: string): Promise<{
        id: string;
        name: string;
        email: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
        isVerified: boolean;
    }>;
}
