import { Injectable } from '@nestjs/common';
import {
  CreateUserRequest,
  QueryUserRequest,
  UpdateUserRequest,
} from '../requests';
import { FileDirectoryService, UserService } from 'src/services';
import { Transactional } from '@nestjs-cls/transactional';
import { ProfileEntity, UserMap } from 'src/cores/entities';
import { UserType } from 'src/cores/enums';

@Injectable()
export class UserUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly fileDirectoryService: FileDirectoryService,
  ) {}

  async findAll(query: QueryUserRequest, profile: ProfileEntity) {
    return await this.userService.findAll({
      ...query,
      currentUserId: profile.id,
    });
  }

  async findOne(userId: string) {
    return await this.userService.findOne<UserMap>(userId, {
      picture: true,
    });
  }

  @Transactional()
  async create(payload: CreateUserRequest) {
    if (payload.pictureId) {
      const saved = await this.fileDirectoryService.save({
        dirname: 'user-picture',
        fileId: payload.pictureId,
      });

      payload.pictureId = saved.id;
    }

    return await this.userService.create<UserMap>(
      {
        type: UserType.Operator,
        name: payload.name,
        email: payload.email,
        pictureId: payload.pictureId,
      },
      {
        picture: true,
      },
    );
  }

  @Transactional()
  async update(userId: string, payload: UpdateUserRequest) {
    return await this.userService.update<UserMap>(
      userId,
      {
        name: payload.name,
        email: payload.email,
      },
      {
        picture: true,
      },
    );
  }

  @Transactional()
  async remove(userId: string) {
    return await this.userService.removeForce(userId);
  }
}
