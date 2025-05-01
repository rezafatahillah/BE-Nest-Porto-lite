import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { Family, Education } from 'src/cores/enums';

export class CreateFamilyRequest {
  @IsOptional()
  @IsNumber()
  @ApiProperty()
  main: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsEnum(Family)
  // @ValidateIf((o) => o.relationshipId)
  @ApiProperty({
    description: 'Family relationship code',
    enum: Family,
  })
  status: Family;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  birthDate: string;

  @IsNotEmpty()
  @IsEnum(Education)
  // @ValidateIf((o) => o.relationshipId)
  @ApiProperty({
    description: 'Education relationship code',
    enum: Education,
  })
  education: Education;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  job: string;
}
