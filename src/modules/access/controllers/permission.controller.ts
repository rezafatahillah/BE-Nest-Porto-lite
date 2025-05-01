import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permissions } from 'src/common/decorators';
import { AccessAuthGuard, PermissionGuard } from 'src/middlewares/guards';
import { GetPermissionUseCase } from '../use-cases';
import { PermissionMapper } from 'src/middlewares/interceptors';

@ApiTags('Permissions')
@UseGuards(AccessAuthGuard, PermissionGuard)
@Controller({
  path: 'access/permissions',
  version: '1.0',
})
export class PermissionController {
  constructor(
    private readonly getUseCase: GetPermissionUseCase,
    private readonly mapper: PermissionMapper,
  ) {}

  @Get()
  @Permissions(['access:permission'])
  async findAll() {
    return this.mapper.toGroup(await this.getUseCase.findAll());
  }

  @Get('role/:roleId')
  @Permissions(['access:permission'])
  async findByRole(@Param('roleId', ParseIntPipe) roleId: number) {
    return this.mapper.toGroup(await this.getUseCase.findByRole(roleId));
  }
}
