import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateDiseaseRequest {
  @IsOptional()
  @IsString()
  @ApiProperty()
  name?: string;

}
