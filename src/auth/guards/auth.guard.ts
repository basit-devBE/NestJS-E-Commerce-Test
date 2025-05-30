import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend the Express Request interface
declare global {
  namespace Express {
    interface Request {
      userId?: {
        id: string | number;
      };
    }
  }
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'No authorization header provided' });
    }

    // Extract the token from 'Bearer <token>' format
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    console.log('Token received:', token);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string, [key: string]: any };
      console.log('Decoded JWT:', decoded);
      req.userId = decoded.userId  // Attach user info to request object
      console.log('User ID attached to request:', req.userId);
      next();
    } catch (error) {
      console.error('JWT verification failed:', error);
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  }
}