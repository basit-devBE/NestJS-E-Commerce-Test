import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { AuthRepository } from './auth.repository';
import { registerUserDto } from './auth.schema';
import { z } from 'zod';    

@Injectable()
export class AuthService {
    private redisService:RedisService
    private authRepository: AuthRepository

    constructor(){
        this.redisService= new RedisService()
        this.authRepository = new AuthRepository()
    }

    async registerUser(data: z.infer<typeof registerUserDto>){
        
    }
}
