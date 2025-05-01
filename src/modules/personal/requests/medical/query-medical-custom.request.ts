import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class QueryMedicalCustomRequest {
  @ApiProperty({
    type: Number,
    description: 'The current page',
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Transform((params) => parseInt(params.value))
  public page?: number;

  @ApiProperty({
    type: Number,
    description: 'The limitation of page',
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(70) 
  @Transform((params) => parseInt(params.value))
  public perPage?: number = 70;
}
