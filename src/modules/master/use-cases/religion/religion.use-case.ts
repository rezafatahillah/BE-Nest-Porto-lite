import { Injectable } from '@nestjs/common';
import {
  CreateReligionRequest,
  QueryReligionRequest,
  UpdateReligionRequest,
} from '../../requests';
import { FileDirectoryService, ReligionService } from 'src/services';
import { Transactional } from '@nestjs-cls/transactional';
import { ReligionMap } from 'src/cores/entities';

@Injectable()
export class ReligionUseCase {
  constructor(
    private readonly religionService: ReligionService,
    private readonly fileDirectoryService: FileDirectoryService,
  ) {}

  async findAll(query: QueryReligionRequest) {
    return await this.religionService.findAll(query);
  }

  async findOne(religionId: number) {
    return await this.religionService.findOne<ReligionMap>(
      religionId,
      // {
      //   picture: true, 
      //   banner: true,
      // },
    );
  }

  @Transactional()
  async create(payload: CreateReligionRequest) {

    return await this.religionService.create<ReligionMap>(
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
    religionId: number,
    payload: UpdateReligionRequest,
  ) {
    return await this.religionService.update<ReligionMap>(
      religionId,
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
  async remove(religionId: number) {
    return await this.religionService.remove(religionId);
  }
}
