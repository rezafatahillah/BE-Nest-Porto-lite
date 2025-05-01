import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDegreeRequest {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;
}
