import { Injectable } from '@nestjs/common';
import { FileDirectoryService, StorageService } from 'src/services/storage';
import { UserService } from 'src/services';
import { StorageCode } from 'src/cores/enums';

@Injectable()
export class UserPictureUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly fileDirectoryService: FileDirectoryService,
    private readonly storageService: StorageService,
  ) {}

  async updatePicture(userId: string, file: S3.MultipartFile) {
    const uploaded = await this.storageService.upload({
      code: StorageCode.ProfilePicture,
      file: file,
    });

    const saved = await this.fileDirectoryService.save({
      dirname: 'user-picture',
      fileId: uploaded.id,
    });

    await this.userService.update(userId, {
      pictureId: saved.id,
    });

    return saved;
  }
}
