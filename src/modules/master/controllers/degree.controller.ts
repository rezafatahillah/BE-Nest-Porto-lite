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
  CreateDegreeRequest,
  QueryDegreeRequest,
  UpdateDegreeRequest,
} from '../requests';
import { DegreeUseCase } from '../use-cases';
import { FileMapper, DegreeMapper } from 'src/middlewares/interceptors';
import { Permissions } from 'src/common/decorators';

@ApiTags('Degree')
@UseGuards(AccessAuthGuard, PermissionGuard)
@Controller({
  path: 'degree',
  version: '1.0',
})
export class DegreeController {
  constructor(
    private readonly degreeMapper: DegreeMapper,
    private readonly fileMapper: FileMapper,
    private readonly useCase: DegreeUseCase,
  ) {}

  @Get()
  @Permissions(['degree:view'])
  async findAll(@Query() query: QueryDegreeRequest) { 
    const [datas, meta] = await this.useCase.findAll(query); 

    return await this.degreeMapper.toPaginate(datas, meta);
  }

  @Get(':id')
  @Permissions(['degree:view'])
  async findOne(@Param('id') id: number) {
    return await this.degreeMapper.toMap(await this.useCase.findOne(id));
  }

  @Post()
  @Permissions(['degree:create'])
  async create(@Body() payload: CreateDegreeRequest) {
    return await this.degreeMapper.toMap(await this.useCase.create(payload));
  }

  @Patch(':id')
  @Permissions(['degree:update'])
  async update(@Param('id') id: number, @Body() payload: UpdateDegreeRequest) {
    return await this.degreeMapper.toMap(
      await this.useCase.update(id, payload),
    );
  }

  @Delete(':id')
  @Permissions(['degree:delete'])
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number) {
    await this.useCase.remove(id);
  }
}
