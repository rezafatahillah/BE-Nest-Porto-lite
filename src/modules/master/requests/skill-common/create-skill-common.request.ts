import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class CreateSkillCommonRequest {

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  published: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;
}
