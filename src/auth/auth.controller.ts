import { Controller, Post, Req, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Request, Response } from 'express';
import { generateAccessToken,generateRefreshToken} from "src/utils/jwt";
import jwt from 'jsonwebtoken';
import { AuthRepository } from "./auth.repository";
import dotenv from 'dotenv';
dotenv.config();
console.log("JWT_SECRET:", process.env.JWT_SECRET); // Log the JWT secret to verify it's loaded correctly
@Controller("auth")
export class AuthController {
    private authservice: AuthService
    private authrepository:AuthRepository

    constructor() {
        this.authservice = new AuthService();
        this.authrepository = new AuthRepository();
    }
    @Post('register')
    async register(@Req() req: Request, @Res() res: Response) {
        try{
            const data = req.body;
            const result = await this.authservice.registerUser(data);

            res.status(201).json(result);
        }catch(error){
            if (error instanceof Error) {
                res.status(400).json({ message: `Failed to register user: ${error.message}` });
            } else {
                res.status(500).json({ message: "An unexpected error occurred while registering the user." });
            }
        }
    }

    @Post('verify')
    async verify(@Req() req: Request, @Res() res: Response) {
        try {
            const data = req.body;
            console.log("Data received for verification:", data);
            const result = await this.authservice.verifyUser(data);
            res.cookie('refreshToken',result.refreshToken,{
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', 
                maxAge: 60 * 60 * 24 * 7 * 1000 
            })

            res.status(200).json(
                { message: "User verified successfully", 
                user: result.userWithoutPassword,
                accessToken: result.accessToken }
            );
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: `Failed to verify user: ${error.message}` });
            } else {
                res.status(500).json({ message: "An unexpected error occurred while verifying the user." });
            }
        }
    }

    @Post('login')
    async login(@Req() req: Request, @Res() res: Response) {
        try {
            const data = req.body;
            const result = await this.authservice.loginUser(data);
            res.cookie('refreshToken',result.refreshToken,{
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', 
                maxAge: 60 * 60 * 24 * 7 * 1000 
            })
            res.status(200).json(
                { message: "User logged in successfully", 
                user: result.userWithoutPassword,
                accessToken: result.accessToken }
            );
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: `Failed to login user: ${error.message}` });
            } else {
                res.status(500).json({ message: "An unexpected error occurred while logging in the user." });
            }
        }
    }

    @Post('logout')
    async logout(@Req() req: Request, @Res() res: Response) {
        try {
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', 
            });
            res.status(200).json({ message: "User logged out successfully" });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: `Failed to logout user: ${error.message}` });
            } else {
                res.status(500).json({ message: "An unexpected error occurred while logging out the user." });
            }
        }
    }

    @Post('refresh-token')
    async refreshToken(@Req() req: Request, @Res() res: Response) {
        try {
            const existingRefreshToken = req?.cookies?.refreshToken;
            if (!existingRefreshToken) {
                return res.status(401).json({ message: "Refresh token is required" });
            }
            const decoded = jwt.verify(existingRefreshToken, process.env.JWT_REFRESH_SECRET) as { id: string, [key: string]: any };
            console.log("Decoded JWT from refresh token:", decoded);
            const user = await this.authrepository.findUserById(decoded?.userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const accessToken = await generateAccessToken({userId: user.id, email: user.email}, '2h');
            const refreshToken = await generateRefreshToken({userId: user.id, email: user.email}, '7d');       
             res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', 
                maxAge: 60 * 60 * 24 * 7 * 1000 
            });
            res.status(200).json({ accessToken: accessToken });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: `Failed to refresh access token: ${error.message}` });
            } else {
                res.status(500).json({ message: "An unexpected error occurred while refreshing the access token." });
            }
        }
    }
}
