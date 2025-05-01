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
  CreateLanguageRequest,
  QueryLanguageRequest,
  UpdateLanguageRequest,
} from '../requests';
import { LanguageUseCase } from '../use-cases';
import { FileMapper, LanguageMapper } from 'src/middlewares/interceptors';
import { AuthPayload, Permissions } from 'src/common/decorators';
import { ProfileEntity } from 'src/cores/entities';

@ApiTags('Language')
@UseGuards(AccessAuthGuard, PermissionGuard)
@Controller({
  path: 'language',
  version: '1.0',
})
export class LanguageController {
  constructor(
    private readonly languageMapper: LanguageMapper,
    private readonly fileMapper: FileMapper,
    private readonly useCase: LanguageUseCase,
  ) {}

  @Get()
  @Permissions(['language:view'])
  async findAll(
    @Query() query: QueryLanguageRequest,
    @AuthPayload() profile: ProfileEntity,
  ) {
    const [datas, meta] = await this.useCase.findAll(query, profile);

    return await this.languageMapper.toPaginate(datas, meta);
  }

  @Get(':id')
  @Permissions(['language:view'])
  async findOne(
    @Param('id') id: number,
    @AuthPayload() profile: ProfileEntity,
  ) {
    return await this.languageMapper.toMap(
      await this.useCase.findOne(id, profile),
    );
  }

  @Post()
  @Permissions(['language:create'])
  async create(
    @Body() payload: CreateLanguageRequest,
    @AuthPayload() profile: ProfileEntity,
  ) {
    return await this.languageMapper.toMap(await this.useCase.create(payload, profile));
  }

  @Patch(':id')
  @Permissions(['language:update'])
  async update(
    @Param('id') id: number,
    @Body() payload: UpdateLanguageRequest,
    @AuthPayload() profile: ProfileEntity,
  ) {
    return await this.languageMapper.toMap(
      await this.useCase.update(id, payload, profile),
    );
  }

  @Delete(':id')
  @Permissions(['language:delete'])
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number, @AuthPayload() profile: ProfileEntity) {
    await this.useCase.remove(id, profile);
  }
}
