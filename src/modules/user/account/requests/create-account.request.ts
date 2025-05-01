import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUUID,
} from 'class-validator';
import { IsExists, IsMatch } from 'src/middlewares/validators';

export class CreateAccountRequest {
  @IsNotEmpty()
  @IsUUID()
  @IsExists('User', 'id')
  @ApiProperty()
  userId: string;

  @IsNotEmpty()
  @IsNumber()
  @IsExists('Role', 'id')
  @ApiProperty()
  roleId: number;

  @IsOptional()
  @IsArray()
  @IsNumber({ allowNaN: false }, { each: true })
  @IsExists('Permission', 'id', { each: true })
  @ApiProperty()
  permissions: number[];

  @IsOptional()
  @IsString()
  @IsStrongPassword()
  @ApiProperty()
  password?: string;

  @IsOptional()
  @IsString()
  @IsMatch('password', {
    message: 'Password confirmation does not match password',
  })
  @ApiProperty()
  passwordConfirmation?: string;
}
