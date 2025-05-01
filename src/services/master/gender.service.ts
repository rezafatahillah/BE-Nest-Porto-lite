import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { CreateGenderDto, UpdateGenderDto, PaginationDto } from 'src/cores/dtos';
import { ExtendedPrismaClient } from 'src/infrastructures/database/prisma/prisma.extension';

@Injectable()
export class GenderService {
  constructor(
    private readonly dataService: TransactionHost<
      TransactionalAdapterPrisma<ExtendedPrismaClient>
    >,
  ) {}

  async findAll(pagination: PaginationDto) {
    return await this.dataService.tx.gender 
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

    return await this.dataService.tx.gender
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
    return (await this.dataService.tx.gender.findFirst({
      where: { id, deletedAt: null },
    })) as T;
  }

  async create<T>(createGenderDto: CreateGenderDto) {
    return (await this.dataService.tx.gender.create({
      data: {
        name: createGenderDto.name,
      },
    })) as T;
  }

  async update<T>(
    id: number,
    updateGenderDto: UpdateGenderDto,
  ) {
    return (await this.dataService.tx.gender.update({
      where: { id },
      data: {
        name: updateGenderDto.name,
      },
    })) as T;
  }

  async remove(id: number) {
    const now = DateTime.now().toISO();

    const updatedGender = await this.dataService.tx.gender.update({
      where: { id },
      data: { deletedAt: now },
    });

    return updatedGender;
  }

  async removeForce(id: number) {
    const gender = await this.dataService.tx.gender.findUnique({
      where: { id },
    });

    if (!gender) {
      throw new HttpException(`Gender with id: ${id} not found`, HttpStatus.NOT_FOUND);
    }

    return await this.dataService.tx.gender.delete({
      where: { id },
    });
  }
}
