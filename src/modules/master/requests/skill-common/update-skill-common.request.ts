import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateSkillCommonRequest {

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  published?: number;

  @IsOptional()
  @IsString()
  @ApiProperty()
  name?: string;
}
