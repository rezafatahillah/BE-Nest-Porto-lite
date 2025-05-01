import { Injectable } from '@nestjs/common';
import {
  CreateMaritalStatusRequest,
  QueryMaritalStatusRequest,
  UpdateMaritalStatusRequest,
} from '../../requests';
import { FileDirectoryService, MaritalStatusService } from 'src/services';
import { Transactional } from '@nestjs-cls/transactional';
import { MaritalStatusMap } from 'src/cores/entities';

@Injectable()
export class MaritalStatusUseCase {
  constructor(
    private readonly maritalStatusService: MaritalStatusService,
    private readonly fileDirectoryService: FileDirectoryService,
  ) {}

  async findAll(query: QueryMaritalStatusRequest) {
    return await this.maritalStatusService.findAll(query);
  }

  async findOne(maritalStatusId: number) {
    return await this.maritalStatusService.findOne<MaritalStatusMap>(
      maritalStatusId,
      // {
      //   picture: true, 
      //   banner: true,
      // },
    );
  }

  @Transactional()
  async create(payload: CreateMaritalStatusRequest) {

    return await this.maritalStatusService.create<MaritalStatusMap>(
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
    maritalStatusId: number,
    payload: UpdateMaritalStatusRequest,
  ) {
    return await this.maritalStatusService.update<MaritalStatusMap>(
      maritalStatusId,
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
  async remove(maritalStatusId: number) {
    return await this.maritalStatusService.remove(maritalStatusId);
  }
}
