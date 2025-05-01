import { Global, Module } from '@nestjs/common';
import { PermissionService, RoleService } from './access';
import { AuthService, IdentityService, JwtService } from './auth';
import { NotificationService, NotificationTokenService } from './notification';
import {
  DirectoryService,
  FileDirectoryService,
  FileService,
  StorageService,
} from './storage';

import { UserService } from './user';

import {
  DegreeService,
  DiseaseService,
  GenderService,
  JobFieldService,
  JobTypeService,
  MaritalStatusService,
  MedicalQuestionService,
  ReligionService,
  SkillCommonService,
  SkillLevelService,
  TaxService,
} from './master';

import {
  WorkService,
  EducationService,
  SkillService,
  FamilyService,
  OrganizationService,
  ReferenceService,
  LanguageService,
  DoctypeService,
  MedicalService,
} from './personal';

import { CandidateService } from './candidate';

import { CodeService } from './code';

@Global()
@Module({
  providers: [
    RoleService,
    PermissionService,
    AuthService,
    IdentityService,
    JwtService,
    NotificationService,
    NotificationTokenService,
    DirectoryService,
    FileDirectoryService,
    FileService,
    StorageService,
    UserService,
    DegreeService,
    DiseaseService,
    GenderService,
    JobFieldService,
    JobTypeService,
    MaritalStatusService,
    MedicalQuestionService,
    ReligionService,
    SkillCommonService,
    SkillLevelService,
    TaxService,
    WorkService,
    EducationService,
    SkillService,
    FamilyService,
    OrganizationService,
    ReferenceService,
    LanguageService,
    CodeService,
    CandidateService,
    DoctypeService,
    MedicalService,
  ],
  exports: [
    RoleService,
    PermissionService,
    AuthService,
    IdentityService,
    JwtService,
    NotificationService,
    NotificationTokenService,
    DirectoryService,
    FileDirectoryService,
    FileService,
    StorageService,
    UserService,
    DegreeService,
    DiseaseService,
    GenderService,
    JobFieldService,
    JobTypeService,
    MaritalStatusService,
    MedicalQuestionService,
    ReligionService,
    SkillCommonService,
    SkillLevelService,
    TaxService,
    WorkService,
    EducationService,
    SkillService,
    FamilyService,
    OrganizationService,
    ReferenceService,
    LanguageService,
    CodeService,
    CandidateService,
    DoctypeService,
    MedicalService,
  ],
})
export class ServiceModule {}
