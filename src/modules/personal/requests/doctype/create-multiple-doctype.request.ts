import { CreateDoctypeRequest } from './create-doctype.request';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMultipleDoctypeRequest {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDoctypeRequest)
  doctypes: CreateDoctypeRequest[];
}
