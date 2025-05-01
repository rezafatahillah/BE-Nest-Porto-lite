import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateReligionRequest {
  @IsOptional()
  @IsString()
  @ApiProperty()
  name?: string;

}
