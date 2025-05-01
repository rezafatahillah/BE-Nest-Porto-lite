import { Injectable } from '@nestjs/common';
import { RoleService } from 'src/services';
import { Transactional } from '@nestjs-cls/transactional';

@Injectable()
export class RemoveRoleUseCase {
  constructor(private readonly roleService: RoleService) {}

  @Transactional()
  async remove(id: number) {
    return await this.roleService.remove(id);
  }
}
