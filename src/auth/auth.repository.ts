import { Injectable } from "@nestjs/common";
import prisma from "prisma/prismaClient";
import { z } from "zod";
import { registerUserDto } from "./auth.schema";

@Injectable()
export class AuthRepository{
    async createUser(data: z.infer <typeof registerUserDto>){
        try{
            const user = await prisma.user.create({
                data:{
                    email:data.email,
                    password:data.password,
                    name:data.name,
                }
            });
            return user;
        }catch(error){
            if (error instanceof Error) {
                throw new Error(`Failed to create user: ${error.message}`);
            } else {
                throw new Error("An unexpected error occurred while creating the user.");
            }
        }
    }
}