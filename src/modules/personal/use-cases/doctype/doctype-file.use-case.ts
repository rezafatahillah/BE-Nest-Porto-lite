import { Injectable } from '@nestjs/common';
import { FileDirectoryService, StorageService } from 'src/services/storage';
import { DoctypeService } from 'src/services';
import { StorageCode } from 'src/cores/enums';
import { ProfileEntity } from 'src/cores/entities';
import { IUpdateDoctypeDto } from 'src/cores/interfaces';

@Injectable()
export class DoctypeFileUseCase {
  constructor(
    private readonly doctypeService: DoctypeService,
    private readonly fileDirectoryService: FileDirectoryService,
    private readonly storageService: StorageService,
  ) {}

  async updateFile(id: number, file: S3.MultipartFile, profile: ProfileEntity) {
    const doctype = await this.doctypeService.findOne<IUpdateDoctypeDto>({
      id,
      userId: profile.id,
      deletedAt: null,
    });
  
    if (!doctype) {
      throw new Error('Doctype not found');
    }
  
    const oldDoctype_id = id;
    const oldDoctype_fileId = doctype.fileId;
  
    if (oldDoctype_fileId) {
      const oldFileOnDir = await this.fileDirectoryService.findOne(
        StorageCode.FileCandidate,
        oldDoctype_fileId,
      );
      const oldOss = await this.storageService.findFileById(
        oldFileOnDir.fileId,
      );
  
      if (oldFileOnDir && oldOss) {
        const uploaded = await this.storageService.upload({
          code: StorageCode.FileCandidate,
          file: file,
        });
  
        const saved = await this.fileDirectoryService.save({
          dirname: 'file-candidate',
          fileId: uploaded.id,
        });
  
        await this.doctypeService.update(id, {
          fileId: saved.id,
        });
  
        await this.fileDirectoryService.removeForce(oldFileOnDir.id);
        await this.storageService.removeFile(oldFileOnDir.fileId);
        await this.storageService.deleteFromOSS({ path: oldOss.path });
  
        return saved;
      }
    }
  
    return null;
  }
  
}
