import { CreateEducationRequest } from './create-education.request';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMultipleEducationRequest {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEducationRequest)
  @IsOptional()
  formals: CreateEducationRequest[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEducationRequest)
  @IsOptional()
  informals: CreateEducationRequest[];
}
