import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';
import { IsMatch } from 'src/middlewares/validators';

export class UpdatePasswordRequest {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  currentPassword: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsMatch('password', {
    message: 'Password confirmation does not match password',
  })
  @ApiProperty()
  passwordConfirmation: string;
}
