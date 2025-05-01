import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsExists, IsUnique } from 'src/middlewares/validators';

export class CreateUserRequest {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @IsUnique('User', 'email')
  @ApiProperty()
  email: string;

  @IsOptional()
  @IsNumber()
  @IsExists('StgFile', 'id')
  @ApiProperty()
  pictureId?: number;
}
