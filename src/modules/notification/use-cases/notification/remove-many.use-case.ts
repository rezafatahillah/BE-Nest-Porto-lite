import { Injectable } from '@nestjs/common';
import { NotificationService } from 'src/services';
import { RemoveNotificationRequest } from '../../requests/notification';

@Injectable()
export class RemoveManyNotifiationUseCase {
  constructor(private readonly notificationService: NotificationService) {}

  async removeMany(notificationRequest: RemoveNotificationRequest) {
    return await this.notificationService.removeByNotifiable(
      notificationRequest,
    );
  }

  async removeForceMany(notificationRequest: RemoveNotificationRequest) {
    return await this.notificationService.removeForceByNotifiable(
      notificationRequest,
    );
  }
}
