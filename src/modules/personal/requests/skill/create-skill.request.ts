import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString, ValidateIf } from 'class-validator';
import { Level } from 'src/cores/enums';

export class CreateSkillRequest {

  @IsNotEmpty()
  @ValidateIf((o) => typeof o.skillCommonId === 'number')
  @IsNumber()
  @ValidateIf((o) => typeof o.skillCommonId === 'string')
  @IsString()
  @ApiProperty({ description: 'Skill ID or Name' })
  skillCommonId: number | string;

  // @IsNotEmpty()
  // @IsNumber()
  // @ApiProperty()
  // skillCommonId: number;
  // // skillCommonId: {number};

  @IsNotEmpty()
  @IsEnum(Level)
  // @ValidateIf((o) => o.relationshipId)
  @ApiProperty({
    description: 'Education Status relationship code',
    enum: Level,
  })
  skillLevel: Level;
}
