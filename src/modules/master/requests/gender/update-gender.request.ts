import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateGenderRequest {
  @IsOptional()
  @IsString()
  @ApiProperty()
  name?: string;

}
