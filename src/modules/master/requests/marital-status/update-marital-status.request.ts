import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateMaritalStatusRequest {
  @IsOptional()
  @IsString()
  @ApiProperty()
  name?: string;

}
