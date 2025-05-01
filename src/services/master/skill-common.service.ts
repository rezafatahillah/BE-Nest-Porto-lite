import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import {
  CreateSkillCommonDto,
  UpdateSkillCommonDto,
  PaginationDto,
} from 'src/cores/dtos';
import { ExtendedPrismaClient } from 'src/infrastructures/database/prisma/prisma.extension';

@Injectable()
export class SkillCommonService {
  constructor(
    private readonly dataService: TransactionHost<
      TransactionalAdapterPrisma<ExtendedPrismaClient>
    >,
  ) {}

  async findAll(pagination: PaginationDto) {
    return await this.dataService.tx.skillCommon
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
    return await this.dataService.tx.skillCommon
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
    return (await this.dataService.tx.skillCommon.findFirst({
      where: { id, deletedAt: null },
    })) as T;
  }

  async create<T>(payload: CreateSkillCommonDto) {
    let slug = this.generateSlug(payload.name);

    let isSlugExist = await this.checkSlugExist(slug);
    if (isSlugExist) {
      let counter = 1;

      while (await this.checkSlugExist(`${slug}-${counter}`)) {
        counter++;
      }

      slug = `${slug}-${counter}`;
    }

    return (await this.dataService.tx.skillCommon.create({
      data: {
        published: payload.published,
        name: payload.name,
        slug,
      },
    })) as T;
  }

  async update<T>(id: number, payload: UpdateSkillCommonDto) {
    return (await this.dataService.tx.skillCommon.update({
      where: { id },
      data: {
        published: payload.published,
        name: payload.name,
        slug: payload.slug,
      },
    })) as T;
  }

  async remove(id: number) {
    const now = DateTime.now().toISO();

    const updatedSkillCommon = await this.dataService.tx.skillCommon.update({
      where: { id },
      data: { deletedAt: now },
    });

    return updatedSkillCommon;
  }

  async removeForce(id: number) {
    const skillCommon = await this.dataService.tx.skillCommon.findUnique({
      where: { id },
    });

    if (!skillCommon) {
      throw new HttpException(
        `SkillCommon with id: ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.dataService.tx.skillCommon.delete({
      where: { id },
    });
  }

  async checkSlugExist<T>(slug: string) {
    return (await this.dataService.tx.skillCommon.findUnique({
      where: { slug },
    })) as T;
  }

  // async checkNameExist<T>(name: string) {
  //   return (await this.dataService.tx.skillCommon.findFirst({
  //     where: { name },
  //   })) as T;
  // }

  async checkName(params: {
    name: string;
  }): Promise<void> {
    const name = await this.dataService.tx.skillCommon.findFirst({
      where: {
        name: params.name,
      },
    });
  
    if (name) {
      throw new HttpException(
        `Skill Common with name: ${params.name} already.`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private generateSlug(name: string): string {
    return name.replace(/\s+/g, '-').toLowerCase();
  }
}
