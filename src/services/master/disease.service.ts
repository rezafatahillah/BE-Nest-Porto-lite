import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { CreateDiseaseDto, UpdateDiseaseDto, PaginationDto } from 'src/cores/dtos';
import { ExtendedPrismaClient } from 'src/infrastructures/database/prisma/prisma.extension';

@Injectable()
export class DiseaseService {
  constructor(
    private readonly dataService: TransactionHost<
      TransactionalAdapterPrisma<ExtendedPrismaClient>
    >,
  ) {}

  async findAll(pagination: PaginationDto) {
    return await this.dataService.tx.disease 
      .paginate({
        where: { deletedAt: null },
        orderBy: {
          createdAt: 'desc',
        },
      })
      .withPages({
        limit: pagination.perPage,
        page: pagination.page,
      });
  }

  async findAllCustom(pagination: PaginationDto) {
    return await this.dataService.tx.disease 
      .paginate({
        where: { deletedAt: null },
        orderBy: {
          id: 'asc'
        },
      })
      .withPages({
        limit: pagination.perPage,
        page: pagination.page,
      });
  }

  async findAllByFilter(pagination: PaginationDto, sortBy?: 'asc' | 'desc') {

    return await this.dataService.tx.disease
      .paginate({
        where: { deletedAt: null },
        orderBy: {
          createdAt: sortBy || 'asc',
        },
      })
      .withPages({
        limit: pagination.perPage,
        page: pagination.page,
      });
  }

  async findOne<T>(id: number) {
    return (await this.dataService.tx.disease.findFirst({
      where: { id, deletedAt: null },
    })) as T;
  }

  async create<T>(createDiseaseDto: CreateDiseaseDto) {
    return (await this.dataService.tx.disease.create({
      data: {
        name: createDiseaseDto.name,
      },
    })) as T;
  }

  async update<T>(
    id: number,
    updateDiseaseDto: UpdateDiseaseDto,
  ) {
    return (await this.dataService.tx.disease.update({
      where: { id },
      data: {
        name: updateDiseaseDto.name,
      },
    })) as T;
  }

  async remove(id: number) {
    const now = DateTime.now().toISO();

    const updatedDisease = await this.dataService.tx.disease.update({
      where: { id },
      data: { deletedAt: now },
    });

    return updatedDisease;
  }

  async removeForce(id: number) {
    const disease = await this.dataService.tx.disease.findUnique({
      where: { id },
    });

    if (!disease) {
      throw new HttpException(`Disease with id: ${id} not found`, HttpStatus.NOT_FOUND);
    }

    return await this.dataService.tx.disease.delete({
      where: { id },
    });
  }
}
