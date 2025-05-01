import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { CreateReligionDto, UpdateReligionDto, PaginationDto } from 'src/cores/dtos';
import { ExtendedPrismaClient } from 'src/infrastructures/database/prisma/prisma.extension';

@Injectable()
export class ReligionService {
  constructor(
    private readonly dataService: TransactionHost<
      TransactionalAdapterPrisma<ExtendedPrismaClient>
    >,
  ) {}

  async findAll(pagination: PaginationDto) {
    return await this.dataService.tx.religion 
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

    return await this.dataService.tx.religion
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
    return (await this.dataService.tx.religion.findFirst({
      where: { id, deletedAt: null },
    })) as T;
  }

  async create<T>(createReligionDto: CreateReligionDto) {
    return (await this.dataService.tx.religion.create({
      data: {
        name: createReligionDto.name,
      },
    })) as T;
  }

  async update<T>(
    id: number,
    updateReligionDto: UpdateReligionDto,
  ) {
    return (await this.dataService.tx.religion.update({
      where: { id },
      data: {
        name: updateReligionDto.name,
      },
    })) as T;
  }

  async remove(id: number) {
    const now = DateTime.now().toISO();

    const updatedReligion = await this.dataService.tx.religion.update({
      where: { id },
      data: { deletedAt: now },
    });

    return updatedReligion;
  }

  async removeForce(id: number) {
    const religion = await this.dataService.tx.religion.findUnique({
      where: { id },
    });

    if (!religion) {
      throw new HttpException(`Religion with id: ${id} not found`, HttpStatus.NOT_FOUND);
    }

    return await this.dataService.tx.religion.delete({
      where: { id },
    });
  }
}
