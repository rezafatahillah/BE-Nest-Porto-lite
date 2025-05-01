import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AccessAuthGuard } from 'src/middlewares/guards';
import {
  GenerateNotificationTokenRequest,
  UpsertNotificationTokenRequest,
} from '../requests';
import {
  UpsertNotifiationTokenUseCase,
  GenerateNotifiationTokenUseCase,
} from '../use-cases';

@ApiTags('Notification Token')
@UseGuards(AccessAuthGuard)
@Controller({
  path: 'notification/token',
  version: '1.0',
})
export class NotificationTokenController {
  constructor(
    private readonly upsertUseCase: UpsertNotifiationTokenUseCase,
    private readonly generateUseCase: GenerateNotifiationTokenUseCase,
  ) {}

  @Post('upsert')
  @HttpCode(HttpStatus.NO_CONTENT)
  async upsert(@Body() request: UpsertNotificationTokenRequest) {
    await this.upsertUseCase.upsert(request);
  }

  @Post('generate')
  @HttpCode(HttpStatus.NO_CONTENT)
  async generate(@Body() request: GenerateNotificationTokenRequest) {
    await this.generateUseCase.generate(request);
  }
}
