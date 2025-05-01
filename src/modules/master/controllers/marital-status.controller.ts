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
  CreateMaritalStatusRequest,
  QueryMaritalStatusRequest,
  UpdateMaritalStatusRequest,
} from '../requests';
import { MaritalStatusUseCase } from '../use-cases';
import { FileMapper, MaritalStatusMapper } from 'src/middlewares/interceptors';
import { Permissions } from 'src/common/decorators';

@ApiTags('Marital Status')
@UseGuards(AccessAuthGuard, PermissionGuard)
@Controller({
  path: 'marital-status',
  version: '1.0',
})
export class MaritalStatusController {
  constructor(
    private readonly maritalStatusMapper: MaritalStatusMapper,
    private readonly fileMapper: FileMapper,
    private readonly useCase: MaritalStatusUseCase,
  ) {}

  @Get()
  @Permissions(['marital-status:view'])
  async findAll(@Query() query: QueryMaritalStatusRequest) { 
    const [datas, meta] = await this.useCase.findAll(query); 

    return await this.maritalStatusMapper.toPaginate(datas, meta);
  }

  @Get(':id')
  @Permissions(['marital-status:view'])
  async findOne(@Param('id') id: number) {
    return await this.maritalStatusMapper.toMap(await this.useCase.findOne(id));
  }

  @Post()
  @Permissions(['marital-status:create'])
  async create(@Body() payload: CreateMaritalStatusRequest) {
    return await this.maritalStatusMapper.toMap(await this.useCase.create(payload));
  }

  @Patch(':id')
  @Permissions(['marital-status:update'])
  async update(@Param('id') id: number, @Body() payload: UpdateMaritalStatusRequest) {
    return await this.maritalStatusMapper.toMap(
      await this.useCase.update(id, payload),
    );
  }

  @Delete(':id')
  @Permissions(['marital-status:delete'])
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number) {
    await this.useCase.remove(id);
  }
}
