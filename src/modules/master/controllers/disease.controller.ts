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
  CreateDiseaseRequest,
  QueryDiseaseRequest,
  QueryDiseaseCustomRequest,
  UpdateDiseaseRequest,
} from '../requests';
import { DiseaseUseCase } from '../use-cases';
import { FileMapper, DiseaseMapper } from 'src/middlewares/interceptors';
import { Permissions } from 'src/common/decorators';

@ApiTags('Disease')
@UseGuards(AccessAuthGuard, PermissionGuard)
@Controller({
  path: 'disease',
  version: '1.0',
})
export class DiseaseController {
  constructor(
    private readonly diseaseMapper: DiseaseMapper,
    private readonly fileMapper: FileMapper,
    private readonly useCase: DiseaseUseCase,
  ) {}

  @Get()
  @Permissions(['disease:view'])
  async findAll(@Query() query: QueryDiseaseRequest) {
    const [datas, meta] = await this.useCase.findAll(query);

    return await this.diseaseMapper.toPaginate(datas, meta);
  }

  @Get('custom')
  @Permissions(['disease:view'])
  async findAllCustom(@Query() query: QueryDiseaseCustomRequest) {
    const [datas, meta] = await this.useCase.findAllCustom(query);

    return await this.diseaseMapper.toPaginate(datas, meta);
  }

  @Get(':id')
  @Permissions(['disease:view'])
  async findOne(@Param('id') id: number) {
    return await this.diseaseMapper.toMap(await this.useCase.findOne(id));
  }

  @Post()
  @Permissions(['disease:create'])
  async create(@Body() payload: CreateDiseaseRequest) {
    return await this.diseaseMapper.toMap(await this.useCase.create(payload));
  }

  @Patch(':id')
  @Permissions(['disease:update'])
  async update(@Param('id') id: number, @Body() payload: UpdateDiseaseRequest) {
    return await this.diseaseMapper.toMap(
      await this.useCase.update(id, payload),
    );
  }

  @Delete(':id')
  @Permissions(['disease:delete'])
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number) {
    await this.useCase.remove(id);
  }
}
