import { Module } from '@nestjs/common';
import {
  CodeController,
} from './controllers';

import {
  CodeUseCase,
} from './use-cases';

@Module({
  controllers: [
    CodeController,
  ],
  providers: [
    CodeUseCase,
  ],
})
export class CodeModule {}
