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
  CreateReligionRequest,
  QueryReligionRequest,
  UpdateReligionRequest,
} from '../requests';
import { ReligionUseCase } from '../use-cases';
import { FileMapper, ReligionMapper } from 'src/middlewares/interceptors';
import { Permissions } from 'src/common/decorators';

@ApiTags('Religion')
@UseGuards(AccessAuthGuard, PermissionGuard)
@Controller({
  path: 'religion',
  version: '1.0',
})
export class ReligionController {
  constructor(
    private readonly religionMapper: ReligionMapper,
    private readonly fileMapper: FileMapper,
    private readonly useCase: ReligionUseCase,
  ) {}

  @Get()
  @Permissions(['religion:view'])
  async findAll(@Query() query: QueryReligionRequest) { 
    const [datas, meta] = await this.useCase.findAll(query); 

    return await this.religionMapper.toPaginate(datas, meta);
  }

  @Get(':id')
  @Permissions(['religion:view'])
  async findOne(@Param('id') id: number) {
    return await this.religionMapper.toMap(await this.useCase.findOne(id));
  }

  @Post()
  @Permissions(['religion:create'])
  async create(@Body() payload: CreateReligionRequest) {
    return await this.religionMapper.toMap(await this.useCase.create(payload));
  }

  @Patch(':id')
  @Permissions(['religion:update'])
  async update(@Param('id') id: number, @Body() payload: UpdateReligionRequest) {
    return await this.religionMapper.toMap(
      await this.useCase.update(id, payload),
    );
  }

  @Delete(':id')
  @Permissions(['religion:delete'])
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number) {
    await this.useCase.remove(id);
  }
}
