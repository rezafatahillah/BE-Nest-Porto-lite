import { UpdateEducationRequest } from './update-education.request';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateMultipleEducationRequest {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateEducationRequest)
  formals: UpdateEducationRequest[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateEducationRequest)
  informals: UpdateEducationRequest[];
}
