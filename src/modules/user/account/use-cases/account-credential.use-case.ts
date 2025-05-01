import { BadRequestException, Injectable } from '@nestjs/common';
import {
  UpdateAccountPasswordRequest,
  UpdateAccountRequest,
} from '../requests';
import { Transactional } from '@nestjs-cls/transactional';
import { Generate } from 'src/common/helpers';
import { AuthService, IdentityService } from 'src/services';
import { Prisma } from '@prisma/client';
import { SetIdentityPasswordDto } from 'src/cores/dtos';

@Injectable()
export class AccountCredentialUseCase {
  constructor(
    private readonly authService: AuthService,
    private readonly identityService: IdentityService,
  ) {}

  @Transactional()
  async updateUsername(userId: string, payload: UpdateAccountRequest) {
    const exist = await this.identityService.findUsername(payload.username, {
      column: 'id',
      value: userId,
    });
    if (exist) {
      throw new BadRequestException([
        {
          field: 'username',
          errors: [`username is already exists.`],
        },
      ]);
    }

    const before = await this.identityService.findOne<
      Prisma.IdentityGetPayload<Prisma.IdentityDefaultArgs>
    >(userId);

    const after = await this.identityService.updateUsername(userId, {
      username: payload.username,
    });

    await this.authService.updateUser(after.id, { email: after.username });

    return {
      before: before.username,
      after: after.username,
    };
  }

  @Transactional()
  async resetPassword(userId: string) {
    const password = Generate.randomString();

    const updated = await this.identityService.updatePassword(
      userId,
      new SetIdentityPasswordDto({
        password: password,
      }),
    );

    await this.authService.destroy(userId);

    return {
      credential: {
        username: updated.username,
        password: password,
      },
    };
  }

  @Transactional()
  async updatePassword(
    userId: string,
    { password }: UpdateAccountPasswordRequest,
  ) {
    const updated = await this.identityService.updatePassword(
      userId,
      new SetIdentityPasswordDto({
        password: password,
      }),
    );

    await this.authService.destroy(userId);

    return {
      credential: {
        username: updated.username,
        password: password,
      },
    };
  }
}
