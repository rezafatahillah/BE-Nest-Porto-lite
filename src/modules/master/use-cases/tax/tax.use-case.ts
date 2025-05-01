import { Injectable } from '@nestjs/common';
import {
  CreateTaxRequest,
  QueryTaxRequest,
  UpdateTaxRequest,
} from '../../requests';
import { FileDirectoryService, TaxService } from 'src/services';
import { Transactional } from '@nestjs-cls/transactional';
import { TaxMap } from 'src/cores/entities';

@Injectable()
export class TaxUseCase {
  constructor(
    private readonly taxService: TaxService,
    private readonly fileDirectoryService: FileDirectoryService,
  ) {}

  async findAll(query: QueryTaxRequest) {
    return await this.taxService.findAll(query);
  }

  async findOne(taxId: number) {
    return await this.taxService.findOne<TaxMap>(
      taxId,
      // {
      //   picture: true, 
      //   banner: true,
      // },
    );
  }

  @Transactional()
  async create(payload: CreateTaxRequest) {

    return await this.taxService.create<TaxMap>(
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
    taxId: number,
    payload: UpdateTaxRequest,
  ) {
    return await this.taxService.update<TaxMap>(
      taxId,
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
  async remove(taxId: number) {
    return await this.taxService.remove(taxId);
  }
}
