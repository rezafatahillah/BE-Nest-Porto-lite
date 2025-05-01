import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  CreateNotificationTokenDto,
  UpdateNotificationTokenDto,
} from 'src/cores/dtos';
import { ExtendedPrismaClient } from 'src/infrastructures/database';

@Injectable()
export class NotificationTokenService {
  constructor(
    private readonly dataService: TransactionHost<
      TransactionalAdapterPrisma<ExtendedPrismaClient>
    >,
  ) {}

  async findAll() {
    return await this.dataService.tx.notificationToken.findMany();
  }

  async findOne<T>(
    where?: Prisma.NotificationTokenWhereInput,
    include?: Prisma.NotificationTokenInclude,
  ) {
    return (await this.dataService.tx.notificationToken.findFirst({
      where,
      include,
    })) as T;
  }

  async create<T>(
    notifiactionDto: CreateNotificationTokenDto,
    include?: Prisma.NotificationTokenInclude,
  ) {
    return (await this.dataService.tx.notificationToken.create({
      data: {
        userId: notifiactionDto.userId,
        type: notifiactionDto.type,
        token: notifiactionDto.token,
      },
      include,
    })) as T;
  }

  async upsert<T>(
    notificationDto: CreateNotificationTokenDto,
    include?: Prisma.NotificationTokenInclude,
  ) {
    const exist = await this.findOne<
      Prisma.NotificationTokenGetPayload<Prisma.NotificationDefaultArgs>
    >({
      userId: notificationDto.userId,
      type: notificationDto.type,
    });

    if (exist) {
      return await this.update(
        exist.id,
        {
          userId: notificationDto.userId,
          type: notificationDto.type,
          token: notificationDto.token,
        },
        include,
      );
    }

    return await this.create<T>(notificationDto, include);
  }

  async update<T>(
    id: number,
    notifiactionDto: UpdateNotificationTokenDto,
    include?: Prisma.NotificationTokenInclude,
  ) {
    return (await this.dataService.tx.notificationToken.update({
      where: { id },
      data: {
        userId: notifiactionDto.userId,
        type: notifiactionDto.type,
        token: notifiactionDto.token,
      },
      include,
    })) as T;
  }

  async remove(id: number) {
    return await this.dataService.tx.notificationToken.delete({
      where: { id },
    });
  }

  async removeByUser(
    userId: string,
    where?: Omit<Prisma.NotificationTokenWhereInput, 'userId' | 'user'>,
  ) {
    return await this.dataService.tx.notificationToken.deleteMany({
      where: { userId, ...where },
    });
  }
}
