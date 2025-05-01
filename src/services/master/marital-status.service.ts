import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { CreateMaritalStatusDto, UpdateMaritalStatusDto, PaginationDto } from 'src/cores/dtos';
import { ExtendedPrismaClient } from 'src/infrastructures/database/prisma/prisma.extension';

@Injectable()
export class MaritalStatusService {
  constructor(
    private readonly dataService: TransactionHost<
      TransactionalAdapterPrisma<ExtendedPrismaClient>
    >,
  ) {}

  async findAll(pagination: PaginationDto) {
    return await this.dataService.tx.maritalStatus 
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

    return await this.dataService.tx.maritalStatus
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
    return (await this.dataService.tx.maritalStatus.findFirst({
      where: { id, deletedAt: null },
    })) as T;
  }

  async create<T>(createMaritalStatusDto: CreateMaritalStatusDto) {
    return (await this.dataService.tx.maritalStatus.create({
      data: {
        name: createMaritalStatusDto.name,
      },
    })) as T;
  }

  async update<T>(
    id: number,
    updateMaritalStatusDto: UpdateMaritalStatusDto,
  ) {
    return (await this.dataService.tx.maritalStatus.update({
      where: { id },
      data: {
        name: updateMaritalStatusDto.name,
      },
    })) as T;
  }

  async remove(id: number) {
    const now = DateTime.now().toISO();

    const updatedMaritalStatus = await this.dataService.tx.maritalStatus.update({
      where: { id },
      data: { deletedAt: now },
    });

    return updatedMaritalStatus;
  }

  async removeForce(id: number) {
    const maritalStatus = await this.dataService.tx.maritalStatus.findUnique({
      where: { id },
    });

    if (!maritalStatus) {
      throw new HttpException(`MaritalStatus with id: ${id} not found`, HttpStatus.NOT_FOUND);
    }

    return await this.dataService.tx.maritalStatus.delete({
      where: { id },
    });
  }
}
