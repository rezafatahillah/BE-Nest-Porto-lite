import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { PaginationRequest } from 'src/middlewares/request';

export class QueryNotifiableRequest extends PaginationRequest {
  @ApiProperty({
    type: String,
    description: 'The notifiable type',
  })
  @IsNotEmpty()
  @IsString()
  public notifiableType: string;

  @ApiProperty({
    type: String,
    description: 'The notifiable id',
  })
  @IsNotEmpty()
  @IsString()
  public notifiableId: string;
}
