import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { AuthRepository } from './auth.repository';
import { loginUserDto, registerUserDto, verifyUserDto } from './auth.schema';
import { z } from 'zod';    
import { comparePassword, hashPassword } from 'src/shared/bcrypt';
import { EmailService } from 'src/shared/emails/emailservice';
import { generateAccessToken, generateRefreshToken } from 'src/utils/jwt';

@Injectable()
export class AuthService {
    private redisService:RedisService
    private authRepository: AuthRepository
    private emailService:EmailService

    constructor(){
        this.redisService= new RedisService()
        this.authRepository = new AuthRepository()
    }

    async registerUser(data: z.infer<typeof registerUserDto>){
        try{
            const existingUser = await this.authRepository.findUserByEmail(data.email)
            if(existingUser){
                throw new Error("User already exists with this email address")
            }
            const hashedPassword = await hashPassword(data.password);
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); 
            const expiresIn = new Date(Date.now() + 5 * 60 * 1000).toISOString(); 
            await this.redisService.delifExists(data.email);
            await this.redisService.set(data.email, JSON.stringify({password: hashedPassword, name:data.name, Code:verificationCode, expiresIn}), 60 * 60 * 2);
            const sendEmail = await EmailService.sendVerificationEmail(data.email, verificationCode,data.name, expiresIn);
            if(!sendEmail){
                throw new Error("Failed to send verification email");
            }
            return { message: "User registered successfully. Please check your email for the verification code." };
        }catch(error){
            if (error instanceof Error) {
                throw new Error(`Failed to check existing user: ${error.message}`);
            } else {
                throw new Error("An unexpected error occurred while checking for existing user.");
            }
        }

    }

    async verifyUser(data:z.infer<typeof verifyUserDto>){
        try{
            const userData = await this.redisService.get(data.email);
            if(!userData){
                throw new Error("invalid email,please register first");
            }
            const parsedData = JSON.parse(userData as string);
            if(parsedData.Code !== data.verificationCode){
                throw new Error("Invalid verification code");
            }
            if(new Date(parsedData.expiresIn) < new Date()){
                throw new Error("Verification code has expired");
            }
            const user = await this.authRepository.createUser(
                {
                    email: data.email,
                    password: parsedData.password,
                    name: parsedData.name
                },
                true
            );
            if(!user){
                throw new Error("Failed to create user");
            }
            const welcomeEmailSent = await EmailService.sendWelcomeEmail(data.email, parsedData.name);
            if(!welcomeEmailSent){
                throw new Error("Failed to send welcome email");
            }
            const accessToken = await generateAccessToken({userId: user.id, email: user.email}, '2h');
            const refreshToken = await generateAccessToken({userId: user.id, email: user.email}, '7d');                                                                     
            const userWithoutPassword = {
                ...user,
                password: undefined 
            }
            return { message: "User verified successfully. Welcome email sent.", userWithoutPassword,accessToken,refreshToken };
        }catch(error){
            if (error instanceof Error) {
                throw new Error(`${error.message}`);
            } else {
                throw new Error("An unexpected error occurred while verifying the user.");
            }
        }
    }

    async loginUser(data:z.infer<typeof loginUserDto>){
        try{
            const user = await this.authRepository.findUserByEmail(data.email);
            if(!user){
                throw new Error("User not found");
            }
            if(!user.isVerified){
                throw new Error("User is not verified. Please verify your email first");
            }
            const validPassword = await comparePassword(data.password, user.password);
            if(!validPassword){
                throw new Error("Invalid password")
            }
            const accessToken = await generateAccessToken({userId: user.id, email: user.email}, '2h');
            const refreshToken = await generateRefreshToken({userId: user.id, email: user.email}, '7d');
            const userWithoutPassword = {
                ...user,
                password: undefined
            }
            return { message: "User logged in successfully", userWithoutPassword, accessToken ,refreshToken};
        }catch(error){
            if (error instanceof Error) {
                throw new Error(`Failed to login user: ${error.message}`);
            } else {
                throw new Error("An unexpected error occurred while logging in the user.");
            }
        }
    }

    
}
