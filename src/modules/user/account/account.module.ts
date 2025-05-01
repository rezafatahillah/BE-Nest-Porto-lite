import { Module } from '@nestjs/common';
import { AccountController } from './controllers';
import {
  AccountAccessUseCase,
  AccountCredentialUseCase,
  AccountStatusUseCase,
  AccountUseCase,
} from './use-cases';

@Module({
  controllers: [AccountController],
  providers: [
    AccountUseCase,
    AccountCredentialUseCase,
    AccountStatusUseCase,
    AccountAccessUseCase,
  ],
})
export class AccountModule {}
