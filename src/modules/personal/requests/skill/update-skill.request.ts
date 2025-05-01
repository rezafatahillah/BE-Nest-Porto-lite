import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Level } from 'src/cores/enums';

export class UpdateSkillRequest {

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  skillCommonId: number;

  @IsNotEmpty()
  @IsEnum(Level)
  // @ValidateIf((o) => o.relationshipId)
  @ApiProperty({
    description: 'Education Status relationship code',
    enum: Level,
  })
  skillLevel: Level;

}
