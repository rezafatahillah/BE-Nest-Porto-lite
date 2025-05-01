import { Injectable } from '@nestjs/common';
import { FileDirectoryService, StorageService } from 'src/services/storage';
import { CandidateService } from 'src/services';
import { StorageCode } from 'src/cores/enums';
import { ProfileEntity } from 'src/cores/entities';

@Injectable()
export class CandidatePictureUseCase {
  constructor(
    private readonly candidateService: CandidateService,
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

    await this.candidateService.update(profile.id, {
      id: profile.id,
      pictureId: saved.id,
    });

    return saved;
  }
}
