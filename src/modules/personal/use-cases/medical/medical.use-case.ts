import { Injectable } from '@nestjs/common';
import {
  CreateMedicalRequest,
  CreateMultipleMedicalRequest,
  QueryMedicalRequest,
  UpdateMedicalRequest,
  UpdateMultipleMedicalRequest,
} from '../../requests';
import { FileDirectoryService, MedicalService } from 'src/services';
import { Transactional } from '@nestjs-cls/transactional';
import { MedicalMap } from 'src/cores/entities';
import { ProfileEntity } from 'src/cores/entities';

@Injectable()
export class MedicalUseCase {
  constructor(
    private readonly medicalService: MedicalService,
    private readonly fileDirectoryService: FileDirectoryService,
  ) {}

  async findAll(query: QueryMedicalRequest, profile: ProfileEntity) {
    return await this.medicalService.findAll({
      ...query,
      currentUserId: profile.id,
    });
  }

  async findAllCustom(query: QueryMedicalRequest, profile: ProfileEntity) {
    return await this.medicalService.findAllCustom({
      ...query,
      currentUserId: profile.id,
    });
  }

  async findOne(medicalId: number, profile: ProfileEntity) {
    return await this.medicalService.findOne<MedicalMap>({
      id: medicalId,
      userId: profile.id,
      deletedAt: null,
    });
  }

  @Transactional()
  async create(payload: CreateMedicalRequest, profile: ProfileEntity) {
    return await this.medicalService.create<MedicalMap>({
      userId: profile.id,
      diseaseId: payload.diseaseId,
      answer: payload.answer,
    });
  }

  @Transactional()
  async createMultiple(
    payload: CreateMultipleMedicalRequest,
    profile: ProfileEntity,
  ) {
    return await Promise.all(
      payload.medicals.map((medical) => this.create(medical, profile)),
    );
  }

  @Transactional()
  async updateMultiple(
    payload: UpdateMultipleMedicalRequest,
    profile: ProfileEntity,
  ) {
    return await Promise.all(
      payload.medicals.map((medical) =>
        this.update(medical.id, medical, profile),
      ),
    );
  }

  @Transactional()
  async update(
    medicalId: number,
    payload: UpdateMedicalRequest,
    profile: ProfileEntity,
  ) {
    return await this.medicalService.update<MedicalMap>(medicalId, {
      userId: profile.id,
      diseaseId: payload.diseaseId,
      answer: payload.answer,
    });
  }

  @Transactional()
  async remove(medicalId: number, profile: ProfileEntity) {
    return await this.medicalService.remove(medicalId, profile.id);
  }
}
