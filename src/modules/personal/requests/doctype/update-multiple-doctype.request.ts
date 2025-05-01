import { UpdateDoctypeRequest } from './update-doctype.request';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateMultipleDoctypeRequest {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateDoctypeRequest)
  doctypes: UpdateDoctypeRequest[];
}
