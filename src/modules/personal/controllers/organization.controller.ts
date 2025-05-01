import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AccessAuthGuard, PermissionGuard } from 'src/middlewares/guards';
import {
  CreateOrganizationRequest,
  QueryOrganizationRequest,
  UpdateOrganizationRequest,
} from '../requests';
import { OrganizationUseCase } from '../use-cases';
import { FileMapper, OrganizationMapper } from 'src/middlewares/interceptors';
import { AuthPayload, Permissions } from 'src/common/decorators';
import { ProfileEntity } from 'src/cores/entities';

@ApiTags('Organization')
@UseGuards(AccessAuthGuard, PermissionGuard)
@Controller({
  path: 'organization',
  version: '1.0',
})
export class OrganizationController {
  constructor(
    private readonly organizationMapper: OrganizationMapper,
    private readonly fileMapper: FileMapper,
    private readonly useCase: OrganizationUseCase,
  ) {}

  @Get()
  @Permissions(['organization:view'])
  async findAll(
    @Query() query: QueryOrganizationRequest,
    @AuthPayload() profile: ProfileEntity,
  ) {
    const [datas, meta] = await this.useCase.findAll(query, profile);

    return await this.organizationMapper.toPaginate(datas, meta);
  }

  @Get(':id')
  @Permissions(['organization:view'])
  async findOne(
    @Param('id') id: number,
    @AuthPayload() profile: ProfileEntity,
  ) {
    return await this.organizationMapper.toMap(
      await this.useCase.findOne(id, profile),
    );
  }

  @Post()
  @Permissions(['organization:create'])
  async create(
    @Body() payload: CreateOrganizationRequest,
    @AuthPayload() profile: ProfileEntity,
  ) {
    return await this.organizationMapper.toMap(await this.useCase.create(payload, profile));
  }

  @Patch(':id')
  @Permissions(['organization:update'])
  async update(
    @Param('id') id: number,
    @Body() payload: UpdateOrganizationRequest,
    @AuthPayload() profile: ProfileEntity,
  ) {
    return await this.organizationMapper.toMap(
      await this.useCase.update(id, payload, profile),
    );
  }

  @Delete(':id')
  @Permissions(['organization:delete'])
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number, @AuthPayload() profile: ProfileEntity) {
    await this.useCase.remove(id, profile);
  }
}
