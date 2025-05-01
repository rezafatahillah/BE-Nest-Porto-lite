import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
  PaginationDto,
} from 'src/cores/dtos';
import { ExtendedPrismaClient } from 'src/infrastructures/database/prisma/prisma.extension';

@Injectable()
export class OrganizationService {
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
    return await this.dataService.tx.organization
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
    return await this.dataService.tx.organization
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
    const organization = await this.dataService.tx.organization.findFirst({
      where: {
        id: params.id,
        deletedAt: params.deletedAt,
      },
      include: {
        user: true,
      },
    });

    if (!organization) {
      throw new HttpException(
        'Organization record not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    if (organization.userId !== params.userId) {
      throw new HttpException(
        'Unauthorized: You do not have permission to access this record.',
        HttpStatus.FORBIDDEN,
      );
    }

    return organization as T;
  }

  async create<T>(payload: CreateOrganizationDto) {
    const year =
      payload.year && !isNaN(new Date(payload.year).getTime())
        ? new Date(payload.year).toISOString()
        : null;

    return (await this.dataService.tx.organization.create({
      data: {
        userId: payload.userId,
        name: payload.name,
        type: payload.type,
        year: year,
        position: payload.position,
      },
    })) as T;
  }

  async update<T>(id: number, payload: UpdateOrganizationDto) {

    const year =
      payload.year && !isNaN(new Date(payload.year).getTime())
        ? new Date(payload.year).toISOString()
        : null;
    const organization = await this.dataService.tx.organization.findUnique({
      where: { id },
    });

    if (!organization || organization.userId !== payload.userId) {
      throw new HttpException(
        'Unauthorized: You do not have permission to update this resource.',
        HttpStatus.FORBIDDEN,
      );
    }

    return (await this.dataService.tx.organization.update({
      where: { id },
      data: {
        userId: payload.userId,
        name: payload.name,
        type: payload.type,
        year: year,
        position: payload.position,
      },
    })) as T;
  }

  async remove(id: number, userId: string) {
    const now = DateTime.now().toISO();

    const organization = await this.dataService.tx.organization.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });

    if (!organization) {
      throw new HttpException(
        `Unauthorized: You do not have permission to delete this resource.`,
        HttpStatus.FORBIDDEN,
      );
    }

    const updatedOrganization = await this.dataService.tx.organization.update({
      where: { id },
      data: { deletedAt: now },
    });

    return updatedOrganization;
  }

  async removeForce(id: number) {
    const organization = await this.dataService.tx.organization.findUnique({
      where: { id },
    });

    if (!organization) {
      throw new HttpException(
        `Organization with id: ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.dataService.tx.organization.delete({
      where: { id },
    });
  }
}
