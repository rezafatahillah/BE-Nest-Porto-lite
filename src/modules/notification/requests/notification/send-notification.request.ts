import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import _ from 'lodash';
import { NotificationType } from 'src/cores/enums';
import { IsExists } from 'src/middlewares/validators';

export class SendNotificationDataRequest {
  @ApiProperty({
    description: 'The notification type',
    type: NotificationType,
  })
  @IsString()
  @IsEnum(NotificationType)
  @Transform(({ value }) => {
    return _.isEmpty(value) ? NotificationType.Unknown : value;
  })
  public type: NotificationType;

  @ApiProperty({
    description: 'The notification title',
    type: String,
  })
  @IsString()
  public title: string;

  @ApiProperty({
    description: 'The notification category',
    type: String,
  })
  @IsString()
  public category: string;

  @ApiProperty({
    description: 'The notification avatar url',
    type: String,
  })
  @IsOptional()
  @IsUrl()
  public avatarUrl?: string;
}

export class SendNotificationRequest {
  @ApiProperty({
    description: 'The notification token',
    type: String,
  })
  @IsString()
  @IsExists('NotificationToken', 'token')
  public token!: string;

  @ApiProperty({
    type: Object,
    description: 'The notification data',
  })
  @Type(() => SendNotificationDataRequest)
  @ValidateNested()
  public data: SendNotificationDataRequest;
}
