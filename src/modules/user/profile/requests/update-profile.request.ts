import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateProfileRequest {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;
}
