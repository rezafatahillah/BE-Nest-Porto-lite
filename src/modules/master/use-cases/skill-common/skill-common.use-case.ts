import { Injectable } from '@nestjs/common';
import {
  CreateSkillCommonRequest,
  QuerySkillCommonRequest,
  UpdateSkillCommonRequest,
} from '../../requests';
import { FileDirectoryService, SkillCommonService } from 'src/services';
import { Transactional } from '@nestjs-cls/transactional';
import { SkillCommonMap } from 'src/cores/entities';

@Injectable()
export class SkillCommonUseCase {
  constructor(
    private readonly skillCommonService: SkillCommonService,
    private readonly fileDirectoryService: FileDirectoryService,
  ) {}

  async findAll(query: QuerySkillCommonRequest) {
    return await this.skillCommonService.findAll(query);
  }

  async findOne(skillCommonId: number) {
    return await this.skillCommonService.findOne<SkillCommonMap>(
      skillCommonId,
    );
  }

  @Transactional()
  async create(payload: CreateSkillCommonRequest) {

    return await this.skillCommonService.create<SkillCommonMap>(
      {
        published: payload.published,
        name: payload.name,
        slug: "", 
      },
    );
  }

  @Transactional()
  async update(
    skillCommonId: number,
    payload: UpdateSkillCommonRequest,
  ) {
    return await this.skillCommonService.update<SkillCommonMap>(
      skillCommonId,
      {
        published: payload.published,
        name: payload.name,
        // slug: payload.slug,
      },
    );
  }

  @Transactional()
  async remove(skillCommonId: number) {
    return await this.skillCommonService.remove(skillCommonId);
  }
}
