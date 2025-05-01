import { Injectable, NotFoundException } from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';
import { AuthService, IdentityService, PermissionService } from 'src/services';
import { Prisma } from '@prisma/client';
import { UpdateAccountAccessRequest } from '../requests';
import { SetIdentityStatusDto, SetIdentityPermissionDto } from 'src/cores/dtos';

@Injectable()
export class AccountAccessUseCase {
  constructor(
    private readonly authService: AuthService,
    private readonly identityService: IdentityService,
    private readonly permissionService: PermissionService,
  ) {}

  @Transactional()
  async access(userId: string, payload: UpdateAccountAccessRequest) {
    const account = await this.identityService.findOne<
      Prisma.IdentityGetPayload<{ include: { role: true } }>
    >(userId, {
      role: true,
    });
    if (!account) {
      throw new NotFoundException(`account does not found.`);
    }

    const parallel = [];

    if (account.role.id !== payload.roleId) {
      parallel.push(
        this.identityService.updateRole(userId, { roleId: payload.roleId }),
      );
    }

    parallel.push(
      this.identityService.updatePermission(
        userId,
        new SetIdentityPermissionDto({
          permissionIds: payload.permissions,
        }),
      ),
    );

    const [permissions] = await Promise.all([
      this.permissionService.findIn(payload.permissions),
      ...parallel,
    ]);

    await this.authService.setPermissions(
      userId,
      permissions.map((p) => p.slug),
    );

    return await this.identityService.updateStatus(
      userId,
      new SetIdentityStatusDto({ enable: true }),
    );
  }
}
