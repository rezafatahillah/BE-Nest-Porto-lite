import { Injectable } from '@nestjs/common';
import {
  CreateGenderRequest,
  QueryGenderRequest,
  UpdateGenderRequest,
} from '../../requests';
import { FileDirectoryService, GenderService } from 'src/services';
import { Transactional } from '@nestjs-cls/transactional';
import { GenderMap } from 'src/cores/entities';

@Injectable()
export class GenderUseCase {
  constructor(
    private readonly genderService: GenderService,
    private readonly fileDirectoryService: FileDirectoryService,
  ) {}

  async findAll(query: QueryGenderRequest) {
    return await this.genderService.findAll(query);
  }

  async findOne(genderId: number) {
    return await this.genderService.findOne<GenderMap>(
      genderId,
      // {
      //   picture: true, 
      //   banner: true,
      // },
    );
  }

  @Transactional()
  async create(payload: CreateGenderRequest) {

    return await this.genderService.create<GenderMap>(
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
    genderId: number,
    payload: UpdateGenderRequest,
  ) {
    return await this.genderService.update<GenderMap>(
      genderId,
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
  async remove(genderId: number) {
    return await this.genderService.remove(genderId);
  }
}
