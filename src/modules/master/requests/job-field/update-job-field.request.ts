import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateJobFieldRequest {
  @IsOptional()
  @IsString()
  @ApiProperty()
  name?: string;

}
