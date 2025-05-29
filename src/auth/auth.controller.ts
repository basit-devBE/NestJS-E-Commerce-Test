import { Controller, Post, Req, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Request, Response } from 'express';

@Controller("auth")
export class AuthController {
    private authservice: AuthService

    constructor() {
        this.authservice = new AuthService();
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
}
