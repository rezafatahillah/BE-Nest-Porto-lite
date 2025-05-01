import { PickType } from '@nestjs/swagger';
import { QueryNotifiableRequest } from './query-notifiable.request';

export class RemoveNotificationRequest extends PickType(
  QueryNotifiableRequest,
  ['notifiableType', 'notifiableId'],
) {}
