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
  CreateFamilyRequest,
  CreateMultipleFamilyRequest,
  QueryFamilyRequest,
  UpdateFamilyRequest,
  UpdateMultipleFamilyRequest,
} from '../requests';
import { FamilyUseCase } from '../use-cases';
import { FileMapper, FamilyMapper } from 'src/middlewares/interceptors';
import { AuthPayload, Permissions } from 'src/common/decorators';
import { ProfileEntity } from 'src/cores/entities';

@ApiTags('Family')
@UseGuards(AccessAuthGuard, PermissionGuard)
@Controller({
  path: 'family',
  version: '1.0',
})
export class FamilyController {
  constructor(
    private readonly familyMapper: FamilyMapper,
    private readonly fileMapper: FileMapper,
    private readonly useCase: FamilyUseCase,
  ) {}

  @Get()
  @Permissions(['family:view'])
  async findAll(
    @Query() query: QueryFamilyRequest,
    @AuthPayload() profile: ProfileEntity,
  ) {
    const [datas, meta] = await this.useCase.findAll(query, profile);

    return await this.familyMapper.toPaginate(datas, meta);
  }

  @Get(':id')
  @Permissions(['family:view'])
  async findOne(
    @Param('id') id: number,
    @AuthPayload() profile: ProfileEntity,
  ) {
    return await this.familyMapper.toMap(
      await this.useCase.findOne(id, profile),
    );
  }

  @Post('multiple')
  @Permissions(['family:create'])
  async createMultiple(
    @Body() payload: CreateMultipleFamilyRequest,
    @AuthPayload() profile: ProfileEntity,
  ) {
    const results = await this.useCase.createMultiple(payload, profile);

    return await this.familyMapper.toMapArray(results);
  }

  @Patch('multiple')
  @Permissions(['family:update'])
  async updateMultiple(
    @Body() payload: UpdateMultipleFamilyRequest,
    @AuthPayload() profile: ProfileEntity,
  ) {
    const results = await this.useCase.updateMultiple(payload, profile);

    return await this.familyMapper.toMapArray(results);
  }

  @Post()
  @Permissions(['family:create'])
  async create(
    @Body() payload: CreateFamilyRequest,
    @AuthPayload() profile: ProfileEntity,
  ) {
    return await this.familyMapper.toMap(await this.useCase.create(payload, profile));
  }

  @Patch(':id')
  @Permissions(['family:update'])
  async update(
    @Param('id') id: number,
    @Body() payload: UpdateFamilyRequest,
    @AuthPayload() profile: ProfileEntity,
  ) {
    return await this.familyMapper.toMap(
      await this.useCase.update(id, payload, profile),
    );
  }

  @Delete(':id')
  @Permissions(['family:delete'])
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number, @AuthPayload() profile: ProfileEntity) {
    await this.useCase.remove(id, profile);
  }
}
