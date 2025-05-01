// import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// import { DateTime } from 'luxon';
// import { TransactionHost } from '@nestjs-cls/transactional';
// import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
// import {
//   CreateCandidateDto,
//   UpdateCandidateDto,
//   PaginationDto,
// } from 'src/cores/dtos';
// import { ExtendedPrismaClient } from 'src/infrastructures/database/prisma/prisma.extension';

// @Injectable()
// export class CandidateService {
//   constructor(
//     private readonly dataService: TransactionHost<
//       TransactionalAdapterPrisma<ExtendedPrismaClient>
//     >,
//   ) {}

//   async findAll(pagination: PaginationDto) {
//     return await this.dataService.tx.candidate
//       .paginate({
//         // where: { deletedAt: null },
//         // include: {
//         //   user:true
//         // },
//       })
//       .withPages({
//         limit: pagination.perPage,
//         page: pagination.page,
//       });
//   }

//   async findAllByFilter(pagination: PaginationDto, sortBy?: 'asc' | 'desc') {
//     return await this.dataService.tx.candidate
//       .paginate({
//         // orderBy: {
//         //   createdAt: sortBy || 'asc',
//         // },
//       })
//       .withPages({
//         limit: pagination.perPage,
//         page: pagination.page,
//       });
//   }

//   async findOne<T>(id: number) {
//     return (await this.dataService.tx.candidate.findFirst({
//       // where: { id, deletedAt: null },
//       // include: {
//       //   user:true
//       // },
//     })) as T;
//   }

//   async create<T>(payload: CreateCandidateDto) {
//     return (await this.dataService.tx.candidate.create({
//       data: {
//         userId: payload.userId,
//       },
//     })) as T;
//   }

//   async update<T>(id: string, payload: UpdateCandidateDto) {
//     return (await this.dataService.tx.candidate.update({
//       where: { id },
//       data: {
//         userId: payload.id,
//       },
//     })) as T;
//   }

//   async remove(id: number) {
//     const now = DateTime.now().toISO();

//     const updatedCandidate = await this.dataService.tx.candidate.update({
//       where: { id },
//     });

//     return updatedCandidate;
//   }

//   async removeForce(id: number) {
//     const candidate = await this.dataService.tx.candidate.findUnique({
//       where: { id },
//     });

//     if (!candidate) {
//       throw new HttpException(
//         `Candidate with id: ${id} not found`,
//         HttpStatus.NOT_FOUND,
//       );
//     }

//     return await this.dataService.tx.candidate.delete({
//       where: { id },
//     });
//   }
// }
