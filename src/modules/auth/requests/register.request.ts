import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsUnique } from 'src/middlewares/validators';

export class RegisterRequest {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ default: 'New User' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @IsUnique('User', 'email')
  @ApiProperty({ default: 'register@nest.com' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;
}
