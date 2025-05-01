import { AuthService } from 'src/services';
import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { ProfileEntity } from 'src/cores/entities';

@Injectable()
export class LogoutUseCase {
  constructor(private readonly authService: AuthService) {}

  @Transactional()
  async logout(payload: ProfileEntity) {
    return await this.authService.destroy(payload.id);
  }
}
