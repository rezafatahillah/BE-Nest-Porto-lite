import { Injectable } from '@nestjs/common';
import { NotificationService } from 'src/services';

@Injectable()
export class ReadNotifiationUseCase {
  constructor(private readonly notificationService: NotificationService) {}

  async read(id: number) {
    return await this.notificationService.read(id);
  }
}
