import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ReadRequest {
  @ApiProperty({
    description: 'The file path',
    type: String,
  })
  @IsString()
  public path!: string;
}
