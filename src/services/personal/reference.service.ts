import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import {
  CreateReferenceDto,
  UpdateReferenceDto,
  PaginationDto,
} from 'src/cores/dtos';
import { ExtendedPrismaClient } from 'src/infrastructures/database/prisma/prisma.extension';

@Injectable()
export class ReferenceService {
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
    return await this.dataService.tx.reference
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
    return await this.dataService.tx.reference
      .paginate({
        where: { deletedAt: null },
        include: {
          user: true,
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
    const reference = await this.dataService.tx.reference.findFirst({
      where: {
        id: params.id,
        deletedAt: params.deletedAt,
      },
      include: {
        user: true,
      },
    });

    if (!reference) {
      throw new HttpException(
        'Reference record not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    if (reference.userId !== params.userId) {
      throw new HttpException(
        'Unauthorized: You do not have permission to access this record.',
        HttpStatus.FORBIDDEN,
      );
    }

    return reference as T;
  }

  async create<T>(payload: CreateReferenceDto) {
    return (await this.dataService.tx.reference.create({
      data: {
        userId: payload.userId,
        name: payload.name,
        address: payload.address,
        phone: payload.phone,
        position: payload.position,
        relation: payload.relation,
      },
    })) as T;
  }

  async update<T>(id: number, payload: UpdateReferenceDto) {
    const reference = await this.dataService.tx.reference.findUnique({
      where: { id },
    });

    if (!reference || reference.userId !== payload.userId) {
      throw new HttpException(
        'Unauthorized: You do not have permission to update this resource.',
        HttpStatus.FORBIDDEN,
      );
    }

    return (await this.dataService.tx.reference.update({
      where: { id },
      data: {
        userId: payload.userId,
        name: payload.name,
        address: payload.address,
        phone: payload.phone,
        position: payload.position,
        relation: payload.relation,
      },
    })) as T;
  }

  async remove(id: number, userId: string) {
    const now = DateTime.now().toISO();

    const reference = await this.dataService.tx.reference.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });

    if (!reference) {
      throw new HttpException(
        `Unauthorized: You do not have permission to delete this resource.`,
        HttpStatus.FORBIDDEN,
      );
    }

    const updatedReference = await this.dataService.tx.reference.update({
      where: { id },
      data: { deletedAt: now },
    });

    return updatedReference;
  }

  async removeForce(id: number) {
    const reference = await this.dataService.tx.reference.findUnique({
      where: { id },
    });

    if (!reference) {
      throw new HttpException(
        `Reference with id: ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.dataService.tx.reference.delete({
      where: { id },
    });
  }
}
