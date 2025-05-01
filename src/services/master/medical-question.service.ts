import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { CreateMedicalQuestionDto, UpdateMedicalQuestionDto, PaginationDto } from 'src/cores/dtos';
import { ExtendedPrismaClient } from 'src/infrastructures/database/prisma/prisma.extension';

@Injectable()
export class MedicalQuestionService {
  constructor(
    private readonly dataService: TransactionHost<
      TransactionalAdapterPrisma<ExtendedPrismaClient>
    >,
  ) {}

  async findAll(pagination: PaginationDto) {
    return await this.dataService.tx.medicalQuestion 
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
    return await this.dataService.tx.medicalQuestion 
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

    return await this.dataService.tx.medicalQuestion
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
    return (await this.dataService.tx.medicalQuestion.findFirst({
      where: { id, deletedAt: null },
    })) as T;
  }

  async create<T>(createMedicalQuestionDto: CreateMedicalQuestionDto) {
    return (await this.dataService.tx.medicalQuestion.create({
      data: {
        name: createMedicalQuestionDto.name,
        groupId: createMedicalQuestionDto.groupId,
      },
    })) as T;
  }

  async update<T>(
    id: number,
    updateMedicalQuestionDto: UpdateMedicalQuestionDto,
  ) {
    return (await this.dataService.tx.medicalQuestion.update({
      where: { id },
      data: {
        name: updateMedicalQuestionDto.name,
      },
    })) as T;
  }

  async remove(id: number) {
    const now = DateTime.now().toISO();

    const updatedMedicalQuestion = await this.dataService.tx.medicalQuestion.update({
      where: { id },
      data: { deletedAt: now },
    });

    return updatedMedicalQuestion;
  }

  async removeForce(id: number) {
    const medicalQuestion = await this.dataService.tx.medicalQuestion.findUnique({
      where: { id },
    });

    if (!medicalQuestion) {
      throw new HttpException(`MedicalQuestion with id: ${id} not found`, HttpStatus.NOT_FOUND);
    }

    return await this.dataService.tx.medicalQuestion.delete({
      where: { id },
    });
  }
}
