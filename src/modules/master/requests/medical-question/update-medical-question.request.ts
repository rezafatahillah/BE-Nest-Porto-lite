import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateMedicalQuestionRequest {
  @IsOptional()
  @IsString()
  @ApiProperty()
  name?: string;

}
