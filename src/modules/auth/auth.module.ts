import { Module } from '@nestjs/common';
import { AuthController } from './controllers';
import {
  LoginUseCase,
  RegisterUseCase,
  LogoutUseCase,
  RefreshUseCase,
  EmailVerificationUseCase,
  ResetPasswordUseCase,
} from './use-cases';

@Module({
  controllers: [AuthController],
  providers: [
    RegisterUseCase,
    LoginUseCase,
    LogoutUseCase,
    RefreshUseCase,
    EmailVerificationUseCase,
    ResetPasswordUseCase,
  ],
})
export class AuthModule {}
