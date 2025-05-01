import { Module } from '@nestjs/common';
import {
  GenderController,
  ReligionController,
  DegreeController,
  MaritalStatusController,
  SkillLevelController,
  SkillCommonController,
  DiseaseController,
  TaxController,
  JobFieldController,
  JobTypeController,
  MedicalQuestionController,
} from './controllers';
import {
  GenderUseCase,
  ReligionUseCase,
  DegreeUseCase,
  MaritalStatusUseCase,
  SkillLevelUseCase,
  SkillCommonUseCase,
  DiseaseUseCase,
  TaxUseCase,
  JobFieldUseCase,
  JobTypeUseCase,
  MedicalQuestionUseCase,
} from './use-cases';

@Module({
  controllers: [
    GenderController,
    ReligionController,
    DegreeController,
    MaritalStatusController,
    SkillLevelController,
    SkillCommonController,
    DiseaseController,
    TaxController,
    JobFieldController,
    JobTypeController,
    MedicalQuestionController,
  ],
  providers: [
    GenderUseCase,
    ReligionUseCase,
    DegreeUseCase,
    MaritalStatusUseCase,
    SkillLevelUseCase,
    SkillCommonUseCase,
    DiseaseUseCase,
    TaxUseCase,
    JobFieldUseCase,
    JobTypeUseCase,
    MedicalQuestionUseCase,
  ],
})
export class MasterModule {}
