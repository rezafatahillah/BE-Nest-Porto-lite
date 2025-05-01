import { Injectable } from '@nestjs/common';
import {
  CreateReferenceRequest,
  QueryReferenceRequest,
  UpdateReferenceRequest,
} from '../../requests';
import { FileDirectoryService, ReferenceService } from 'src/services';
import { Transactional } from '@nestjs-cls/transactional';
import { ReferenceMap } from 'src/cores/entities';
import { ProfileEntity } from 'src/cores/entities';

@Injectable()
export class ReferenceUseCase {
  constructor(
    private readonly referenceService: ReferenceService,
    private readonly fileDirectoryService: FileDirectoryService,
  ) {}

  async findAll(query: QueryReferenceRequest, profile: ProfileEntity) {
    return await this.referenceService.findAll({
      ...query,
      currentUserId: profile.id,
    });
  }

  async findOne(referenceId: number, profile: ProfileEntity) {
    return await this.referenceService.findOne<ReferenceMap>({
      id: referenceId,
      userId: profile.id,
      deletedAt: null,
    });
  }

  @Transactional()
  async create(payload: CreateReferenceRequest, profile: ProfileEntity) {
    return await this.referenceService.create<ReferenceMap>(
      {
        userId: profile.id,
        name: payload.name,
        address: payload.address,
        phone: payload.phone,
        position: payload.position,
        relation: payload.relation,
      },
    );
  }

  @Transactional()
  async update(
    referenceId: number,
    payload: UpdateReferenceRequest,
    profile: ProfileEntity,
  ) {

    return await this.referenceService.update<ReferenceMap>(
      referenceId,
      {
        userId: profile.id,
        name: payload.name,
        address: payload.address,
        phone: payload.phone,
        position: payload.position,
        relation: payload.relation,
      },
    );
  }

  @Transactional()
  async remove(referenceId: number, profile: ProfileEntity) {
    return await this.referenceService.remove(referenceId, profile.id);
  }
  
}
