import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateTaxRequest {
  @IsOptional()
  @IsString()
  @ApiProperty()
  name?: string;

}
