import { Injectable } from '@nestjs/common';
import { ProfileEntity } from 'src/cores/entities';
import { UpdatePasswordRequest } from '../requests';
import { IdentityService } from 'src/services';
import { UpdateIdentityPasswordDto } from 'src/cores/dtos';

@Injectable()
export class ProfilePasswordUseCase {
  constructor(private readonly identityService: IdentityService) {}

  async updatePassword(
    profile: ProfileEntity,
    { currentPassword, password }: UpdatePasswordRequest,
  ) {
    return await this.identityService.changePassword(
      profile.id,
      new UpdateIdentityPasswordDto({
        currentPassword,
        password,
      }),
    );
  }
}
