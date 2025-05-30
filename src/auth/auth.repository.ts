import { Injectable } from "@nestjs/common";
import prisma from "prisma/prismaClient";
import { z } from "zod";
import { registerUserDto } from "./auth.schema";

@Injectable()
export class AuthRepository{
    async createUser(data: z.infer <typeof registerUserDto>,isVerified:boolean){
        try{
            const user = await prisma.user.create({
                data:{
                    email:data.email,
                    password:data.password,
                    name:data.name,
                    isVerified: isVerified, 
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

    async findUserByEmail(email:string){
        try{
            const user = await prisma.user.findUnique({
                where: {
                    email: email,
                },
            });
            return user;
        }catch(error){
            if (error instanceof Error) {
                throw new Error(`Failed to find user by email: ${error.message}`);
            } else {
                throw new Error("An unexpected error occurred while finding the user.");
            }
        }
    }

    async findUserById(id: string) {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: id,
                },
            });
            return user;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to find user by ID: ${error.message}`);
            } else {
                throw new Error("An unexpected error occurred while finding the user.");
            }
        }
    }
}