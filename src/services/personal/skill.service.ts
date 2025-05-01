import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import {
  CreateSkillDto,
  UpdateSkillDto,
  PaginationDto,
} from 'src/cores/dtos';
import { ExtendedPrismaClient } from 'src/infrastructures/database/prisma/prisma.extension';

@Injectable()
export class SkillService {
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
    return await this.dataService.tx.skill
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
          common: true,
          code:true,
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
    return await this.dataService.tx.skill
      .paginate({
        where: { deletedAt: null },
        include: {
          user: true,
          common: true,
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
    const skill = await this.dataService.tx.skill.findFirst({
      where: {
        id: params.id,
        deletedAt: params.deletedAt,
      },
      include: {
        user: true,
        common: true,
        code: true,
      },
    });

    if (!skill) {
      throw new HttpException(
        'Skill record not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    if (skill.userId !== params.userId) {
      throw new HttpException(
        'Unauthorized: You do not have permission to access this record.',
        HttpStatus.FORBIDDEN,
      );
    }

    return skill as T;
  }

  async create<T>(payload: CreateSkillDto) {
    return (await this.dataService.tx.skill.create({
      data: {
        userId: payload.userId,
        skillCommonId: payload.skillCommonId,
        skillLevel: payload.skillLevel,
      },
    })) as T;
  }

  async update<T>(id: number, payload: UpdateSkillDto) {
    const skill = await this.dataService.tx.skill.findUnique({
      where: { id },
    });

    if (!skill || skill.userId !== payload.userId) {
      throw new HttpException(
        'Unauthorized: You do not have permission to update this resource.',
        HttpStatus.FORBIDDEN,
      );
    }

    return (await this.dataService.tx.skill.update({
      where: { id },
      data: {
        userId: payload.userId,
        skillCommonId: payload.skillCommonId,
        skillLevel: payload.skillLevel,
      },
    })) as T;
  }

  async remove(id: number, userId: string) {
    const now = DateTime.now().toISO();

    const skill = await this.dataService.tx.skill.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });

    if (!skill) {
      throw new HttpException(
        `Unauthorized: You do not have permission to delete this resource.`,
        HttpStatus.FORBIDDEN,
      );
    }

    const updatedSkill = await this.dataService.tx.skill.update({
      where: { id },
      data: { deletedAt: now },
    });

    return updatedSkill;
  }

  async removeForce(id: number) {
    const skill = await this.dataService.tx.skill.findUnique({
      where: { id },
    });

    if (!skill) {
      throw new HttpException(
        `Skill with id: ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.dataService.tx.skill.delete({
      where: { id },
    });
  }

  async checkSkillCommon(params: {
    skillCommonId: number;
    userId: string;
  }): Promise<void> {
    const skill = await this.dataService.tx.skill.findFirst({
      where: {
        skillCommonId: params.skillCommonId,
        userId: params.userId,
        deletedAt: null,
      },
    });
  
    if (skill) {
      throw new HttpException(
        `Skill with skillCommonId: ${params.skillCommonId} already exists for this user.`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  
}
