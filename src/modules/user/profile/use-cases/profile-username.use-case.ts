import { BadRequestException, Injectable } from '@nestjs/common';
import { ProfileEntity } from 'src/cores/entities';
import { AuthService, IdentityService } from 'src/services';
import { UpdateUsernameRequest } from '../requests';

@Injectable()
export class ProfileUsernameUseCase {
  constructor(
    private readonly authService: AuthService,
    private readonly identityService: IdentityService,
  ) {}

  async updateUsername(
    profile: ProfileEntity,
    { username }: UpdateUsernameRequest,
  ) {
    const exist = await this.identityService.findUsername(username, {
      column: 'id',
      value: profile.id,
    });
    if (exist) {
      throw new BadRequestException([
        {
          field: 'username',
          errors: [`username is already exists.`],
        },
      ]);
    }

    const after = await this.identityService.updateUsername(profile.id, {
      username,
    });

    await this.authService.updateUser(profile.id, { email: after.username });

    return {
      before: profile.email,
      after: after.username,
    };
  }
}
