import { Injectable } from '@nestjs/common';
import {
  CreateSkillRequest,
  QuerySkillRequest,
  UpdateSkillRequest,
} from '../../requests';

import {
  CreateSkillCommonRequest,
  QuerySkillCommonRequest,
} from 'src/modules/master/requests';

import { SkillService, SkillCommonService } from 'src/services';
import { Transactional } from '@nestjs-cls/transactional';
import { SkillMap, SkillCommonMap } from 'src/cores/entities';
import { ProfileEntity } from 'src/cores/entities';

@Injectable()
export class SkillUseCase {
  constructor(
    private readonly skillService: SkillService,
    private readonly skillCommonService: SkillCommonService,
  ) {}

  async findAll(query: QuerySkillRequest, profile: ProfileEntity) {
    return await this.skillService.findAll({
      ...query,
      currentUserId: profile.id,
    });
  }

  async findOne(skillId: number, profile: ProfileEntity) {
    return await this.skillService.findOne<SkillMap>({
      id: skillId,
      userId: profile.id,
      deletedAt: null,
    });
  }

  // @Transactional()
  // async create(payload: CreateSkillRequest, profile: ProfileEntity) {

  //   return await this.skillService.create<SkillMap>({
  //     userId: profile.id,
  //     skillCommonId: payload.skillCommonId,
  //     skillLevelId: payload.skillLevel,
  //   });
  // }

  @Transactional()
  async create(payload: CreateSkillRequest, profile: ProfileEntity) {
    let skillCommonId = payload.skillCommonId;

    if (typeof skillCommonId === 'string') {
      const newSkillCommon =
        await this.skillCommonService.create<SkillCommonMap>({
          name: skillCommonId,
          published: 0,
          slug: '',
        });
      skillCommonId = newSkillCommon.id;
    }

    if (typeof skillCommonId === 'number' && !skillCommonId) {
      throw new Error('SkillCommonId must be provided.');
    }

    await this.skillService.checkSkillCommon({
      skillCommonId,
      userId: profile.id,
    });

    return await this.skillService.create<SkillMap>({
      userId: profile.id,
      skillCommonId,
      skillLevel: payload.skillLevel,
    });
  }

  @Transactional()
  async update(
    skillId: number,
    payload: UpdateSkillRequest,
    profile: ProfileEntity,
  ) {
    return await this.skillService.update<SkillMap>(skillId, {
      userId: profile.id,
      skillCommonId: payload.skillCommonId,
      skillLevel: payload.skillLevel,
    });
  }

  @Transactional()
  async remove(skillId: number, profile: ProfileEntity) {
    return await this.skillService.remove(skillId, profile.id);
  }
}
