import { Injectable } from '@nestjs/common';
import {
  CreateEducationRequest,
  CreateMultipleEducationRequest,
  QueryEducationRequest,
  UpdateEducationRequest,
  UpdateMultipleEducationRequest,
} from '../../requests';
import { FileDirectoryService, EducationService } from 'src/services';
import { Transactional } from '@nestjs-cls/transactional';
import { EducationMap } from 'src/cores/entities';
import { ProfileEntity } from 'src/cores/entities';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class EducationUseCase {
  constructor(
    private readonly educationService: EducationService,
    private readonly fileDirectoryService: FileDirectoryService,
  ) {}

  async findAll(query: QueryEducationRequest, profile: ProfileEntity) {
    return await this.educationService.findAll({
      ...query,
      currentUserId: profile.id,
    });
  }

  async findOne(educationId: number, profile: ProfileEntity) {
    return await this.educationService.findOne<EducationMap>({
      id: educationId,
      userId: profile.id,
      deletedAt: null,
    });
  }

  @Transactional()
  async create(payload: CreateEducationRequest, profile: ProfileEntity) {
    return await this.educationService.create<EducationMap>({
      userId: profile.id,
      education: payload.education,
      status: payload.status,
      name: payload.name,
      study: payload.study,
      yearStart: payload.yearStart,
      yearEnd: payload.yearEnd,
      yearInformal: payload.yearInformal,
      city: payload.city,
      duration: payload.duration,
      certificate: payload.certificate,
    });
  }

  @Transactional()
  async createMultiple(
    payload: CreateMultipleEducationRequest,
    profile: ProfileEntity,
  ) {
    const combinedPayload = [
      ...(payload.formals || []),
      ...(payload.informals || []),
    ];

    const results = await Promise.all(
      combinedPayload.map((education) => this.create(education, profile)),
    );

    return results;
  }

  @Transactional()
  async updateMultiple(
    payload: UpdateMultipleEducationRequest,
    profile: ProfileEntity,
  ) {
    const combinedPayload = [...payload.formals, ...payload.informals];

    const results = await Promise.all(
      combinedPayload.map((education) =>
        this.update(education.id, education, profile),
      ),
    );

    return results;
  }

  @Transactional()
  async update(
    educationId: number,
    payload: UpdateEducationRequest,
    profile: ProfileEntity,
  ) {
    return await this.educationService.update<EducationMap>(educationId, {
      userId: profile.id,
      education: payload.education,
      status: payload.status,
      name: payload.name,
      study: payload.study,
      yearStart: payload.yearStart,
      yearEnd: payload.yearEnd,
      yearInformal: payload.yearInformal,
      city: payload.city,
      duration: payload.duration,
      certificate: payload.certificate,
    });
  }

  @Transactional()
  async remove(educationId: number, profile: ProfileEntity) {
    return await this.educationService.remove(educationId, profile.id);
  }
}
