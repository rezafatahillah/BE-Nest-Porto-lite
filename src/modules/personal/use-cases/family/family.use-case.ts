import { Injectable } from '@nestjs/common';
import {
  CreateFamilyRequest,
  CreateMultipleFamilyRequest,
  QueryFamilyRequest,
  UpdateFamilyRequest,
  UpdateMultipleFamilyRequest,
} from '../../requests';
import { FileDirectoryService, FamilyService } from 'src/services';
import { Transactional } from '@nestjs-cls/transactional';
import { FamilyMap } from 'src/cores/entities';
import { ProfileEntity } from 'src/cores/entities';

@Injectable()
export class FamilyUseCase {
  constructor(
    private readonly familyService: FamilyService,
    private readonly fileDirectoryService: FileDirectoryService,
  ) {}

  async findAll(query: QueryFamilyRequest, profile: ProfileEntity) {
    return await this.familyService.findAll({
      ...query,
      currentUserId: profile.id,
    });
  }

  async findOne(familyId: number, profile: ProfileEntity) {
    return await this.familyService.findOne<FamilyMap>({
      id: familyId,
      userId: profile.id,
      deletedAt: null,
    });
  }

  @Transactional()
  async createMultiple(
    payload: CreateMultipleFamilyRequest,
    profile: ProfileEntity,
  ) {
    const combinedPayload = [
      ...(payload.familys || []),
      ...(payload.siblings || []),
      ...(payload.childrens || []),
    ];

    const results = await Promise.all(
      combinedPayload.map((family) => this.create(family, profile)),
    );

    return results;
  }

  @Transactional()
  async updateMultiple(
    payload: UpdateMultipleFamilyRequest,
    profile: ProfileEntity,
  ) {
    const combinedPayload = [
      ...payload.familys,
      ...payload.siblings,
      ...payload.childrens,
    ];

    const results = await Promise.all(
      combinedPayload.map((family) => this.update(family.id, family, profile)),
    );

    return results;
  }

  @Transactional()
  async create(payload: CreateFamilyRequest, profile: ProfileEntity) {
    return await this.familyService.create<FamilyMap>({
      main: payload.main,
      userId: profile.id,
      name: payload.name,
      status: payload.status,
      birthDate: payload.birthDate,
      education: payload.education,
      job: payload.job,
    });
  }

  @Transactional()
  async update(
    familyId: number,
    payload: UpdateFamilyRequest,
    profile: ProfileEntity,
  ) {
    return await this.familyService.update<FamilyMap>(familyId, {
      main: payload.main,
      userId: profile.id,
      name: payload.name,
      status: payload.status,
      birthDate: payload.birthDate,
      education: payload.education,
      job: payload.job,
    });
  }

  @Transactional()
  async remove(familyId: number, profile: ProfileEntity) {
    return await this.familyService.remove(familyId, profile.id);
  }
}
