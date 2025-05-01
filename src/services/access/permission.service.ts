import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { ExtendedPrismaClient } from 'src/infrastructures/database';

@Injectable()
export class PermissionService {
  constructor(
    private readonly dataService: TransactionHost<
      TransactionalAdapterPrisma<ExtendedPrismaClient>
    >,
  ) {}

  async findAll() {
    return await this.dataService.tx.permission.findMany({
      where: {
        deletedAt: null,
      },
    });
  }

  async groupPermissionsByModule(roleId?: number) {
    const permissions = await this.dataService.tx.permission.findMany({
      select: {
        id: true,
        module: true,
        action: true,
        slug: true,
      },
      where: roleId ? { permissionsOnRoles: { some: { roleId } } } : undefined,
    });

    const groupedPermissions = {};

    permissions.forEach((permission) => {
      const { module, id, action, slug } = permission;

      if (!groupedPermissions[module]) {
        groupedPermissions[module] = {
          permissions: [],
        };
      }

      groupedPermissions[module].permissions.push({
        id,
        slug,
        action,
      });
    });

    const result = Object.keys(groupedPermissions).map((module) => ({
      module,
      ...groupedPermissions[module],
    }));

    return result;
  }

  async findByRole(roleId: number) {
    return await this.dataService.tx.permission.findMany({
      where: {
        permissionsOnRoles: {
          some: {
            roleId,
          },
        },
        deletedAt: null,
      },
    });
  }

  async findIn(ids: number[]) {
    return await this.dataService.tx.permission.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async findOne(id: number) {
    return await this.dataService.tx.permission.findFirst({
      where: { id },
    });
  }

  async findBySlug(slug: string) {
    return await this.dataService.tx.permission.findFirst({
      where: { slug },
    });
  }
}
