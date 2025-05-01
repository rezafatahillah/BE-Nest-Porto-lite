import { Injectable } from '@nestjs/common';
import { CreateRoleRequest } from '../../requests';
import { RoleService } from 'src/services';
import { Transactional } from '@nestjs-cls/transactional';
import { RoleResourceMap } from 'src/cores/entities';
import { CreateRoleDto } from 'src/cores/dtos';

@Injectable()
export class CreateRoleUseCase {
  constructor(private readonly roleService: RoleService) {}

  @Transactional()
  async create(createRoleRequest: CreateRoleRequest) {
    return await this.roleService.create<RoleResourceMap>(
      new CreateRoleDto({
        name: createRoleRequest.name,
        permissions: createRoleRequest.permissions,
      }),
      {
        permissionsOnRoles: {
          include: {
            permission: true,
          },
        },
      },
    );
  }
}
