import { UpdateMedicalRequest } from './update-medical.request';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateMultipleMedicalRequest {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateMedicalRequest)
  medicals: UpdateMedicalRequest[];
}
