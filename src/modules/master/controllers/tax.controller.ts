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
  CreateTaxRequest,
  QueryTaxRequest,
  UpdateTaxRequest,
} from '../requests';
import { TaxUseCase } from '../use-cases';
import { FileMapper, TaxMapper } from 'src/middlewares/interceptors';
import { Permissions } from 'src/common/decorators';

@ApiTags('Tax')
@UseGuards(AccessAuthGuard, PermissionGuard)
@Controller({
  path: 'tax',
  version: '1.0',
})
export class TaxController {
  constructor(
    private readonly taxMapper: TaxMapper,
    private readonly fileMapper: FileMapper,
    private readonly useCase: TaxUseCase,
  ) {}

  @Get()
  @Permissions(['tax:view'])
  async findAll(@Query() query: QueryTaxRequest) { 
    const [datas, meta] = await this.useCase.findAll(query); 

    return await this.taxMapper.toPaginate(datas, meta);
  }

  @Get(':id')
  @Permissions(['tax:view'])
  async findOne(@Param('id') id: number) {
    return await this.taxMapper.toMap(await this.useCase.findOne(id));
  }

  @Post()
  @Permissions(['tax:create'])
  async create(@Body() payload: CreateTaxRequest) {
    return await this.taxMapper.toMap(await this.useCase.create(payload));
  }

  @Patch(':id')
  @Permissions(['tax:update'])
  async update(@Param('id') id: number, @Body() payload: UpdateTaxRequest) {
    return await this.taxMapper.toMap(
      await this.useCase.update(id, payload),
    );
  }

  @Delete(':id')
  @Permissions(['tax:delete'])
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number) {
    await this.useCase.remove(id);
  }
}
