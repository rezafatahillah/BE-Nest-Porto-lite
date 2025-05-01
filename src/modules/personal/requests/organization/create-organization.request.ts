import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { IsExists } from 'src/middlewares/validators';

export class CreateOrganizationRequest {

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  type: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  year: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  position: string;
}
