import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { PaginationDto } from 'src/cores/dtos';
import { ExtendedPrismaClient } from 'src/infrastructures/database/prisma/prisma.extension';

@Injectable()
export class CodeService {
  constructor(
    private readonly dataService: TransactionHost<
      TransactionalAdapterPrisma<ExtendedPrismaClient>
    >,
  ) {}

  async findAll(pagination: PaginationDto, type?: string, sortBy?: string) {
    const validSortBy = sortBy?.toLowerCase() === 'asc' ? 'asc' : 'desc';

    // console.log(type)
    return await this.dataService.tx.code
      .paginate({
        where: { deletedAt: null, ...(type && { type }) },
        orderBy: {
          createdAt: validSortBy,
        },
      })
      .withPages({
        limit: pagination.perPage,
        page: pagination.page,
      });
  }
}
