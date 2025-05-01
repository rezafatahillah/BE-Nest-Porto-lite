import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Prisma } from '@prisma/client';
import { CreateUserDto, PaginationDto, UpdateUserDto } from 'src/cores/dtos';
import { ExtendedPrismaClient } from 'src/infrastructures/database';

@Injectable()
export class UserService {
  constructor(
    private readonly dataService: TransactionHost<
      TransactionalAdapterPrisma<ExtendedPrismaClient>
    >,
  ) {}

  async findAll({
    perPage,
    page,
    account,
    currentUserId,
  }: { account?: boolean; currentUserId?: string } & PaginationDto) {
    return await this.dataService.tx.user
      .paginate({
        where: {
          AND: [
            {
              id: {
                not: currentUserId,
              },
              identity: {
                roleId: {
                  not: 1,
                },
              },
            },
            account === false
              ? {
                  OR: [
                    { identity: null },
                    { identity: { deletedAt: { not: null } } },
                  ],
                }
              : {},
          ],
        },
        include: {
          picture: true,
        },
      })
      .withPages({
        limit: perPage,
        page: page,
      });
  }

  async findOne<T>(id: string, include?: Prisma.UserInclude) {
    return (await this.dataService.tx.user.findFirst({
      where: { id, deletedAt: null },
      include,
    })) as T;
  }

  async create<T>(createUserDto: CreateUserDto, include?: Prisma.UserInclude) {
    return (await this.dataService.tx.user.create({
      data: {
        type: createUserDto.type,
        name: createUserDto.name,
        email: createUserDto?.email,
        pictureId: createUserDto.pictureId,
      },
      include,
    })) as T;
  }

  async update<T>(
    id: string,
    updateUserDto: UpdateUserDto,
    include?: Prisma.UserInclude,
  ) {
    return (await this.dataService.tx.user.update({
      where: { id },
      data: {
        name: updateUserDto.name,
        email: updateUserDto.email,
        pictureId: updateUserDto.pictureId,
        identity: {
          update: {
            data: {
              username: updateUserDto.email,
            },
          },
        },
      },
      include,
    })) as T;
  }

  async remove(id: string) {
    const now = DateTime.now().toISO();

    const updatedUser = await this.dataService.tx.user.update({
      where: { id },
      data: { deletedAt: now },
      include: { identity: true },
    });

    if (updatedUser.identity) {
      await this.dataService.tx.identity.update({
        where: { id: id },
        data: { deletedAt: now },
      });
    }

    return updatedUser;
  }

  async removeForce(id: string) {
    const user = await this.dataService.tx.user.findUnique({
      where: { id },
      include: { identity: true },
    });

    if (!user) {
      throw new Error(`user with id: ${id} not found`);
    }

    if (user.identity) {
      await this.dataService.tx.permissionsOnIdentities.deleteMany({
        where: { identityId: id },
      });
      await this.dataService.tx.identity.delete({
        where: { id },
      });
    }

    return await this.dataService.tx.user.delete({
      where: { id },
    });
  }
}
