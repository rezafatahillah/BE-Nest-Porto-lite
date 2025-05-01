import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateSkillLevelRequest {
  @IsOptional()
  @IsString()
  @ApiProperty()
  name?: string;

}
