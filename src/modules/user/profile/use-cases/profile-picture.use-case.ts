import { Injectable } from '@nestjs/common';
import { FileDirectoryService, StorageService } from 'src/services/storage';
import { AuthService, UserService } from 'src/services';
import { ProfileEntity } from 'src/cores/entities';
import { StorageCode } from 'src/cores/enums';
import { FileMapper } from 'src/middlewares/interceptors';

@Injectable()
export class ProfilePictureUseCase {
  constructor(
    private readonly fileMapper: FileMapper,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly fileDirectoryService: FileDirectoryService,
    private readonly storageService: StorageService,
  ) {}

  async updatePicture(profile: ProfileEntity, file: S3.MultipartFile) {
    const uploaded = await this.storageService.upload({
      code: StorageCode.ProfilePicture,
      file: file,
    });

    const saved = await this.fileDirectoryService.save({
      dirname: 'user-picture',
      fileId: uploaded.id,
    });

    await this.userService.update(profile.id, {
      pictureId: saved.id,
    });

    const mapped = (await this.fileMapper.toMap(saved)).data;

    profile.picture = mapped;
    await this.authService.setUser(profile.id, profile);

    return mapped;
  }
}
