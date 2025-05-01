import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTaxRequest {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;
}
