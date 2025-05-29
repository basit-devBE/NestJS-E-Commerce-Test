import { registerUserDto } from './auth.schema';
import { z } from 'zod';
export declare class AuthService {
    private redisService;
    private authRepository;
    constructor();
    registerUser(data: z.infer<typeof registerUserDto>): Promise<void>;
}
