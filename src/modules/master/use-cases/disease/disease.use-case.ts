import { Injectable } from '@nestjs/common';
import {
  CreateDiseaseRequest,
  QueryDiseaseRequest,
  UpdateDiseaseRequest,
} from '../../requests';
import { FileDirectoryService, DiseaseService } from 'src/services';
import { Transactional } from '@nestjs-cls/transactional';
import { DiseaseMap } from 'src/cores/entities';

@Injectable()
export class DiseaseUseCase {
  constructor(
    private readonly diseaseService: DiseaseService,
    private readonly fileDirectoryService: FileDirectoryService,
  ) {}

  async findAll(query: QueryDiseaseRequest) {
    return await this.diseaseService.findAll(query);
  }

  async findAllCustom(query: QueryDiseaseRequest) {
    return await this.diseaseService.findAllCustom(query);
  }

  async findOne(diseaseId: number) {
    return await this.diseaseService.findOne<DiseaseMap>(
      diseaseId,
      // {
      //   picture: true, 
      //   banner: true,
      // },
    );
  }

  @Transactional()
  async create(payload: CreateDiseaseRequest) {

    return await this.diseaseService.create<DiseaseMap>(
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
    diseaseId: number,
    payload: UpdateDiseaseRequest,
  ) {
    return await this.diseaseService.update<DiseaseMap>(
      diseaseId,
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
  async remove(diseaseId: number) {
    return await this.diseaseService.remove(diseaseId);
  }
}
