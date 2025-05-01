import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/services';
import { Transactional } from '@nestjs-cls/transactional';
import { ProfileEntity } from 'src/cores/entities';

@Injectable()
export class RefreshUseCase {
  constructor(private readonly authService: AuthService) {}

  @Transactional()
  async refresh(payload: ProfileEntity) {
    const { user, permissions, token } = await this.authService.revalidateToken(
      payload.id,
    );

    return {
      user: user,
      abilities: permissions,
      authenticated: token,
    };
  }
}
