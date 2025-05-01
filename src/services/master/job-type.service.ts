import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { CreateJobTypeDto, UpdateJobTypeDto, PaginationDto } from 'src/cores/dtos';
import { ExtendedPrismaClient } from 'src/infrastructures/database/prisma/prisma.extension';

@Injectable()
export class JobTypeService {
  constructor(
    private readonly dataService: TransactionHost<
      TransactionalAdapterPrisma<ExtendedPrismaClient>
    >,
  ) {}

  async findAll(pagination: PaginationDto) {
    return await this.dataService.tx.jobType 
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

    return await this.dataService.tx.jobType
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
    return (await this.dataService.tx.jobType.findFirst({
      where: { id, deletedAt: null },
    })) as T;
  }

  async create<T>(createJobTypeDto: CreateJobTypeDto) {
    return (await this.dataService.tx.jobType.create({
      data: {
        name: createJobTypeDto.name,
      },
    })) as T;
  }

  async update<T>(
    id: number,
    updateJobTypeDto: UpdateJobTypeDto,
  ) {
    return (await this.dataService.tx.jobType.update({
      where: { id },
      data: {
        name: updateJobTypeDto.name,
      },
    })) as T;
  }

  async remove(id: number) {
    const now = DateTime.now().toISO();

    const updatedJobType = await this.dataService.tx.jobType.update({
      where: { id },
      data: { deletedAt: now },
    });

    return updatedJobType;
  }

  async removeForce(id: number) {
    const jobType = await this.dataService.tx.jobType.findUnique({
      where: { id },
    });

    if (!jobType) {
      throw new HttpException(`JobType with id: ${id} not found`, HttpStatus.NOT_FOUND);
    }

    return await this.dataService.tx.jobType.delete({
      where: { id },
    });
  }
}
