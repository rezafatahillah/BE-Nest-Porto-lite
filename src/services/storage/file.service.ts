import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { CreateFileDto } from 'src/cores/dtos';
import { ExtendedPrismaClient } from 'src/infrastructures/database';

@Injectable()
export class FileService {
  constructor(
    private readonly dataService: TransactionHost<
      TransactionalAdapterPrisma<ExtendedPrismaClient>
    >,
  ) {}

  async findAll() {
    return await this.dataService.tx.stgFile.findMany({
      where: {
        deletedAt: null,
      },
    });
  }

  async findOne(id: number) {
    return await this.dataService.tx.stgFile.findFirst({
      where: { id },
    });
  }

  async create(createFile: CreateFileDto) {
    return await this.dataService.tx.stgFile.create({
      data: {
        fileType: createFile.fileType,
        originalName: createFile.originalName,
        name: createFile.name,
        path: createFile.path,
        ext: createFile.ext,
        size: createFile.size,
        attributes: createFile.attributes,
      },
    });
  }

  async update(id: number, createFile: CreateFileDto) {
    return await this.dataService.tx.stgFile.update({
      where: {
        id,
      },
      data: {
        fileType: createFile.fileType,
        originalName: createFile.originalName,
        name: createFile.name,
        path: createFile.path,
        ext: createFile.ext,
        size: createFile.size,
        attributes: createFile.attributes,
      },
    });
  }

  async uploaded(id: number) {
    return await this.dataService.tx.stgFile.update({
      where: {
        id,
      },
      data: {
        uploadedAt: DateTime.now().toISO(),
      },
    });
  }

  async remove(id: number) {
    return await this.dataService.tx.stgFile.softDelete({
      id,
    });
  }

  async removeForce(id: number) {
    return await this.dataService.tx.stgFile.delete({
      where: { id },
    });
  }
}
