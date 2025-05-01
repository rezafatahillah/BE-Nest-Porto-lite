import { Module } from '@nestjs/common';
import { UserController } from './controllers';
import { UserPictureUseCase, UserUseCase } from './use-cases';

@Module({
  controllers: [UserController],
  providers: [UserUseCase, UserPictureUseCase],
})
export class UserModule {}
