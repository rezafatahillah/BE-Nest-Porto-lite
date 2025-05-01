import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import {
  CreateFamilyDto,
  UpdateFamilyDto,
  PaginationDto,
} from 'src/cores/dtos';
import { ExtendedPrismaClient } from 'src/infrastructures/database/prisma/prisma.extension';

@Injectable()
export class FamilyService {
  constructor(
    private readonly dataService: TransactionHost<
      TransactionalAdapterPrisma<ExtendedPrismaClient>
    >,
  ) {}

  async findAll({
    perPage,
    page,
    currentUserId,
  }: { currentUserId?: string } & PaginationDto) {
    return await this.dataService.tx.family
      .paginate({
        where: {
          AND: [
            { deletedAt: null },
            currentUserId
              ? { userId: currentUserId } // Memfilter berdasarkan userId jika currentUserId ada
              : {},
          ],
        },
        include: {
          user: true,
          statusCode: true,
          educationCode: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
      .withPages({
        limit: perPage,
        page: page,
      });
  }

  async findAllByFilter(pagination: PaginationDto, sortBy?: 'asc' | 'desc') {
    return await this.dataService.tx.family
      .paginate({
        where: { deletedAt: null },
        include: {
          user: true,
          statusCode: true,
          educationCode: true,
        },
        orderBy: {
          createdAt: sortBy || 'asc',
        },
      })
      .withPages({
        limit: pagination.perPage,
        page: pagination.page,
      });
  }

  async findOne<T>(params: {
    id: number;
    userId: string;
    deletedAt: null;
  }): Promise<T> {
    const family = await this.dataService.tx.family.findFirst({
      where: {
        id: params.id,
        deletedAt: params.deletedAt,
      },
      include: {
        user: true,
        statusCode: true,
        educationCode: true,
      },
    });

    if (!family) {
      throw new HttpException(
        'Family record not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    if (family.userId !== params.userId) {
      throw new HttpException(
        'Unauthorized: You do not have permission to access this record.',
        HttpStatus.FORBIDDEN,
      );
    }

    return family as T;
  }

  async create<T>(payload: CreateFamilyDto) {
    const birthDate = new Date(payload.birthDate).toISOString();
    return (await this.dataService.tx.family.create({
      data: {
        main: payload.main,
        userId: payload.userId,
        name: payload.name,
        status: payload.status,
        birthDate: birthDate,
        education: payload.education,
        job: payload.job,
      },
    })) as T;
  }

  async update<T>(id: number, payload: UpdateFamilyDto) {
    const birthDate = new Date(payload.birthDate).toISOString();
    const family = await this.dataService.tx.family.findUnique({
      where: { id },
    });

    if (!family || family.userId !== payload.userId) {
      throw new HttpException(
        'Unauthorized: You do not have permission to update this resource.',
        HttpStatus.FORBIDDEN,
      );
    }

    return (await this.dataService.tx.family.update({
      where: { id },
      data: {
        main: payload.main,
        userId: payload.userId,
        name: payload.name,
        status: payload.status,
        birthDate: birthDate,
        education: payload.education,
        job: payload.job,
      },
    })) as T;
  }

  async remove(id: number, userId: string) {
    const now = DateTime.now().toISO();

    const family = await this.dataService.tx.family.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });

    if (!family) {
      throw new HttpException(
        `Unauthorized: You do not have permission to delete this resource.`,
        HttpStatus.FORBIDDEN,
      );
    }

    const updatedFamily = await this.dataService.tx.family.update({
      where: { id },
      data: { deletedAt: now },
    });

    return updatedFamily;
  }

  async removeForce(id: number) {
    const family = await this.dataService.tx.family.findUnique({
      where: { id },
    });

    if (!family) {
      throw new HttpException(
        `Family with id: ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.dataService.tx.family.delete({
      where: { id },
    });
  }
}
