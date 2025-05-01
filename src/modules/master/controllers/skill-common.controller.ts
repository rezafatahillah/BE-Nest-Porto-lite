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
import { AccessAuthGuard, PermissionGuard} from 'src/middlewares/guards';
import {
  CreateSkillCommonRequest,
  QuerySkillCommonRequest,
  UpdateSkillCommonRequest,
} from '../requests';
import { SkillCommonUseCase } from '../use-cases';
import { FileMapper, SkillCommonMapper } from 'src/middlewares/interceptors';
import { Permissions } from 'src/common/decorators';

@ApiTags('Skill Common')
@UseGuards(AccessAuthGuard, PermissionGuard)
@Controller({
  path: 'skill-common',
  version: '1.0',
})
export class SkillCommonController {
  constructor(
    private readonly skillCommonMapper: SkillCommonMapper,
    private readonly fileMapper: FileMapper,
    private readonly useCase: SkillCommonUseCase,
  ) {}

  @Get()
  @Permissions(['skill-common:view'])
  async findAll(@Query() query: QuerySkillCommonRequest) { 
    const [datas, meta] = await this.useCase.findAll(query); 

    return await this.skillCommonMapper.toPaginate(datas, meta);
  }

  @Get(':id')
  @Permissions(['skill-common:view'])
  async findOne(@Param('id') id: number) {
    return await this.skillCommonMapper.toMap(await this.useCase.findOne(id));
  }

  @Post()
  @Permissions(['skill-common:create'])
  async create(@Body() payload: CreateSkillCommonRequest) {
    return await this.skillCommonMapper.toMap(await this.useCase.create(payload));
  }

  @Patch(':id')
  @Permissions(['skill-common:update'])
  async update(@Param('id') id: number, @Body() payload: UpdateSkillCommonRequest) {
    return await this.skillCommonMapper.toMap(
      await this.useCase.update(id, payload),
    );
  }

  @Delete(':id')
  @Permissions(['skill-common:delete'])
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number) {
    await this.useCase.remove(id);
  }
}
