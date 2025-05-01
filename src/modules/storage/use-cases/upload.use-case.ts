import { Injectable, NotFoundException } from '@nestjs/common';
import { MultipleUploadRequest, UploadRequest } from '../requests';
import { StorageCode } from 'src/cores/enums';
import { FileDirectoryService, StorageService } from 'src/services/storage';
import { IStorageServiceProvider } from 'src/cores/contracts';

@Injectable()
export class UploadUseCase {
  constructor(
    private readonly fileDirectoryService: FileDirectoryService,
    private readonly storageService: StorageService,
    private readonly storageProvider: IStorageServiceProvider,
  ) {}

  async upload(uploadRequest: UploadRequest, file: S3.MultipartFile) {
    let uploaded = null;
    if (uploadRequest.code === StorageCode.FileManager) {
      uploaded = await this.storageService.upload({
        code: uploadRequest.code,
        file: file,
        dir: uploadRequest.dir,
        editable: true,
        removable: true,
      });
    } else if (uploadRequest.code === StorageCode.FileCandidate) {
      uploaded = await this.storageService.upload({
        code: uploadRequest.code,
        file: file,
        dir: 'users/candidates',
      });
    } else {
      uploaded = await this.storageService.upload({
        code: uploadRequest.code,
        file: file,
      });
    }

    if (uploadRequest.code === StorageCode.FileManager && uploadRequest.dir) {
      await this.fileDirectoryService.save({
        dirname: uploadRequest.dir,
        fileId: uploaded.id,
      });
    }

    return {
      data: {
        id: uploaded.id,
        name: uploaded.originalName,
        extension: uploaded.ext,
        size: uploaded.size,
        url: await this.storageProvider.signedUrl(uploaded.path),
        createdAt: uploaded.createdAt,
        updatedAt: uploaded.updatedAt,
      },
    };
  }

  async uploadMultiple(
    uploadRequest: MultipleUploadRequest,
    files: S3.MultipartFile[],
  ) {
    const uploads = [];

    files.forEach((file) => {
      const upload = this.storageService.upload({
        code: uploadRequest.code,
        file: file,
        dir: uploadRequest.dir,
      });
      uploads.push(upload);
    });

    const uploaded = await Promise.all(uploads);

    if (uploadRequest.code === StorageCode.FileManager && uploadRequest.dir) {
      const saved = [];

      for (const upload of uploaded) {
        saved.push(
          this.fileDirectoryService.save({
            dirname: uploadRequest.dir,
            fileId: upload.id,
          }),
        );
      }

      await Promise.all(saved);
    }

    const response = [];
    for (const upload of uploaded) {
      response.push({
        id: upload.id,
        name: upload.originalName,
        extension: upload.ext,
        size: upload.size,
        url: await this.storageProvider.signedUrl(upload.path),
        createdAt: upload.createdAt,
        updatedAt: upload.updatedAt,
      });
    }

    return response;
  }

  async delete(fileId: number) {
    const file = await this.storageService.findFileById(fileId);

    if (!file) {
      throw new NotFoundException('File not found');
    }

    await this.storageService.deleteFromOSS({ path: file.path });

    await this.storageService.removeFile(fileId);

    return { message: 'File deleted successfully' };
  }
}
