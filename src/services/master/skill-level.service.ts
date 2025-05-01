import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { CreateSkillLevelDto, UpdateSkillLevelDto, PaginationDto } from 'src/cores/dtos';
import { ExtendedPrismaClient } from 'src/infrastructures/database/prisma/prisma.extension';

@Injectable()
export class SkillLevelService {
  constructor(
    private readonly dataService: TransactionHost<
      TransactionalAdapterPrisma<ExtendedPrismaClient>
    >,
  ) {}

  async findAll(pagination: PaginationDto) {
    return await this.dataService.tx.skillLevel 
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

    return await this.dataService.tx.skillLevel
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
    return (await this.dataService.tx.skillLevel.findFirst({
      where: { id, deletedAt: null },
    })) as T;
  }

  async create<T>(createSkillLevelDto: CreateSkillLevelDto) {
    return (await this.dataService.tx.skillLevel.create({
      data: {
        name: createSkillLevelDto.name,
      },
    })) as T;
  }

  async update<T>(
    id: number,
    updateSkillLevelDto: UpdateSkillLevelDto,
  ) {
    return (await this.dataService.tx.skillLevel.update({
      where: { id },
      data: {
        name: updateSkillLevelDto.name,
      },
    })) as T;
  }

  async remove(id: number) {
    const now = DateTime.now().toISO();

    const updatedSkillLevel = await this.dataService.tx.skillLevel.update({
      where: { id },
      data: { deletedAt: now },
    });

    return updatedSkillLevel;
  }

  async removeForce(id: number) {
    const skillLevel = await this.dataService.tx.skillLevel.findUnique({
      where: { id },
    });

    if (!skillLevel) {
      throw new HttpException(`SkillLevel with id: ${id} not found`, HttpStatus.NOT_FOUND);
    }

    return await this.dataService.tx.skillLevel.delete({
      where: { id },
    });
  }
}
