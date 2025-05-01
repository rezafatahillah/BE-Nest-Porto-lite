import { Injectable, NotFoundException } from '@nestjs/common';
import { RoleResourceMap } from 'src/cores/entities';

import { RoleService } from 'src/services';

@Injectable()
export class FindRoleUseCase {
  constructor(private readonly roleService: RoleService) {}

  async findOne(id: number) {
    const role = await this.roleService.findOne<RoleResourceMap>(id, {
      permissionsOnRoles: {
        include: {
          permission: true,
        },
      },
    });

    if (!role) {
      throw new NotFoundException();
    }

    return role;
  }
}
