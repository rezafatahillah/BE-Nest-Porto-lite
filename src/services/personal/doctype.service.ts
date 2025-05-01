import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import {
  CreateDoctypeDto,
  UpdateDoctypeDto,
  PaginationDto,
} from 'src/cores/dtos';
import { ExtendedPrismaClient } from 'src/infrastructures/database/prisma/prisma.extension';

@Injectable()
export class DoctypeService {
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
    return await this.dataService.tx.doctype
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
          picture: true,
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
    return await this.dataService.tx.doctype
      .paginate({
        where: { deletedAt: null },
        include: {
          user: true,
          picture: true,
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
    const doctype = await this.dataService.tx.doctype.findFirst({
      where: {
        id: params.id,
        deletedAt: params.deletedAt,
      },
      include: {
        user: true,
        picture: true,
        code: true,
      },
    });

    if (!doctype) {
      throw new HttpException(
        'Doctype record not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    if (doctype.userId !== params.userId) {
      throw new HttpException(
        'Unauthorized: You do not have permission to access this record.',
        HttpStatus.FORBIDDEN,
      );
    }

    return doctype as T;
  }

  async create<T>(payload: CreateDoctypeDto) {
    return (await this.dataService.tx.doctype.create({
      data: {
        userId: payload.userId,
        fileId: payload.fileId,
        name: payload.name,
        required: payload.required,
        group: payload.group,
        active: payload.active,
      },
    })) as T;
  }

  async update<T>(id: number, payload: UpdateDoctypeDto) {
    return (await this.dataService.tx.doctype.update({
      where: { id },
      data: {
        userId: payload.userId,
        fileId: payload.fileId,
        name: payload.name,
        required: payload.required,
        group: payload.group,
        active: payload.active,
      },
    })) as T;
  }

  async remove(id: number, userId: string) {
    const now = DateTime.now().toISO();

    const doctype = await this.dataService.tx.doctype.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });

    if (!doctype) {
      throw new HttpException(
        `Unauthorized: You do not have permission to delete this resource.`,
        HttpStatus.FORBIDDEN,
      );
    }

    const updatedDoctype = await this.dataService.tx.doctype.update({
      where: { id },
      data: { deletedAt: now },
    });

    return updatedDoctype;
  }

  async removeForce(id: number) {
    const doctype = await this.dataService.tx.doctype.findUnique({
      where: { id },
    });

    if (!doctype) {
      throw new HttpException(
        `Doctype with id: ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.dataService.tx.doctype.delete({
      where: { id },
    });
  }
}
