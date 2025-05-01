import { Injectable } from '@nestjs/common';
import {
  CreateJobTypeRequest,
  QueryJobTypeRequest,
  UpdateJobTypeRequest,
} from '../../requests';
import { FileDirectoryService, JobTypeService } from 'src/services';
import { Transactional } from '@nestjs-cls/transactional';
import { JobTypeMap } from 'src/cores/entities';

@Injectable()
export class JobTypeUseCase {
  constructor(
    private readonly jobTypeService: JobTypeService,
    private readonly fileDirectoryService: FileDirectoryService,
  ) {}

  async findAll(query: QueryJobTypeRequest) {
    return await this.jobTypeService.findAll(query);
  }

  async findOne(jobTypeId: number) {
    return await this.jobTypeService.findOne<JobTypeMap>(
      jobTypeId,
      // {
      //   picture: true, 
      //   banner: true,
      // },
    );
  }

  @Transactional()
  async create(payload: CreateJobTypeRequest) {

    return await this.jobTypeService.create<JobTypeMap>(
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
    jobTypeId: number,
    payload: UpdateJobTypeRequest,
  ) {
    return await this.jobTypeService.update<JobTypeMap>(
      jobTypeId,
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
  async remove(jobTypeId: number) {
    return await this.jobTypeService.remove(jobTypeId);
  }
}
