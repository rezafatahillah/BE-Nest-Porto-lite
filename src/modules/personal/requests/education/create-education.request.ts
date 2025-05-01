import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { EducationStatus, Education } from 'src/cores/enums';

export class CreateEducationRequest {
  @IsNotEmpty()
  @IsEnum(Education)
  // @ValidateIf((o) => o.relationshipId)
  @ApiProperty({
    description: 'Education relationship code',
    enum: Education,
  })
  education: Education;

  @IsNotEmpty()
  @IsEnum(EducationStatus)
  // @ValidateIf((o) => o.relationshipId)
  @ApiProperty({
    description: 'Education Status relationship code',
    enum: EducationStatus,
  })
  status: EducationStatus;

  @IsOptional()
  @IsString()
  @ApiProperty()
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  study?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  yearStart?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  yearEnd?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  yearInformal?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  city?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  duration?: number;

  @IsBoolean()
  @IsOptional()
  certificate?: boolean;
}
