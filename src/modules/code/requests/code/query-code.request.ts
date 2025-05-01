import { PaginationRequest } from 'src/middlewares/request';
import { SortOrder } from 'src/cores/enums';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

// export class QueryEducationRequest extends PaginationRequest {}
export class QueryCodeRequest extends PaginationRequest {
  @ApiPropertyOptional({
    description: 'Filter by type',
    type: String,
  })
  @IsOptional()
  type?: string;

  @ApiPropertyOptional({
    description: 'Sorting order, either asc or desc',
    enum: SortOrder,
  })
  @IsOptional()
  @IsEnum(SortOrder, {
    message: 'sortBy must be either asc or desc',
  })
  sortBy?: SortOrder;
}

