import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { CreateDegreeDto, UpdateDegreeDto, PaginationDto } from 'src/cores/dtos';
import { ExtendedPrismaClient } from 'src/infrastructures/database/prisma/prisma.extension';

@Injectable()
export class DegreeService {
  constructor(
    private readonly dataService: TransactionHost<
      TransactionalAdapterPrisma<ExtendedPrismaClient>
    >,
  ) {}

  async findAll(pagination: PaginationDto) {
    return await this.dataService.tx.degree 
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

  async findAllByFilter(pagination: PaginationDto, sortBy?: 'asc' | 'desc') {

    return await this.dataService.tx.degree
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
    return (await this.dataService.tx.degree.findFirst({
      where: { id, deletedAt: null },
    })) as T;
  }

  async create<T>(createDegreeDto: CreateDegreeDto) {
    return (await this.dataService.tx.degree.create({
      data: {
        name: createDegreeDto.name,
      },
    })) as T;
  }

  async update<T>(
    id: number,
    updateDegreeDto: UpdateDegreeDto,
  ) {
    return (await this.dataService.tx.degree.update({
      where: { id },
      data: {
        name: updateDegreeDto.name,
      },
    })) as T;
  }

  async remove(id: number) {
    const now = DateTime.now().toISO();

    const updatedDegree = await this.dataService.tx.degree.update({
      where: { id },
      data: { deletedAt: now },
    });

    return updatedDegree;
  }

  async removeForce(id: number) {
    const degree = await this.dataService.tx.degree.findUnique({
      where: { id },
    });

    if (!degree) {
      throw new HttpException(`Degree with id: ${id} not found`, HttpStatus.NOT_FOUND);
    }

    return await this.dataService.tx.degree.delete({
      where: { id },
    });
  }
}
