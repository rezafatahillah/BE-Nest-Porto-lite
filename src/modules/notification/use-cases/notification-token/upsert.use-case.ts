import { Injectable } from '@nestjs/common';
import { NotificationTokenService } from 'src/services';
import { Transactional } from '@nestjs-cls/transactional';
import { UpsertNotificationTokenRequest } from '../../requests';
import { Prisma } from '@prisma/client';
import { CreateNotificationTokenDto } from 'src/cores/dtos';

@Injectable()
export class UpsertNotifiationTokenUseCase {
  constructor(
    private readonly notificationTokenService: NotificationTokenService,
  ) {}

  @Transactional()
  async upsert(upsertRequest: UpsertNotificationTokenRequest) {
    return await this.notificationTokenService.upsert<
      Prisma.NotificationTokenGetPayload<Prisma.NotificationDefaultArgs>
    >(
      new CreateNotificationTokenDto({
        userId: upsertRequest.userId,
        type: upsertRequest.type,
      }),
    );
  }
}
