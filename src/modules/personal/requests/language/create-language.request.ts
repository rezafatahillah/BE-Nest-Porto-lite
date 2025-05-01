import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Level } from 'src/cores/enums';

export class CreateLanguageRequest {

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;
  
  @IsNotEmpty()
  @IsEnum(Level)
  // @ValidateIf((o) => o.relationshipId)
  @ApiProperty({
    description: 'Education Status relationship code',
    enum: Level,
  })
  skillLevel: Level;
}
