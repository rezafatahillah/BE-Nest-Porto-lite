import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  CreateDirectoryDto,
  UpdateDirectoryDto,
  UpdateUsageDirectoryDto,
} from 'src/cores/dtos';
import { ExtendedPrismaClient } from 'src/infrastructures/database';

@Injectable()
export class DirectoryService {
  constructor(
    private readonly dataService: TransactionHost<
      TransactionalAdapterPrisma<ExtendedPrismaClient>
    >,
  ) {}

  async findAll(
    where?: Prisma.StgDirectoryWhereInput,
    include?: Prisma.StgDirectoryInclude,
  ) {
    return await this.dataService.tx.stgDirectory.findMany({
      where,
      include,
    });
  }

  async findOne<T>(path: string, include?: Prisma.StgDirectoryInclude) {
    return (await this.dataService.tx.stgDirectory.findFirst({
      where: { path },
      include,
    })) as T;
  }

  async create<T>(
    createDirectory: CreateDirectoryDto,
    include?: Prisma.StgDirectoryInclude,
  ) {
    return (await this.dataService.tx.stgDirectory.create({
      data: {
        parentId: createDirectory.parentId,
        name: createDirectory.name,
        path: createDirectory.path,
        totalFiles: createDirectory.totalFiles,
        totalSize: createDirectory.totalSize,
        starred: createDirectory.starred,
        editable: createDirectory.editable,
        removable: createDirectory.removable,
        description: createDirectory.description,
      },
      include,
    })) as T;
  }

  async update<T>(
    id: number,
    updateDirectory: UpdateDirectoryDto,
    include?: Prisma.StgDirectoryInclude,
  ) {
    await this.isEditable({ id });

    return (await this.dataService.tx.stgDirectory.update({
      where: {
        id: id,
      },
      data: {
        parentId: updateDirectory.parentId,
        name: updateDirectory.name,
        path: updateDirectory.path,
        totalFiles: updateDirectory.totalFiles,
        totalSize: updateDirectory.totalSize,
        starred: updateDirectory.starred,
        editable: updateDirectory.editable,
        removable: updateDirectory.removable,
        description: updateDirectory.description,
      },
      include,
    })) as T;
  }

  async updateUsage<T>(
    id: number,
    updateDirectory: UpdateUsageDirectoryDto,
    include?: Prisma.StgDirectoryInclude,
  ) {
    return (await this.dataService.tx.stgDirectory.update({
      where: {
        id: id,
      },
      data: {
        totalFiles: updateDirectory.totalFiles,
        totalSize: updateDirectory.totalSize,
      },
      include,
    })) as T;
  }

  async remove(id: number) {
    await this.isRemovable({ id });

    return await this.dataService.tx.stgDirectory.softDelete({
      id: id,
    });
  }

  async removeByPath(path: string) {
    await this.isRemovable({ path });

    return await this.dataService.tx.stgDirectory.softDelete({
      path: path,
    });
  }

  async removeForce(id: number) {
    await this.isRemovable({ id });

    return await this.dataService.tx.stgDirectory.delete({
      where: { id },
    });
  }

  async removeForceByPath(path: string) {
    await this.isRemovable({ path });

    return await this.dataService.tx.stgDirectory.delete({
      where: { path },
    });
  }

  async isRemovable({ id, path }: { id?: number; path?: string }) {
    const exist = await this.dataService.tx.stgDirectory.findFirst({
      where: {
        OR: [
          {
            id: id,
          },
          {
            path: path,
          },
        ],
      },
    });

    if (!exist.removable) {
      throw new BadRequestException([
        {
          field: 'id',
          errors: [`id is not removable.`],
        },
      ]);
    }

    return true;
  }

  async isEditable({ id, path }: { id?: number; path?: string }) {
    const exist = await this.dataService.tx.stgDirectory.findFirst({
      where: {
        OR: [
          {
            id: id,
          },
          {
            path: path,
          },
        ],
      },
    });

    if (!exist.editable) {
      throw new BadRequestException([
        {
          field: 'id',
          errors: [`id is not editable.`],
        },
      ]);
    }

    return true;
  }
}
