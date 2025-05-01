import { Module } from '@nestjs/common';
import { PermissionController } from './controllers';
import { RoleController } from './controllers/role.controller';
import {
  CreateRoleUseCase,
  FindRoleUseCase,
  GetPermissionUseCase,
  GetRoleUseCase,
  RemoveRoleUseCase,
  UpdateRoleUseCase,
} from './use-cases';

@Module({
  controllers: [RoleController, PermissionController],
  providers: [
    GetRoleUseCase,
    FindRoleUseCase,
    CreateRoleUseCase,
    UpdateRoleUseCase,
    RemoveRoleUseCase,
    GetPermissionUseCase,
  ],
})
export class AccessModule {}
