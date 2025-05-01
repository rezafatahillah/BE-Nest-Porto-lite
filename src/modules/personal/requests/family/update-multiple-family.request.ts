import { UpdateFamilyRequest } from './update-family.request';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateMultipleFamilyRequest {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateFamilyRequest)
  familys: UpdateFamilyRequest[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateFamilyRequest)
  siblings: UpdateFamilyRequest[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateFamilyRequest)
  childrens: UpdateFamilyRequest[];
}
