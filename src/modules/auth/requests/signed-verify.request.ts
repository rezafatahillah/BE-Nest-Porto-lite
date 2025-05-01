import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignedVerifyRequest {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  signed: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  token: string;
}
