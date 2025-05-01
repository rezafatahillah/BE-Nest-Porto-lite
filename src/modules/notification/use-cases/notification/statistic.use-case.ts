import { Injectable } from '@nestjs/common';
import { NotificationService } from 'src/services';
import { QueryNotifiableRequest } from '../../requests';

@Injectable()
export class StatisticNotifiationUseCase {
  constructor(private readonly notificationService: NotificationService) {}

  async get(notificationRequest: QueryNotifiableRequest) {
    return await this.notificationService.statistic(notificationRequest);
  }
}
