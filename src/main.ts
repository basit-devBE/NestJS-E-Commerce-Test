import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Add this middleware to get raw body
  app.use(bodyParser.json({
    verify: (req: any, res, buf) => {
      req.rawBody = buf;
    }
  }));

  app.use(cookieParser())
  
  await app.listen(
    process.env.PORT || 4000,
    () => console.log(`Server is running on port ${process.env.PORT || 4000}`),
  );
}
bootstrap();