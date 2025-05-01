import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Storage } from 'src/common/helpers';
import { IStorageRepository } from 'src/cores/interfaces';
import { ExtendedPrismaClient } from 'src/infrastructures/database';
import { StorageCode } from 'src/cores/enums';

@Injectable()
export class StorageService {
  constructor(
    private readonly storageRepository: IStorageRepository,
    private readonly dataService: TransactionHost<
      TransactionalAdapterPrisma<ExtendedPrismaClient>
    >,
  ) {}

  async upload({
    code,
    file,
    dir,
  }: {
    code: StorageCode;
    file: S3.MultipartFile;
    dir?: string;
    editable?: boolean;
    removable?: boolean;
  }) {
    let path = dir;
    if (!dir) {
      path = Storage.path(code);
    }

    const uploaded = await this.storageRepository.upload({
      path,
      file,
    });

    const saved = await this.dataService.tx.stgFile.create({
      data: {
        fileType: code,
        name: uploaded.name,
        originalName: uploaded.originalName,
        path: uploaded.path,
        ext: uploaded.ext,
        size: uploaded.size,
      },
    });

    return saved;
  }

  async findFileById(fileId: number) {
    return this.dataService.tx.stgFile.findUnique({
      where: { id: fileId },
    });
  }

  async removeFile(fileId: number) {
    await this.dataService.tx.stgFile.delete({
      where: { id: fileId },
    });
  }

  async deleteFromOSS({ path }: { path: string }) {
    return await this.storageRepository.delete({ path });
  }


}
