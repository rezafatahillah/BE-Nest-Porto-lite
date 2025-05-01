import { Injectable } from '@nestjs/common';
import {
  CreateLanguageRequest,
  QueryLanguageRequest,
  UpdateLanguageRequest,
} from '../../requests';
import { FileDirectoryService, LanguageService } from 'src/services';
import { Transactional } from '@nestjs-cls/transactional';
import { LanguageMap } from 'src/cores/entities';
import { ProfileEntity } from 'src/cores/entities';

@Injectable()
export class LanguageUseCase {
  constructor(
    private readonly languageService: LanguageService,
    private readonly fileDirectoryService: FileDirectoryService,
  ) {}

  async findAll(query: QueryLanguageRequest, profile: ProfileEntity) {
    return await this.languageService.findAll({
      ...query,
      currentUserId: profile.id,
    });
  }

  async findOne(languageId: number, profile: ProfileEntity) {
    return await this.languageService.findOne<LanguageMap>({
      id: languageId,
      userId: profile.id,
      deletedAt: null,
    });
  }

  @Transactional()
  async create(payload: CreateLanguageRequest, profile: ProfileEntity) {
    return await this.languageService.create<LanguageMap>(
      {
        userId: profile.id,
        name: payload.name,
        skillLevel: payload.skillLevel,
      },
    );
  }

  @Transactional()
  async update(
    languageId: number,
    payload: UpdateLanguageRequest,
    profile: ProfileEntity,
  ) {

    return await this.languageService.update<LanguageMap>(
      languageId,
      {
        userId: profile.id,
        name: payload.name,
        skillLevel: payload.skillLevel,
      },
    );
  }

  @Transactional()
  async remove(languageId: number, profile: ProfileEntity) {
    return await this.languageService.remove(languageId, profile.id);
  }
  
}
