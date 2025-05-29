import { Request, Response } from 'express';
export declare class AuthController {
    private authservice;
    constructor();
    register(req: Request, res: Response): Promise<void>;
    verify(req: Request, res: Response): Promise<void>;
    login(req: Request, res: Response): Promise<void>;
    logout(req: Request, res: Response): Promise<void>;
}
