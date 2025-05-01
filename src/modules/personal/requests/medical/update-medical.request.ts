import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsEnum, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { Option } from 'src/cores/enums';

export class UpdateMedicalRequest {

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  id: number; 

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  diseaseId: number;
  
  @IsNotEmpty()
  @IsEnum(Option)
  // @ValidateIf((o) => o.relationshipId)
  @ApiProperty({
    description: 'Education Status relationship code',
    enum: Option,
  })
  answer: Option;

}
