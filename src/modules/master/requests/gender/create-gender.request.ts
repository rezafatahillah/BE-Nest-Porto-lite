import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGenderRequest {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;
}
