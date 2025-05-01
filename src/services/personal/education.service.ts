import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import {
  CreateEducationDto,
  UpdateEducationDto,
  PaginationDto,
} from 'src/cores/dtos';
import { ExtendedPrismaClient } from 'src/infrastructures/database/prisma/prisma.extension';

@Injectable()
export class EducationService {
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
    return await this.dataService.tx.education
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
          yearStart: 'desc',
        },
      })
      .withPages({
        limit: perPage,
        page: page,
      });
  }

  async findAllByFilter(pagination: PaginationDto, sortBy?: 'asc' | 'desc') {
    return await this.dataService.tx.education
      .paginate({
        where: { deletedAt: null },
        include: {
          user: true,
          statusCode: true,
          educationCode: true,
        },
        orderBy: {
          yearStart: sortBy || 'asc',
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
    const education = await this.dataService.tx.education.findFirst({
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

    if (!education) {
      throw new HttpException(
        'Education record not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    if (education.userId !== params.userId) {
      throw new HttpException(
        'Unauthorized: You do not have permission to access this record.',
        HttpStatus.FORBIDDEN,
      );
    }

    return education as T;
  }

  async create<T>(payload: CreateEducationDto) {
    const yearStart =
      payload.yearStart && !isNaN(new Date(payload.yearStart).getTime())
        ? new Date(payload.yearStart).toISOString()
        : null;

    const yearEnd =
      payload.yearEnd && !isNaN(new Date(payload.yearEnd).getTime())
        ? new Date(payload.yearEnd).toISOString()
        : null;

    const yearInformal =
      payload.yearInformal && !isNaN(new Date(payload.yearInformal).getTime())
        ? new Date(payload.yearInformal).toISOString()
        : null;

    if (payload.yearStart > payload.yearEnd) {
      throw new HttpException(
        'Invalid year range: Start year must be less than or equal to end year.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return (await this.dataService.tx.education.create({
      data: {
        userId: payload.userId,
        education: payload.education,
        status: payload.status,
        name: payload.name,
        study: payload.study,
        yearStart: yearStart,
        yearEnd: yearEnd,
        yearInformal: yearInformal,
        city: payload.city,
        duration: payload.duration,
        certificate: payload.certificate,
      },
    })) as T;
  }

  async update<T>(id: number, payload: UpdateEducationDto) {

    const yearStart =
      payload.yearStart && !isNaN(new Date(payload.yearStart).getTime())
        ? new Date(payload.yearStart).toISOString()
        : null;

    const yearEnd =
      payload.yearEnd && !isNaN(new Date(payload.yearEnd).getTime())
        ? new Date(payload.yearEnd).toISOString()
        : null;

    const yearInformal =
      payload.yearInformal && !isNaN(new Date(payload.yearInformal).getTime())
        ? new Date(payload.yearInformal).toISOString()
        : null;

    if (payload.yearStart > payload.yearEnd) {
      throw new HttpException(
        'Invalid year range: Start year must be less than or equal to end year.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const education = await this.dataService.tx.education.findUnique({
      where: { id },
    });

    if (!education || education.userId !== payload.userId) {
      throw new HttpException(
        'Unauthorized: You do not have permission to update this resource.',
        HttpStatus.FORBIDDEN,
      );
    }

    return (await this.dataService.tx.education.update({
      where: { id },
      data: {
        userId: payload.userId,
        education: payload.education,
        status: payload.status,
        name: payload.name,
        study: payload.study,
        yearStart: yearStart,
        yearEnd: yearEnd,
        yearInformal: yearInformal,
        city: payload.city,
        duration: payload.duration,
        certificate: payload.certificate,
      },
    })) as T;
  }

  async remove(id: number, userId: string) {
    const now = DateTime.now().toISO();

    const education = await this.dataService.tx.education.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });

    if (!education) {
      throw new HttpException(
        `Unauthorized: You do not have permission to delete this resource.`,
        HttpStatus.FORBIDDEN,
      );
    }

    const updatedEducation = await this.dataService.tx.education.update({
      where: { id },
      data: { deletedAt: now },
    });

    return updatedEducation;
  }

  async removeForce(id: number) {
    const education = await this.dataService.tx.education.findUnique({
      where: { id },
    });

    if (!education) {
      throw new HttpException(
        `Education with id: ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.dataService.tx.education.delete({
      where: { id },
    });
  }
}
