import { Module } from '@nestjs/common';
import { ProfileController } from './controllers';
import {
  ProfilePasswordUseCase,
  ProfilePictureUseCase,
  ProfileUseCase,
  ProfileUsernameUseCase,
} from './use-cases';

@Module({
  controllers: [ProfileController],
  providers: [
    ProfileUseCase,
    ProfilePictureUseCase,
    ProfileUsernameUseCase,
    ProfilePasswordUseCase,
  ],
})
export class ProfileModule {}
