import { Injectable } from '@nestjs/common';
import { NotificationService } from 'src/services';
import { ReadNotificationRequest } from '../../requests/notification';

@Injectable()
export class ReadManyNotifiationUseCase {
  constructor(private readonly notificationService: NotificationService) {}

  async readMany(notificationRequest: ReadNotificationRequest) {
    return await this.notificationService.readByNotifiable(notificationRequest);
  }
}
