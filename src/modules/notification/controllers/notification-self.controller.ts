import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AccessAuthGuard } from 'src/middlewares/guards';
import { INotificationServiceProvider } from 'src/cores/contracts';
import {
  QueryNotificationSelfRequest,
  SendNotificationRequest,
} from '../requests';
import {
  GetNotifiationUseCase,
  ReadManyNotifiationUseCase,
  ReadNotifiationUseCase,
  RemoveManyNotifiationUseCase,
  RemoveNotifiationUseCase,
  StatisticNotifiationUseCase,
} from '../use-cases';
import { NotificationMapper } from 'src/middlewares/interceptors';
import { AuthPayload } from 'src/common/decorators';
import { ProfileEntity } from 'src/cores/entities';

@ApiTags('Notification')
@UseGuards(AccessAuthGuard)
@Controller({
  path: 'notification/self',
  version: '1.0',
})
export class NotificationSelfController {
  constructor(
    private readonly mapper: NotificationMapper,
    private readonly getUseCase: GetNotifiationUseCase,
    private readonly statisticUseCase: StatisticNotifiationUseCase,
    private readonly readUseCase: ReadNotifiationUseCase,
    private readonly readManyUseCase: ReadManyNotifiationUseCase,
    private readonly removeUseCase: RemoveNotifiationUseCase,
    private readonly removeManyUseCase: RemoveManyNotifiationUseCase,
    private readonly notificationProvider: INotificationServiceProvider,
  ) {}

  @Get('statistic')
  async statistic(@AuthPayload() profile: ProfileEntity) {
    const statistic = await this.statisticUseCase.get({
      notifiableType: 'users',
      notifiableId: profile.id,
    });

    return this.mapper.toStatistic(statistic);
  }

  @Get()
  async findAll(
    @Query() request: QueryNotificationSelfRequest,
    @AuthPayload() profile: ProfileEntity,
  ) {
    const [data, meta] = await this.getUseCase.findAll({
      ...request,
      notifiableType: 'users',
      notifiableId: profile.id,
    });
    return this.mapper.toPaginate(data, meta);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async read(@Param('id', ParseIntPipe) id: number) {
    await this.readUseCase.read(id);
  }

  @Patch()
  @HttpCode(HttpStatus.NO_CONTENT)
  async readMany(@AuthPayload() profile: ProfileEntity) {
    await this.readManyUseCase.readMany({
      notifiableType: 'users',
      notifiableId: profile.id,
    });
  }

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  async send(@Body() request: SendNotificationRequest) {
    await this.notificationProvider.sendEach([
      {
        type: request.data.type,
        token: request.token,
        data: request.data,
      },
    ]);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.removeUseCase.remove(id);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeMany(@AuthPayload() profile: ProfileEntity) {
    await this.removeManyUseCase.removeMany({
      notifiableType: 'users',
      notifiableId: profile.id,
    });
  }
}
