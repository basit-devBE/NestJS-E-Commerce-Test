import { loginUserDto, registerUserDto, verifyUserDto } from './auth.schema';
import { z } from 'zod';
export declare class AuthService {
    private redisService;
    private authRepository;
    private emailService;
    constructor();
    registerUser(data: z.infer<typeof registerUserDto>): Promise<{
        message: string;
    }>;
    verifyUser(data: z.infer<typeof verifyUserDto>): Promise<{
        message: string;
        userWithoutPassword: {
            password: any;
            id: string;
            name: string;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            isVerified: boolean;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    loginUser(data: z.infer<typeof loginUserDto>): Promise<{
        message: string;
        userWithoutPassword: {
            password: any;
            id: string;
            name: string;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            isVerified: boolean;
        };
        accessToken: string;
        refreshToken: string;
    }>;
}
