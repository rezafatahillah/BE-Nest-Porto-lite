import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Doc } from 'src/cores/enums';
import { IsExists } from 'src/middlewares/validators';

export class CreateDoctypeRequest {

  @IsOptional()
  @IsNumber()
  @IsExists('StgFile', 'id')
  @ApiProperty()
  fileId?: number;

  @IsOptional()
  @IsString()
  @ApiProperty()
  name: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  required: number;

  @IsNotEmpty()
  @IsEnum(Doc)
  // @ValidateIf((o) => o.relationshipId)
  @ApiProperty({
    description: 'Doctype Status relationship code',
    enum: Doc,
  })
  group: Doc;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  active: number;

}
