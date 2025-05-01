import { CreateFamilyRequest } from './create-family.request';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMultipleFamilyRequest {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFamilyRequest)
  @IsOptional()
  familys: CreateFamilyRequest[];
  
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFamilyRequest)
  @IsOptional()
  siblings: CreateFamilyRequest[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFamilyRequest)
  @IsOptional()
  childrens: CreateFamilyRequest[];
}
