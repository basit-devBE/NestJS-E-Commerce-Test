import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository'; // Add this import
import { validateRequest } from 'src/utils/validate';
import { loginUserDto, registerUserDto, verifyUserDto } from './auth.schema';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthRepository], // Add AuthRepository to providers
  exports: [AuthRepository], // Add this exports array
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(validateRequest(registerUserDto))
      .forRoutes({ path: '/auth/register', method: RequestMethod.POST });

    consumer
      .apply(validateRequest(verifyUserDto))
      .forRoutes({ path: '/auth/verify', method: RequestMethod.POST });

    consumer
      .apply(validateRequest(loginUserDto))
      .forRoutes({ path: '/auth/login', method: RequestMethod.POST });
  }
}