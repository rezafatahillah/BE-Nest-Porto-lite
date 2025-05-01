import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DateTime } from 'luxon';
import { CreateRoleDto, UpdateRoleDto } from 'src/cores/dtos';
import { ExtendedPrismaClient } from 'src/infrastructures/database';

@Injectable()
export class RoleService {
  constructor(
    private readonly dataService: TransactionHost<
      TransactionalAdapterPrisma<ExtendedPrismaClient>
    >,
  ) {}

  async findAll({ name }: { name?: string }) {
    return await this.dataService.tx.role.findMany({
      where: {
        name: {
          contains: name,
        },
        visible: true,
        deletedAt: null,
      },
    });
  }

  async findOne<T>(id: number, include?: Prisma.RoleInclude) {
    return (await this.dataService.tx.role.findFirst({
      where: { id, visible: true, deletedAt: null },
      include,
    })) as T;
  }

  async findBySlug<T>(slug: string, include?: Prisma.RoleInclude) {
    return (await this.dataService.tx.role.findFirst({
      where: { slug, visible: true, deletedAt: null },
      include,
    })) as T;
  }

  async create<T>(createRoleDto: CreateRoleDto, include?: Prisma.RoleInclude) {
    return (await this.dataService.tx.role.create({
      data: {
        name: createRoleDto.name,
        slug: createRoleDto.slug,
        permissionsOnRoles: {
          create: createRoleDto.permissionsToPrisma,
        },
      },
      include,
    })) as T;
  }

  async update<T>(
    id: number,
    updateRoleDto: UpdateRoleDto,
    include?: Prisma.RoleInclude,
  ) {
    await this.dataService.tx.permissionsOnRoles.deleteMany({
      where: {
        roleId: id,
      },
    });

    return (await this.dataService.tx.role.update({
      where: { id },
      data: {
        slug: updateRoleDto.slug,
        name: updateRoleDto.name,
        permissionsOnRoles: {
          create: updateRoleDto.permissionsToPrisma,
        },
      },
      include,
    })) as T;
  }

  async remove(id: number) {
    return await this.dataService.tx.role.update({
      where: { id },
      data: {
        deletedAt: DateTime.now().toISO(),
      },
    });
  }
}
