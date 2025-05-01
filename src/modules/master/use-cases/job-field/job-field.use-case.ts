import { Injectable } from '@nestjs/common';
import {
  CreateJobFieldRequest,
  QueryJobFieldRequest,
  UpdateJobFieldRequest,
} from '../../requests';
import { FileDirectoryService, JobFieldService } from 'src/services';
import { Transactional } from '@nestjs-cls/transactional';
import { JobFieldMap } from 'src/cores/entities';

@Injectable()
export class JobFieldUseCase {
  constructor(
    private readonly jobFieldService: JobFieldService,
    private readonly fileDirectoryService: FileDirectoryService,
  ) {}

  async findAll(query: QueryJobFieldRequest) {
    return await this.jobFieldService.findAll(query);
  }

  async findOne(jobFieldId: number) {
    return await this.jobFieldService.findOne<JobFieldMap>(
      jobFieldId,
      // {
      //   picture: true, 
      //   banner: true,
      // },
    );
  }

  @Transactional()
  async create(payload: CreateJobFieldRequest) {

    return await this.jobFieldService.create<JobFieldMap>(
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
    jobFieldId: number,
    payload: UpdateJobFieldRequest,
  ) {
    return await this.jobFieldService.update<JobFieldMap>(
      jobFieldId,
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
  async remove(jobFieldId: number) {
    return await this.jobFieldService.remove(jobFieldId);
  }
}
