import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DateTime } from 'luxon';
import {
  PaginationDto,
  NotifiableNotificationDto,
  CreateNotificationDto,
  UpdateNotificationDto,
} from 'src/cores/dtos';
import { ExtendedPrismaClient } from 'src/infrastructures/database';

@Injectable()
export class NotificationService {
  constructor(
    private readonly dataService: TransactionHost<
      TransactionalAdapterPrisma<ExtendedPrismaClient>
    >,
  ) {}

  async statistic(params?: NotifiableNotificationDto) {
    let where: Prisma.NotificationWhereInput | undefined = undefined;
    if (params) {
      where = {
        notifiableId: params.notifiableId,
        notifiableType: params.notifiableType,
      };
    }

    return await this.dataService.tx.notification.aggregate({
      where,
      _count: {
        id: true,
        readAt: true,
      },
    });
  }

  async findAll(pagination: PaginationDto) {
    return await this.dataService.tx.notification
      .paginate({ orderBy: { createdAt: 'desc' } })
      .withPages({
        limit: pagination.perPage,
        page: pagination.page,
      });
  }

  async findByNotifiable({
    notifiableType,
    notifiableId,
    page,
    perPage,
  }: NotifiableNotificationDto & PaginationDto) {
    return await this.dataService.tx.notification
      .paginate({
        where: {
          notifiableType,
          notifiableId,
        },
        orderBy: { createdAt: 'desc' },
      })
      .withPages({
        limit: perPage,
        page: page,
      });
  }

  async findOne<T>(id: number) {
    return (await this.dataService.tx.notification.findFirst({
      where: { id },
    })) as T;
  }

  async create<T, U>(notifiactionDto: CreateNotificationDto<U>) {
    return (await this.dataService.tx.notification.create({
      data: {
        service: notifiactionDto.service,
        type: notifiactionDto.type,
        notifiableType: notifiactionDto.notifiableType,
        notifiableId: notifiactionDto.notifiableId,
        data: notifiactionDto.data,
        sentAt: notifiactionDto.sentAt,
        readAt: notifiactionDto.readAt,
      },
    })) as T;
  }

  async createMany<T, U>(notifiactionDto: CreateNotificationDto<U>[]) {
    return (await this.dataService.tx.notification.createMany({
      data: notifiactionDto.map((n) => ({
        service: n.service,
        type: n.type,
        notifiableType: n.notifiableType,
        notifiableId: n.notifiableId,
        data: n.data,
        sentAt: n.sentAt,
        readAt: n.readAt,
      })),
    })) as T;
  }

  async update<T, U>(id: number, notifiactionDto: UpdateNotificationDto<U>) {
    return (await this.dataService.tx.notification.update({
      where: { id },
      data: {
        service: notifiactionDto.service,
        type: notifiactionDto.type,
        notifiableType: notifiactionDto.notifiableType,
        notifiableId: notifiactionDto.notifiableId,
        data: notifiactionDto.data,
        sentAt: notifiactionDto.sentAt,
        readAt: notifiactionDto.readAt,
      },
    })) as T;
  }

  async sent(id: number) {
    return await this.dataService.tx.notification.update({
      where: { id },
      data: {
        sentAt: DateTime.now().toISO(),
      },
    });
  }

  async read(id: number) {
    return await this.dataService.tx.notification.update({
      where: { id },
      data: {
        readAt: DateTime.now().toISO(),
      },
    });
  }

  async readByNotifiable({
    notifiableType,
    notifiableId,
  }: NotifiableNotificationDto) {
    return await this.dataService.tx.notification.updateMany({
      where: { notifiableId, notifiableType },
      data: {
        readAt: DateTime.now().toISO(),
      },
    });
  }

  async remove(id: number) {
    return await this.dataService.tx.notification.softDelete({
      id,
    });
  }

  async removeByNotifiable({
    notifiableType,
    notifiableId,
  }: NotifiableNotificationDto) {
    return await this.dataService.tx.notification.softDeleteMany({
      notifiableType,
      notifiableId,
    });
  }

  async removeForce(id: number) {
    return await this.dataService.tx.notification.delete({
      where: { id },
    });
  }

  async removeForceByNotifiable({
    notifiableType,
    notifiableId,
  }: NotifiableNotificationDto) {
    return await this.dataService.tx.notification.deleteMany({
      where: { notifiableType, notifiableId },
    });
  }
}
