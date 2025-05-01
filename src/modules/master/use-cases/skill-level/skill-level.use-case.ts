import { Injectable } from '@nestjs/common';
import {
  CreateSkillLevelRequest,
  QuerySkillLevelRequest,
  UpdateSkillLevelRequest,
} from '../../requests';
import { FileDirectoryService, SkillLevelService } from 'src/services';
import { Transactional } from '@nestjs-cls/transactional';
import { SkillLevelMap } from 'src/cores/entities';

@Injectable()
export class SkillLevelUseCase {
  constructor(
    private readonly skillLevelService: SkillLevelService,
    private readonly fileDirectoryService: FileDirectoryService,
  ) {}

  async findAll(query: QuerySkillLevelRequest) {
    return await this.skillLevelService.findAll(query);
  }

  async findOne(skillLevelId: number) {
    return await this.skillLevelService.findOne<SkillLevelMap>(
      skillLevelId,
      // {
      //   picture: true, 
      //   banner: true,
      // },
    );
  }

  @Transactional()
  async create(payload: CreateSkillLevelRequest) {

    return await this.skillLevelService.create<SkillLevelMap>(
      {
        name: payload.name,
      },
      // {
      //   picture: true,
      //   banner: true,
      // },
    );
  }

  @Transactional()
  async update(
    skillLevelId: number,
    payload: UpdateSkillLevelRequest,
  ) {
    return await this.skillLevelService.update<SkillLevelMap>(
      skillLevelId,
      {
        name: payload.name,
      },
      // {
      //   picture: true,
      //   banner: true,
      // },
    );
  }

  @Transactional()
  async remove(skillLevelId: number) {
    return await this.skillLevelService.remove(skillLevelId);
  }
}
