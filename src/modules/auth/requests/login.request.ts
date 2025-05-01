import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class LoginRequest {
  @IsNotEmpty()
  @ApiProperty({ default: 'admin@nest.com' })
  username: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  rememberMe?: boolean;
}
