import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  CreateRoleRequest,
  QueryRoleRequest,
  UpdateRoleRequest,
} from '../requests';
import { ApiTags } from '@nestjs/swagger';
import { AccessAuthGuard, PermissionGuard } from 'src/middlewares/guards';
import { Permissions } from 'src/common/decorators';
import {
  CreateRoleUseCase,
  FindRoleUseCase,
  GetRoleUseCase,
  RemoveRoleUseCase,
  UpdateRoleUseCase,
} from '../use-cases';
import { RoleMapper } from 'src/middlewares/interceptors';

@ApiTags('Roles')
@UseGuards(AccessAuthGuard, PermissionGuard)
@Controller({
  path: 'access/roles',
  version: '1.0',
})
export class RoleController {
  constructor(
    private readonly mapper: RoleMapper,
    private readonly getUseCase: GetRoleUseCase,
    private readonly findUseCase: FindRoleUseCase,
    private readonly createUseCase: CreateRoleUseCase,
    private readonly updateUseCase: UpdateRoleUseCase,
    private readonly removeUseCase: RemoveRoleUseCase,
  ) {}

  @Get()
  @Permissions(['access:view'])
  async findAll(@Query() query: QueryRoleRequest) {
    return this.mapper.toCollection(await this.getUseCase.findAll(query));
  }

  @Get(':id')
  @Permissions(['access:view'])
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const role = await this.findUseCase.findOne(id);

    return this.mapper.toResource(role);
  }

  @Post()
  @Permissions(['access:create'])
  async create(@Body() createRoleRequest: CreateRoleRequest) {
    const created = await this.createUseCase.create(createRoleRequest);

    return this.mapper.toResource(created);
  }

  @Patch(':id')
  @Permissions(['access:update'])
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleRequest: UpdateRoleRequest,
  ) {
    const updated = await this.updateUseCase.update(id, updateRoleRequest);

    return this.mapper.toResource(updated);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions(['access:delete'])
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.removeUseCase.remove(id);
  }
}
