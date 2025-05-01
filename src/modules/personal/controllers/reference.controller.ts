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
  CreateReferenceRequest,
  QueryReferenceRequest,
  UpdateReferenceRequest,
} from '../requests';
import { ReferenceUseCase } from '../use-cases';
import { FileMapper, ReferenceMapper } from 'src/middlewares/interceptors';
import { AuthPayload, Permissions } from 'src/common/decorators';
import { ProfileEntity } from 'src/cores/entities';

@ApiTags('Reference')
@UseGuards(AccessAuthGuard, PermissionGuard)
@Controller({
  path: 'reference',
  version: '1.0',
})
export class ReferenceController {
  constructor(
    private readonly referenceMapper: ReferenceMapper,
    private readonly fileMapper: FileMapper,
    private readonly useCase: ReferenceUseCase,
  ) {}

  @Get()
  @Permissions(['reference:view'])
  async findAll(
    @Query() query: QueryReferenceRequest,
    @AuthPayload() profile: ProfileEntity,
  ) {
    const [datas, meta] = await this.useCase.findAll(query, profile);

    return await this.referenceMapper.toPaginate(datas, meta);
  }

  @Get(':id')
  @Permissions(['reference:view'])
  async findOne(
    @Param('id') id: number,
    @AuthPayload() profile: ProfileEntity,
  ) {
    return await this.referenceMapper.toMap(
      await this.useCase.findOne(id, profile),
    );
  }

  @Post()
  @Permissions(['reference:create'])
  async create(
    @Body() payload: CreateReferenceRequest,
    @AuthPayload() profile: ProfileEntity,
  ) {
    return await this.referenceMapper.toMap(await this.useCase.create(payload, profile));
  }

  @Patch(':id')
  @Permissions(['reference:update'])
  async update(
    @Param('id') id: number,
    @Body() payload: UpdateReferenceRequest,
    @AuthPayload() profile: ProfileEntity,
  ) {
    return await this.referenceMapper.toMap(
      await this.useCase.update(id, payload, profile),
    );
  }

  @Delete(':id')
  @Permissions(['reference:delete'])
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number, @AuthPayload() profile: ProfileEntity) {
    await this.useCase.remove(id, profile);
  }
}
