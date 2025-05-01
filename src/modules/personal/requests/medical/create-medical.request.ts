import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Option } from 'src/cores/enums';

export class CreateMedicalRequest {

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
