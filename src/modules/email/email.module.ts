import { Module } from '@nestjs/common';
import { EmailController } from './controllers';

@Module({
  controllers: [EmailController],
  providers: [],
})
export class EmailModule {}
