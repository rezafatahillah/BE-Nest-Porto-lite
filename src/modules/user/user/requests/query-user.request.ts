import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { PaginationRequest } from 'src/middlewares/request';

export class QueryUserRequest extends PaginationRequest {
  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  @Transform(({ value }) => value === 'true')
  account?: boolean;
}
