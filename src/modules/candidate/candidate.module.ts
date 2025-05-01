import { Module } from '@nestjs/common';
import {
  CandidateController,
} from './controllers';

import {
  CandidateUseCase,
  CandidatePictureUseCase,
} from './use-cases';

@Module({
  controllers: [
    CandidateController,
  ],
  providers: [
    CandidateUseCase,
    CandidatePictureUseCase,
  ],
})
export class CandidateModule {}
