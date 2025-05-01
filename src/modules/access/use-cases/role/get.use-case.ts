import { Injectable } from '@nestjs/common';
import { QueryRoleRequest } from '../../requests';
import { RoleService } from 'src/services';

@Injectable()
export class GetRoleUseCase {
  constructor(private readonly roleService: RoleService) {}

  async findAll(query: QueryRoleRequest) {
    return await this.roleService.findAll(query);
  }
}
