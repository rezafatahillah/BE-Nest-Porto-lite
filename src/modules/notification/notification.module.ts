import { Module } from '@nestjs/common';
import {
  NotificationController,
  NotificationSelfController,
  NotificationTokenController,
} from './controllers';
import {
  GetNotifiationUseCase,
  ReadNotifiationUseCase,
  ReadManyNotifiationUseCase,
  RemoveNotifiationUseCase,
  RemoveManyNotifiationUseCase,
  UpsertNotifiationTokenUseCase,
  GenerateNotifiationTokenUseCase,
  StatisticNotifiationUseCase,
} from './use-cases';

@Module({
  controllers: [
    NotificationTokenController,
    NotificationSelfController,
    NotificationController,
  ],
  providers: [
    GetNotifiationUseCase,
    StatisticNotifiationUseCase,
    ReadNotifiationUseCase,
    ReadManyNotifiationUseCase,
    RemoveNotifiationUseCase,
    RemoveManyNotifiationUseCase,
    UpsertNotifiationTokenUseCase,
    GenerateNotifiationTokenUseCase,
  ],
})
export class NotificationModule {}
