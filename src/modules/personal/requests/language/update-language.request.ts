import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Level } from 'src/cores/enums';

export class UpdateLanguageRequest {

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
