import { Injectable } from '@nestjs/common';
import {
  CreateDoctypeRequest,
  CreateMultipleDoctypeRequest,
  QueryDoctypeRequest,
  UpdateDoctypeRequest,
  UpdateMultipleDoctypeRequest,
} from '../../requests';
import {
  FileDirectoryService,
  DoctypeService,
  FileService,
} from 'src/services';
import { Transactional } from '@nestjs-cls/transactional';
import { DoctypeMap } from 'src/cores/entities';
import { ProfileEntity } from 'src/cores/entities';
import { Doc } from 'src/cores/enums';

@Injectable()
export class DoctypeUseCase {
  constructor(
    private readonly doctypeService: DoctypeService,
    private readonly fileDirectoryService: FileDirectoryService,
    private readonly fileService: FileService,
  ) {}

  async findAll(query: QueryDoctypeRequest, profile: ProfileEntity) {
    return await this.doctypeService.findAll({
      ...query,
      currentUserId: profile.id,
    });
  }

  async findOne(doctypeId: number, profile: ProfileEntity) {
    return await this.doctypeService.findOne<DoctypeMap>({
      id: doctypeId,
      userId: profile.id,
      deletedAt: null,
    });
  }

  @Transactional()
  async createMultiple(
    payload: CreateMultipleDoctypeRequest,
    profile: ProfileEntity,
  ) {
    return await Promise.all(
      payload.doctypes.map((doctype) => this.create(doctype, profile)),
    );
  }

  @Transactional()
  async updateMultiple(
    payload: UpdateMultipleDoctypeRequest,
    profile: ProfileEntity,
  ) {
    return await Promise.all(
      payload.doctypes.map((doctype) =>
        this.update(doctype.id, doctype, profile),
      ),
    );
  }

  @Transactional()
  async create(payload: CreateDoctypeRequest, profile: ProfileEntity) {
    if (payload.group && Object.values(Doc).includes(payload.group)) {
      payload.name =
        Object.keys(Doc).find(
          (key) => Doc[key as keyof typeof Doc] === payload.group,
        ) || 'Unknown';
    }

    if (payload.fileId) {
      const saved = await this.fileDirectoryService.save({
        dirname: 'file-candidate',
        fileId: payload.fileId,
      });

      payload.fileId = saved.id;
    }

    return await this.doctypeService.create<DoctypeMap>({
      userId: profile.id,
      fileId: payload.fileId,
      name: payload.name,
      required: payload.required,
      group: payload.group,
      active: payload.active,
    });
  }

  @Transactional()
  async update(
    doctypeId: number,
    payload: UpdateDoctypeRequest,
    profile: ProfileEntity,
  ) {
    return await this.doctypeService.update<DoctypeMap>(doctypeId, {
      userId: profile.id,
      fileId: payload.fileId,
      name: payload.name,
      required: payload.required,
      group: payload.group,
      active: payload.active,
    });
  }

  @Transactional()
  async remove(doctypeId: number, profile: ProfileEntity) {
    return await this.doctypeService.remove(doctypeId, profile.id);
  }
}
