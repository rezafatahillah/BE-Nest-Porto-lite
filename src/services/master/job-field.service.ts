import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { CreateJobFieldDto, UpdateJobFieldDto, PaginationDto } from 'src/cores/dtos';
import { ExtendedPrismaClient } from 'src/infrastructures/database/prisma/prisma.extension';

@Injectable()
export class JobFieldService {
  constructor(
    private readonly dataService: TransactionHost<
      TransactionalAdapterPrisma<ExtendedPrismaClient>
    >,
  ) {}

  async findAll(pagination: PaginationDto) {
    return await this.dataService.tx.jobField 
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

    return await this.dataService.tx.jobField
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
    return (await this.dataService.tx.jobField.findFirst({
      where: { id, deletedAt: null },
    })) as T;
  }

  async create<T>(createJobFieldDto: CreateJobFieldDto) {
    return (await this.dataService.tx.jobField.create({
      data: {
        name: createJobFieldDto.name,
      },
    })) as T;
  }

  async update<T>(
    id: number,
    updateJobFieldDto: UpdateJobFieldDto,
  ) {
    return (await this.dataService.tx.jobField.update({
      where: { id },
      data: {
        name: updateJobFieldDto.name,
      },
    })) as T;
  }

  async remove(id: number) {
    const now = DateTime.now().toISO();

    const updatedJobField = await this.dataService.tx.jobField.update({
      where: { id },
      data: { deletedAt: now },
    });

    return updatedJobField;
  }

  async removeForce(id: number) {
    const jobField = await this.dataService.tx.jobField.findUnique({
      where: { id },
    });

    if (!jobField) {
      throw new HttpException(`JobField with id: ${id} not found`, HttpStatus.NOT_FOUND);
    }

    return await this.dataService.tx.jobField.delete({
      where: { id },
    });
  }
}
