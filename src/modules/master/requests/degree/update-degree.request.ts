import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateDegreeRequest {
  @IsOptional()
  @IsString()
  @ApiProperty()
  name?: string;

}
