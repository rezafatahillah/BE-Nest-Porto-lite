import { Injectable } from '@nestjs/common';
import { NotificationService } from 'src/services';
import { QueryNotificationRequest } from '../../requests';

@Injectable()
export class GetNotifiationUseCase {
  constructor(private readonly notificationService: NotificationService) {}

  async findAll(notificationRequest: QueryNotificationRequest) {
    return await this.notificationService.findByNotifiable(notificationRequest);
  }
}
