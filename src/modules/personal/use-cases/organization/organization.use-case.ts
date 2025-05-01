import { Injectable } from '@nestjs/common';
import {
  CreateOrganizationRequest,
  QueryOrganizationRequest,
  UpdateOrganizationRequest,
} from '../../requests';
import { FileDirectoryService, OrganizationService } from 'src/services';
import { Transactional } from '@nestjs-cls/transactional';
import { OrganizationMap } from 'src/cores/entities';
import { ProfileEntity } from 'src/cores/entities';

@Injectable()
export class OrganizationUseCase {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly fileDirectoryService: FileDirectoryService,
  ) {}

  async findAll(query: QueryOrganizationRequest, profile: ProfileEntity) {
    return await this.organizationService.findAll({
      ...query,
      currentUserId: profile.id,
    });
  }

  async findOne(organizationId: number, profile: ProfileEntity) {
    return await this.organizationService.findOne<OrganizationMap>({
      id: organizationId,
      userId: profile.id,
      deletedAt: null,
    });
  }

  @Transactional()
  async create(payload: CreateOrganizationRequest, profile: ProfileEntity) {
    return await this.organizationService.create<OrganizationMap>(
      {
        userId: profile.id,
        name: payload.name,
        type: payload.type,
        year: payload.year,
        position: payload.position,
      },
    );
  }

  @Transactional()
  async update(
    organizationId: number,
    payload: UpdateOrganizationRequest,
    profile: ProfileEntity,
  ) {

    return await this.organizationService.update<OrganizationMap>(
      organizationId,
      {
        userId: profile.id,
        name: payload.name,
        type: payload.type,
        year: payload.year,
        position: payload.position,
      },
    );
  }

  @Transactional()
  async remove(organizationId: number, profile: ProfileEntity) {
    return await this.organizationService.remove(organizationId, profile.id);
  }
  
}
