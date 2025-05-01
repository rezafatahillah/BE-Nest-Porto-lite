import { Injectable } from '@nestjs/common';
import {
  CreateCandidateRequest,
  QueryCandidateRequest,
  UpdateCandidateRequest,
} from '../../requests';
import { FileDirectoryService, CandidateService } from 'src/services';
import { Transactional } from '@nestjs-cls/transactional';
import { CandidateMap } from 'src/cores/entities';
import { ProfileEntity } from 'src/cores/entities';

@Injectable()
export class CandidateUseCase {
  constructor(
    private readonly candidateService: CandidateService,
    private readonly fileDirectoryService: FileDirectoryService,
  ) {}

  async findAll(query: QueryCandidateRequest, profile: ProfileEntity) {
    return await this.candidateService.findAll({
      ...query,
      currentUserId: profile.id,
    });
  }

  async findOne(id: string, profile: ProfileEntity) {
    return await this.candidateService.findOne<CandidateMap>({
      // id: candidateId,
      id: profile.id,
      deletedAt: null,
    });
  }

  @Transactional()
  async create(payload: CreateCandidateRequest, profile: ProfileEntity) {

    if (payload.pictureId) {
      const saved = await this.fileDirectoryService.save({
        dirname: 'user-picture',
        fileId: payload.pictureId,
      });

      payload.pictureId = saved.id;
    }
    
    // const duration = `${payload.yearEnd - payload.yearStart}`;
    return await this.candidateService.create<CandidateMap>({
      id: profile.id,
      // userId: profile.id,
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
    });
  }

  @Transactional()
  async update(
    id: string,
    payload: UpdateCandidateRequest,
    profile: ProfileEntity,
  ) {

    return await this.candidateService.update<CandidateMap>(id, {
      id: profile.id,
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
    });
  }

  @Transactional()
  async remove(id: string, profile: ProfileEntity) {
    return await this.candidateService.remove(id, profile.id);
  }
}
