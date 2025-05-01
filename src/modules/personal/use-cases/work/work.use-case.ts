import { Injectable } from '@nestjs/common';
import {
  CreateWorkRequest,
  QueryWorkRequest,
  UpdateWorkRequest,
} from '../../requests';
import { FileDirectoryService, WorkService } from 'src/services';
import { Transactional } from '@nestjs-cls/transactional';
import { WorkMap } from 'src/cores/entities';
import { ProfileEntity } from 'src/cores/entities';

@Injectable()
export class WorkUseCase {
  constructor(
    private readonly workService: WorkService,
    private readonly fileDirectoryService: FileDirectoryService,
  ) {}

  async findAll(query: QueryWorkRequest, profile: ProfileEntity) {
    return await this.workService.findAll({
      ...query,
      currentUserId: profile.id,
    });
  }

  async findOne(workId: number, profile: ProfileEntity) {
    return await this.workService.findOne<WorkMap>({
      id: workId,
      userId: profile.id,
      deletedAt: null,
    });
  }

  @Transactional()
  async create(payload: CreateWorkRequest, profile: ProfileEntity) {
    return await this.workService.create<WorkMap>({
      userId: profile.id,
      companyName: payload.companyName,
      position: payload.position,
      supervisor: payload.supervisor,
      start: payload.start,
      end: payload.stillWorking ? null : payload.end,
      stillWorking: payload.stillWorking ?? false,
      salary: payload.salary,
      jobdesk: payload.jobdesk,
      reason: payload.reason,
    });
  }

  @Transactional()
  async update(
    workId: number,
    payload: UpdateWorkRequest,
    profile: ProfileEntity,
  ) {
    return await this.workService.update<WorkMap>(workId, {
      userId: profile.id,
      companyName: payload.companyName,
      position: payload.position,
      supervisor: payload.supervisor,
      start: payload.start,
      end: payload.stillWorking ? null : payload.end,
      stillWorking: payload.stillWorking ?? false,
      salary: payload.salary,
      jobdesk: payload.jobdesk,
      reason: payload.reason,
    });
  }

  @Transactional()
  async remove(workId: number, profile: ProfileEntity) {
    return await this.workService.remove(workId, profile.id);
  }
}
