import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import {
  CreateMedicalDto,
  UpdateMedicalDto,
  PaginationDto,
} from 'src/cores/dtos';
import { ExtendedPrismaClient } from 'src/infrastructures/database/prisma/prisma.extension';

@Injectable()
export class MedicalService {
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
    return await this.dataService.tx.medical
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
          disease: true,
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

  async findAllCustom({
    perPage,
    page,
    currentUserId,
  }: { currentUserId?: string } & PaginationDto) {
    return await this.dataService.tx.medical
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
          disease: true,
        },
        orderBy: {
          id: 'asc',
        },
      })
      .withPages({
        limit: perPage,
        page: page,
      });
  }

  async findAllByFilter(pagination: PaginationDto, sortBy?: 'asc' | 'desc') {
    return await this.dataService.tx.medical
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
    const medical = await this.dataService.tx.medical.findFirst({
      where: {
        id: params.id,
        deletedAt: params.deletedAt,
      },
      include: {
        user: true,
      },
    });

    if (!medical) {
      throw new HttpException(
        'Medical record not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    if (medical.userId !== params.userId) {
      throw new HttpException(
        'Unauthorized: You do not have permission to access this record.',
        HttpStatus.FORBIDDEN,
      );
    }

    return medical as T;
  }

  async create<T>(payload: CreateMedicalDto) {
    return (await this.dataService.tx.medical.create({
      data: {
        userId: payload.userId,
        diseaseId: payload.diseaseId,
        answer: payload.answer,
      },
    })) as T;
  }

  async update<T>(id: number, payload: UpdateMedicalDto) {
    const medical = await this.dataService.tx.medical.findFirst({
      where: {
        userId : payload.userId, 
        deletedAt: null,
      },
    });
    

    // console.log("id",id)
    // console.log("medical", medical)
    // console.log("payload", payload)

    if (!medical || medical.userId !== payload.userId) {
      throw new HttpException(
        'Unauthorized: You do not have permission to update this resource.',
        HttpStatus.FORBIDDEN,
      );
    }

    return (await this.dataService.tx.medical.update({
      where: { id },
      data: {
        userId: payload.userId,
        diseaseId: payload.diseaseId,
        answer: payload.answer,
      },
    })) as T;
  }

  async remove(id: number, userId: string) {
    const now = DateTime.now().toISO();

    const medical = await this.dataService.tx.medical.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });

    if (!medical) {
      throw new HttpException(
        `Unauthorized: You do not have permission to delete this resource.`,
        HttpStatus.FORBIDDEN,
      );
    }

    const updatedMedical = await this.dataService.tx.medical.update({
      where: { id },
      data: { deletedAt: now },
    });

    return updatedMedical;
  }

  async removeForce(id: number) {
    const medical = await this.dataService.tx.medical.findUnique({
      where: { id },
    });

    if (!medical) {
      throw new HttpException(
        `Medical with id: ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.dataService.tx.medical.delete({
      where: { id },
    });
  }
  
}
