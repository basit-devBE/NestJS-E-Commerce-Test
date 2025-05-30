// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';

// @Injectable()
// export class RawBodyMiddleware implements NestMiddleware {
//   use(req: Request, res: Response, next: NextFunction) {
//     if (req.originalUrl === '/webhook/stripe') {
//       console.log('RawBodyMiddleware activated for Stripe webhook');
//       let data = Buffer.alloc(0);
      
//       req.on('data', (chunk: Buffer) => {
//         data = Buffer.concat([data, chunk]);
//       });
      
//       req.on('end', () => {
//         (req as any).rawBody = data;
//         next();
//       });
//     } else {
//       next();
//     }
//   }
// }