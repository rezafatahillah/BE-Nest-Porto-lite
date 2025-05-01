import { CreateMedicalRequest } from './create-medical.request';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMultipleMedicalRequest {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMedicalRequest)
  medicals: CreateMedicalRequest[];
}
