import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsMatch } from 'src/middlewares/validators';
import { SignedVerifyRequest } from './signed-verify.request';

export class ResetPasswordResetRequest extends SignedVerifyRequest {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  code: string;

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
