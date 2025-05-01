import { Injectable } from '@nestjs/common';
import { ProfileEntity } from 'src/cores/entities';
import { UpdateProfileRequest } from '../requests';
import { AuthService, UserService } from 'src/services';
import { Prisma } from '@prisma/client';
import { Transactional } from '@nestjs-cls/transactional';

@Injectable()
export class ProfileUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Transactional()
  async update(profile: ProfileEntity, payload: UpdateProfileRequest) {
    const updated = await this.userService.update<
      Prisma.UserGetPayload<Prisma.UserDefaultArgs>
    >(profile.id, {
      name: payload.name,
    });

    profile.name = payload.name;
    await this.authService.setUser(profile.id, profile);

    return updated;
  }

  @Transactional()
  async destroy(profile: ProfileEntity) {
    return await this.userService.remove(profile.id);
  }
}
