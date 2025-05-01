import { Injectable } from '@nestjs/common';
import {
  CreateMedicalQuestionRequest,
  QueryMedicalQuestionRequest,
  UpdateMedicalQuestionRequest,
} from '../../requests';
import { FileDirectoryService, MedicalQuestionService } from 'src/services';
import { Transactional } from '@nestjs-cls/transactional';
import { MedicalQuestionMap } from 'src/cores/entities';

@Injectable()
export class MedicalQuestionUseCase {
  constructor(
    private readonly medialQuestionService: MedicalQuestionService,
    private readonly fileDirectoryService: FileDirectoryService,
  ) {}

  async findAll(query: QueryMedicalQuestionRequest) {
    return await this.medialQuestionService.findAll(query);
  }

  async findAllCustom(query: QueryMedicalQuestionRequest) {
    return await this.medialQuestionService.findAllCustom(query);
  }

  async findOne(medialQuestionId: number) {
    return await this.medialQuestionService.findOne<MedicalQuestionMap>(
      medialQuestionId,
      // {
      //   picture: true, 
      //   banner: true,
      // },
    );
  }

  @Transactional()
  async create(payload: CreateMedicalQuestionRequest) {

    return await this.medialQuestionService.create<MedicalQuestionMap>(
      {
        name: payload.name,
        groupId: payload.groupId,
      },
      // {
      //   picture: true,
      //   banner: true,
      // },
    );
  }

  @Transactional()
  async update(
    medialQuestionId: number,
    payload: UpdateMedicalQuestionRequest,
  ) {
    return await this.medialQuestionService.update<MedicalQuestionMap>(
      medialQuestionId,
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
  async remove(medialQuestionId: number) {
    return await this.medialQuestionService.remove(medialQuestionId);
  }
}
