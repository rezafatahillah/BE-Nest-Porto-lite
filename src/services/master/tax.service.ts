import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { CreateTaxDto, UpdateTaxDto, PaginationDto } from 'src/cores/dtos';
import { ExtendedPrismaClient } from 'src/infrastructures/database/prisma/prisma.extension';

@Injectable()
export class TaxService {
  constructor(
    private readonly dataService: TransactionHost<
      TransactionalAdapterPrisma<ExtendedPrismaClient>
    >,
  ) {}

  async findAll(pagination: PaginationDto) {
    return await this.dataService.tx.tax 
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

  async findAllByFilter(pagination: PaginationDto, sortBy?: 'asc' | 'desc') {

    return await this.dataService.tx.tax
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
    return (await this.dataService.tx.tax.findFirst({
      where: { id, deletedAt: null },
    })) as T;
  }

  async create<T>(createTaxDto: CreateTaxDto) {
    return (await this.dataService.tx.tax.create({
      data: {
        name: createTaxDto.name,
      },
    })) as T;
  }

  async update<T>(
    id: number,
    updateTaxDto: UpdateTaxDto,
  ) {
    return (await this.dataService.tx.tax.update({
      where: { id },
      data: {
        name: updateTaxDto.name,
      },
    })) as T;
  }

  async remove(id: number) {
    const now = DateTime.now().toISO();

    const updatedTax = await this.dataService.tx.tax.update({
      where: { id },
      data: { deletedAt: now },
    });

    return updatedTax;
  }

  async removeForce(id: number) {
    const tax = await this.dataService.tx.tax.findUnique({
      where: { id },
    });

    if (!tax) {
      throw new HttpException(`Tax with id: ${id} not found`, HttpStatus.NOT_FOUND);
    }

    return await this.dataService.tx.tax.delete({
      where: { id },
    });
  }
}
