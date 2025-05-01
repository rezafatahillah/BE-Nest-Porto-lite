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
  CreateSkillLevelRequest,
  QuerySkillLevelRequest,
  UpdateSkillLevelRequest,
} from '../requests';
import { SkillLevelUseCase } from '../use-cases';
import { FileMapper, SkillLevelMapper } from 'src/middlewares/interceptors';
import { Permissions } from 'src/common/decorators';

@ApiTags('Skill Level')
@UseGuards(AccessAuthGuard, PermissionGuard)
@Controller({
  path: 'skill-level',
  version: '1.0',
})
export class SkillLevelController {
  constructor(
    private readonly skillLevelMapper: SkillLevelMapper,
    private readonly fileMapper: FileMapper,
    private readonly useCase: SkillLevelUseCase,
  ) {}

  @Get()
  @Permissions(['skill-level:view'])
  async findAll(@Query() query: QuerySkillLevelRequest) { 
    const [datas, meta] = await this.useCase.findAll(query); 

    return await this.skillLevelMapper.toPaginate(datas, meta);
  }

  @Get(':id')
  @Permissions(['skill-level:view'])
  async findOne(@Param('id') id: number) {
    return await this.skillLevelMapper.toMap(await this.useCase.findOne(id));
  }

  @Post()
  @Permissions(['skill-level:create'])
  async create(@Body() payload: CreateSkillLevelRequest) {
    return await this.skillLevelMapper.toMap(await this.useCase.create(payload));
  }

  @Patch(':id')
  @Permissions(['skill-level:update'])
  async update(@Param('id') id: number, @Body() payload: UpdateSkillLevelRequest) {
    return await this.skillLevelMapper.toMap(
      await this.useCase.update(id, payload),
    );
  }

  @Delete(':id')
  @Permissions(['skill-level:delete'])
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number) {
    await this.useCase.remove(id);
  }
}
