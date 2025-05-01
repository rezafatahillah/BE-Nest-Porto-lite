import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { CreateWorkDto, UpdateWorkDto, PaginationDto } from 'src/cores/dtos';
import { ExtendedPrismaClient } from 'src/infrastructures/database/prisma/prisma.extension';

@Injectable()
export class WorkService {
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
    return await this.dataService.tx.work
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
          start: 'desc',
        },
      })
      .withPages({
        limit: perPage,
        page: page,
      });
  }

  async findOne<T>(params: {
    id: number;
    userId: string;
    deletedAt: null;
  }): Promise<T> {
    const work = await this.dataService.tx.work.findFirst({
      where: {
        id: params.id,
        deletedAt: params.deletedAt,
      },
      include: {
        user: true,
      },
    });

    if (!work) {
      throw new HttpException(
        'Work record not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    if (work.userId !== params.userId) {
      throw new HttpException(
        'Unauthorized: You do not have permission to access this record.',
        HttpStatus.FORBIDDEN,
      );
    }

    return work as T;
  }

  async create<T>(payload: CreateWorkDto) {
    // Validasi jika stillWorking false dan end < start
    if (!payload.stillWorking && payload.end && payload.start > payload.end) {
      throw new HttpException(
        'Tanggal selesai pekerjaan harus lebih besar atau sama dengan tanggal mulai.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return (await this.dataService.tx.work.create({
      data: {
        userId: payload.userId,
        companyName: payload.companyName,
        position: payload.position,
        supervisor: payload.supervisor,
        start: payload.start,
        end: payload.end,
        stillWorking: payload.stillWorking,
        salary: payload.salary,
        jobdesk: payload.jobdesk,
        reason: payload.reason,
      },
    })) as T;
  }

  async update<T>(id: number, payload: UpdateWorkDto) {
    // Validasi jika stillWorking false dan end < start
    if (!payload.stillWorking && payload.end && payload.start > payload.end) {
      throw new HttpException(
        'Tanggal selesai pekerjaan harus lebih besar atau sama dengan tanggal mulai.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const work = await this.dataService.tx.work.findUnique({
      where: { id },
    });

    if (!work || work.userId !== payload.userId) {
      throw new HttpException(
        'Unauthorized: You do not have permission to update this resource.',
        HttpStatus.FORBIDDEN,
      );
    }

    return (await this.dataService.tx.work.update({
      where: { id },
      data: {
        userId: payload.userId,
        companyName: payload.companyName,
        position: payload.position,
        supervisor: payload.supervisor,
        start: payload.start,
        end: payload.end,
        salary: payload.salary,
        jobdesk: payload.jobdesk,
        reason: payload.reason,
      },
    })) as T;
  }

  async remove(id: number, userId: string) {
    const now = DateTime.now().toISO();

    const work = await this.dataService.tx.work.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });

    if (!work) {
      throw new HttpException(
        `Unauthorized: You do not have permission to delete this resource.`,
        HttpStatus.FORBIDDEN,
      );
    }

    const updatedWork = await this.dataService.tx.work.update({
      where: { id },
      data: { deletedAt: now },
    });

    return updatedWork;
  }

  async removeForce(id: number) {
    const work = await this.dataService.tx.work.findUnique({
      where: { id },
    });

    if (!work) {
      throw new HttpException(
        `Work with id: ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.dataService.tx.work.delete({
      where: { id },
    });
  }
}
