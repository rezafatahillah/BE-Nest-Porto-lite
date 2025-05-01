import { Injectable, Request } from '@nestjs/common';
import { AuthService } from 'src/services';
import { Transactional } from '@nestjs-cls/transactional';
import { LocalAuthEntity } from 'src/cores/entities';

@Injectable()
export class LoginUseCase {
  constructor(private readonly authService: AuthService) {}

  @Transactional()
  async login(
    @Request()
    { user }: { user: LocalAuthEntity },
  ) {
    const authenticated = await this.authService.attempt({
      localAuth: user,
    });

    const abilities = user.permissions.map((permission) => permission.slug);

    return { authenticated, abilities };
  }
}
