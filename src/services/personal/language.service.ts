import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import {
  CreateLanguageDto,
  UpdateLanguageDto,
  PaginationDto,
} from 'src/cores/dtos';
import { ExtendedPrismaClient } from 'src/infrastructures/database/prisma/prisma.extension';

@Injectable()
export class LanguageService {
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
    return await this.dataService.tx.language
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
          code: true,
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
    return await this.dataService.tx.language
      .paginate({
        where: { deletedAt: null },
        include: {
          user: true,
          code: true,
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
    const language = await this.dataService.tx.language.findFirst({
      where: {
        id: params.id,
        deletedAt: params.deletedAt,
      },
      include: {
        user: true,
        code: true,
      },
    });

    if (!language) {
      throw new HttpException(
        'Language record not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    if (language.userId !== params.userId) {
      throw new HttpException(
        'Unauthorized: You do not have permission to access this record.',
        HttpStatus.FORBIDDEN,
      );
    }

    return language as T;
  }

  async create<T>(payload: CreateLanguageDto) {
    return (await this.dataService.tx.language.create({
      data: {
        userId: payload.userId,
        name: payload.name,
        skillLevel: payload.skillLevel,
      },
    })) as T;
  }

  async update<T>(id: number, payload: UpdateLanguageDto) {
    const language = await this.dataService.tx.language.findUnique({
      where: { id },
    });

    if (!language || language.userId !== payload.userId) {
      throw new HttpException(
        'Unauthorized: You do not have permission to update this resource.',
        HttpStatus.FORBIDDEN,
      );
    }

    return (await this.dataService.tx.language.update({
      where: { id },
      data: {
        userId: payload.userId,
        name: payload.name,
        skillLevel: payload.skillLevel,
      },
    })) as T;
  }

  async remove(id: number, userId: string) {
    const now = DateTime.now().toISO();

    const language = await this.dataService.tx.language.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });

    if (!language) {
      throw new HttpException(
        `Unauthorized: You do not have permission to delete this resource.`,
        HttpStatus.FORBIDDEN,
      );
    }

    const updatedLanguage = await this.dataService.tx.language.update({
      where: { id },
      data: { deletedAt: now },
    });

    return updatedLanguage;
  }

  async removeForce(id: number) {
    const language = await this.dataService.tx.language.findUnique({
      where: { id },
    });

    if (!language) {
      throw new HttpException(
        `Language with id: ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.dataService.tx.language.delete({
      where: { id },
    });
  }
}
