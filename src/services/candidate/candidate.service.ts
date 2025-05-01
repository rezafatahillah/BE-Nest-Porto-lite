import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import {
  CreateCandidateDto,
  UpdateCandidateDto,
  PaginationDto,
} from 'src/cores/dtos';
import { ExtendedPrismaClient } from 'src/infrastructures/database/prisma/prisma.extension';

@Injectable()
export class CandidateService {
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
    return await this.dataService.tx.candidate
      .paginate({
        where: {
          AND: [
            { deletedAt: null },
            currentUserId
              ? { id: currentUserId } // Memfilter berdasarkan userId jika currentUserId ada
              : {},
          ],
        },
        include: {
          user: true,
          maritalCode: true,
          religionCode: true,
          picture: true,
          genderCode: true,
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
    return await this.dataService.tx.candidate
      .paginate({
        where: { deletedAt: null },
        include: {
          user: true,
          maritalCode: true,
          religionCode: true,
          genderCode: true,
          picture: true,
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
    id: string;
    // userId: string;
    deletedAt: null;
  }): Promise<T> {
    const candidate = await this.dataService.tx.candidate.findFirst({
      where: {
        id: params.id,
        deletedAt: params.deletedAt,
      },
      include: {
        user: true,
        maritalCode: true,
        religionCode: true,
        genderCode: true,
        picture: true,
      },
    });

    if (!candidate) {
      throw new HttpException(
        'Candidate record not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    if (candidate.id !== params.id) {
      throw new HttpException(
        'Unauthorized: You do not have permission to access this record.',
        HttpStatus.FORBIDDEN,
      );
    }

    return candidate as T;
  }

  async create<T>(payload: CreateCandidateDto) {
    return (await this.dataService.tx.candidate.create({
      data: {
        id: payload.id,
        name: payload.name,
        email: payload.email,
        city: payload.city,
        phone: payload.phone,
        gender: payload.gender,
        birthDate: payload.birthDate,
        birthPlace: payload.birthPlace,
        religion: payload.religion,
        marital: payload.marital,
        otherReligion: payload.otherReligion,
        hobby: payload.hobby,
        summary: payload.summary,
        address: payload.address,
        cityDomicile: payload.cityDomicile,
        postal: payload.postal,
        addressDomicile: payload.addressDomicile,
        postalDomicile: payload.postalDomicile,
        ktp: payload.ktp,
        kk: payload.kk,
        paspor: payload.paspor,
        simA: payload.simA,
        simB: payload.simB,
        simC: payload.simC,
        bpjsKesehatan: payload.bpjsKesehatan,
        bpjsKetenagakerjaan: payload.bpjsKetenagakerjaan,
        npwp: payload.npwp,
        statusPtkp: payload.statusPtkp,
        bankName: payload.bankName,
        accountNo: payload.accountNo,
        accountName: payload.accountName,
        workTerm: payload.workTerm,
        expectedSalary: payload.expectedSalary,
        otherFacility: payload.otherFacility,
        availability: payload.availability,
        interest: payload.interest,
        reason: payload.reason,
        strengths: payload.strengths,
        weaknesses: payload.weaknesses,
        weight: payload.weight,
        height: payload.height,
        hospitalized: payload.hospitalized,
        psychologicalTest: payload.psychologicalTest,
        carOwnership: payload.carOwnership,
        carBrand: payload.carBrand,
        carModel: payload.carModel,
        carYear: payload.carYear,
        bikeOwnership: payload.bikeOwnership,
        bikeBrand: payload.bikeBrand,
        bikeModel: payload.bikeModel,
        bikeYear: payload.bikeYear,
      },
    })) as T;
  }

  async update<T>(id: string, payload: UpdateCandidateDto) {
    const candidate = await this.dataService.tx.candidate.findUnique({
      where: { id },
    });

    console.log("payload", payload.pictureId)
    console.log("candidate", candidate.id)

    if (!candidate || candidate.id !== payload.id) {
      throw new HttpException(
        'Unauthorized: You do not have permission to update this resource.',
        HttpStatus.FORBIDDEN,
      );
    }

    return (await this.dataService.tx.candidate.update({
      where: { id },
      include: {
        // user: true,
      },
      data: {
        id: payload.id,
        // picture: payload.pictureId,
        name: payload.name,
        email: payload.email,
        city: payload.city,
        phone: payload.phone,
        gender: payload.gender,
        birthDate: payload.birthDate,
        birthPlace: payload.birthPlace,
        religion: payload.religion,
        marital: payload.marital,
        otherReligion: payload.otherReligion,
        hobby: payload.hobby,
        summary: payload.summary,
        address: payload.address,
        cityDomicile: payload.cityDomicile,
        postal: payload.postal,
        addressDomicile: payload.addressDomicile,
        postalDomicile: payload.postalDomicile,
        ktp: payload.ktp,
        kk: payload.kk,
        paspor: payload.paspor,
        simA: payload.simA,
        simB: payload.simB,
        simC: payload.simC,
        bpjsKesehatan: payload.bpjsKesehatan,
        bpjsKetenagakerjaan: payload.bpjsKetenagakerjaan,
        npwp: payload.npwp,
        statusPtkp: payload.statusPtkp,
        bankName: payload.bankName,
        accountNo: payload.accountNo,
        accountName: payload.accountName,
        workTerm: payload.workTerm,
        expectedSalary: payload.expectedSalary,
        otherFacility: payload.otherFacility,
        availability: payload.availability,
        interest: payload.interest,
        reason: payload.reason,
        strengths: payload.strengths,
        weaknesses: payload.weaknesses,
        weight: payload.weight,
        height: payload.height,
        hospitalized: payload.hospitalized,
        psychologicalTest: payload.psychologicalTest,
        carOwnership: payload.carOwnership,
        carBrand: payload.carBrand,
        carModel: payload.carModel,
        carYear: payload.carYear,
        bikeOwnership: payload.bikeOwnership,
        bikeBrand: payload.bikeBrand,
        bikeModel: payload.bikeModel,
        bikeYear: payload.bikeYear,
      },
    })) as T;
  }

  async remove(id: string, userId: string) {
    const now = DateTime.now().toISO();

    const candidate = await this.dataService.tx.candidate.findFirst({
      where: {
        id,
        // userId,
        deletedAt: null,
      },
    });

    if (!candidate) {
      throw new HttpException(
        `Unauthorized: You do not have permission to delete this resource.`,
        HttpStatus.FORBIDDEN,
      );
    }

    const updatedCandidate = await this.dataService.tx.candidate.update({
      where: { id },
      data: { deletedAt: now },
    });

    return updatedCandidate;
  }

  async removeForce(id: string) {
    const candidate = await this.dataService.tx.candidate.findUnique({
      where: { id },
    });

    if (!candidate) {
      throw new HttpException(
        `Candidate with id: ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.dataService.tx.candidate.delete({
      where: { id },
    });
  }
}
