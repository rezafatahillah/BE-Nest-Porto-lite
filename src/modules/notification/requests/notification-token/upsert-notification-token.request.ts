import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { NotificationTokenType } from 'src/cores/enums';
import { IsExists } from 'src/middlewares/validators';

export class UpsertNotificationTokenRequest {
  @ApiProperty({
    description: 'The user id',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @IsExists('User', 'id')
  public userId: string;

  @ApiProperty({
    type: String,
    description: 'The notification type',
  })
  @IsNotEmpty()
  @IsEnum(NotificationTokenType)
  public type: NotificationTokenType;

  @ApiProperty({
    type: String,
    description: 'The notification token',
  })
  public token: string;
}
