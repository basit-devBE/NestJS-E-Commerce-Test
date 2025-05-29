import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Request} from 'express';
import jwt from 'jsonwebtoken';
import {Observable} from 'rxjs';

// Extend the Express Request interface
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

@Injectable()
export class AuthGuard implements CanActivate{
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            return false;
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return false;
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            request.userId = decoded?.id; // Attach user info to request object
            return true;
        } catch (error) {
            console.error('JWT verification failed:', error);
            return false;
        }
    }
}