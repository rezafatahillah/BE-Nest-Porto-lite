import { Injectable } from '@nestjs/common';
import { NotificationService } from 'src/services';

@Injectable()
export class RemoveNotifiationUseCase {
  constructor(private readonly notificationService: NotificationService) {}

  async remove(id: number) {
    return await this.notificationService.remove(id);
  }

  async removeForce(id: number) {
    return await this.notificationService.removeForce(id);
  }
}
