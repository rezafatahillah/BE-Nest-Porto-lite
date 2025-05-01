import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateJobTypeRequest {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;
}
