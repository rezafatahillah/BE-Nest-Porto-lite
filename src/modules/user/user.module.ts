import { Module } from '@nestjs/common';
import { ProfileModule } from './profile';
import { UserModule as UserResourceModule } from './user';
import { AccountModule } from './account';

@Module({
  imports: [ProfileModule, UserResourceModule, AccountModule],
})
export class UserModule {}
