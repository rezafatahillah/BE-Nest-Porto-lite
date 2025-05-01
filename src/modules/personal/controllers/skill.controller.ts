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
  CreateSkillRequest,
  QuerySkillRequest,
  UpdateSkillRequest,
} from '../requests';
import { SkillUseCase } from '../use-cases';
import { FileMapper, SkillMapper } from 'src/middlewares/interceptors';
import { AuthPayload, Permissions } from 'src/common/decorators';
import { ProfileEntity } from 'src/cores/entities';

@ApiTags('Skill')
@UseGuards(AccessAuthGuard, PermissionGuard)
@Controller({
  path: 'skill',
  version: '1.0',
})
export class SkillController {
  constructor(
    private readonly skillMapper: SkillMapper,
    private readonly fileMapper: FileMapper,
    private readonly useCase: SkillUseCase,
  ) {}

  @Get()
  @Permissions(['skill:view'])
  async findAll(
    @Query() query: QuerySkillRequest,
    @AuthPayload() profile: ProfileEntity,
  ) {
    const [datas, meta] = await this.useCase.findAll(query, profile);

    return await this.skillMapper.toPaginate(datas, meta);
  }

  @Get(':id')
  @Permissions(['skill:view'])
  async findOne(
    @Param('id') id: number,
    @AuthPayload() profile: ProfileEntity,
  ) {
    return await this.skillMapper.toMap(
      await this.useCase.findOne(id, profile),
    );
  }

  @Post()
  @Permissions(['skill:create'])
  async create(
    @Body() payload: CreateSkillRequest,
    @AuthPayload() profile: ProfileEntity,
  ) {
    return await this.skillMapper.toMap(await this.useCase.create(payload, profile));
  }

  @Patch(':id')
  @Permissions(['skill:update'])
  async update(
    @Param('id') id: number,
    @Body() payload: UpdateSkillRequest,
    @AuthPayload() profile: ProfileEntity,
  ) {
    return await this.skillMapper.toMap(
      await this.useCase.update(id, payload, profile),
    );
  }

  @Delete(':id')
  @Permissions(['skill:delete'])
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number, @AuthPayload() profile: ProfileEntity) {
    await this.useCase.remove(id, profile);
  }
}
