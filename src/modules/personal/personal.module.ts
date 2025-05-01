import { Module } from '@nestjs/common';
import {
  WorkController,
  EducationController,
  SkillController,
  OrganizationController,
  FamilyController,
  ReferenceController,
  LanguageController,
  DoctypeController,
  MedicalController,
} from './controllers';
import {
  WorkUseCase,
  EducationUseCase,
  SkillUseCase,
  OrganizationUseCase,
  FamilyUseCase,
  ReferenceUseCase,
  LanguageUseCase,
  DoctypeUseCase,
  DoctypeFileUseCase,
  MedicalUseCase,
} from './use-cases';

@Module({
  controllers: [
    WorkController,
    EducationController,
    SkillController,
    OrganizationController,
    FamilyController,
    ReferenceController,
    LanguageController,
    DoctypeController,
    MedicalController,
  ],
  providers: [
    WorkUseCase,
    EducationUseCase,
    SkillUseCase,
    OrganizationUseCase,
    FamilyUseCase,
    ReferenceUseCase,
    LanguageUseCase,
    DoctypeUseCase,
    DoctypeFileUseCase,
    MedicalUseCase,
  ],
})
export class PersonalModule {}
