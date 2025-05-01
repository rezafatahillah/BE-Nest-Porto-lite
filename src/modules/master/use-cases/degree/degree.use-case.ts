import { Injectable } from '@nestjs/common';
import {
  CreateDegreeRequest,
  QueryDegreeRequest,
  UpdateDegreeRequest,
} from '../../requests';
import { FileDirectoryService, DegreeService } from 'src/services';
import { Transactional } from '@nestjs-cls/transactional';
import { DegreeMap } from 'src/cores/entities';

@Injectable()
export class DegreeUseCase {
  constructor(
    private readonly degreeService: DegreeService,
    private readonly fileDirectoryService: FileDirectoryService,
  ) {}

  async findAll(query: QueryDegreeRequest) {
    return await this.degreeService.findAll(query);
  }

  async findOne(degreeId: number) {
    return await this.degreeService.findOne<DegreeMap>(
      degreeId,
      // {
      //   picture: true, 
      //   banner: true,
      // },
    );
  }

  @Transactional()
  async create(payload: CreateDegreeRequest) {

    return await this.degreeService.create<DegreeMap>(
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
    degreeId: number,
    payload: UpdateDegreeRequest,
  ) {
    return await this.degreeService.update<DegreeMap>(
      degreeId,
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
  async remove(degreeId: number) {
    return await this.degreeService.remove(degreeId);
  }
}
