import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateJobTypeRequest {
  @IsOptional()
  @IsString()
  @ApiProperty()
  name?: string;

}
