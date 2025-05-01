import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AccessModule } from './access';
import { StorageModule } from './storage';
import { NotificationModule } from './notification';
import { EmailModule } from './email';
import { UserModule } from './user';
import { MasterModule } from './master';
import { PersonalModule } from './personal';
import { CodeModule } from './code';
import { CandidateModule } from './candidate';

@Module({
  imports: [
    AuthModule,
    UserModule,
    AccessModule,
    StorageModule,
    NotificationModule,
    EmailModule,
    MasterModule,
    PersonalModule,
    CodeModule,
    CandidateModule,
  ],
})
export class ModulesModule {}
