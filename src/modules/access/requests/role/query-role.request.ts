import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class QueryRoleRequest {
  @ApiProperty({
    description: 'The name of status',
    type: String,
  })
  @IsString()
  @IsOptional()
  public name?: string;
}
