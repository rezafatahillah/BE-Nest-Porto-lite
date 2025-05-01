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
  CreateJobTypeRequest,
  QueryJobTypeRequest,
  UpdateJobTypeRequest,
} from '../requests';
import { JobTypeUseCase } from '../use-cases';
import { FileMapper, JobTypeMapper } from 'src/middlewares/interceptors';
import { Permissions } from 'src/common/decorators';

@ApiTags('Job Type')
@UseGuards(AccessAuthGuard, PermissionGuard)
@Controller({
  path: 'job-type',
  version: '1.0',
})
export class JobTypeController {
  constructor(
    private readonly jobTypeMapper: JobTypeMapper,
    private readonly fileMapper: FileMapper,
    private readonly useCase: JobTypeUseCase,
  ) {}

  @Get()
  @Permissions(['job-type:view'])
  async findAll(@Query() query: QueryJobTypeRequest) { 
    const [datas, meta] = await this.useCase.findAll(query); 

    return await this.jobTypeMapper.toPaginate(datas, meta);
  }

  @Get(':id')
  @Permissions(['job-type:view'])
  async findOne(@Param('id') id: number) {
    return await this.jobTypeMapper.toMap(await this.useCase.findOne(id));
  }

  @Post()
  @Permissions(['job-type:create'])
  async create(@Body() payload: CreateJobTypeRequest) {
    return await this.jobTypeMapper.toMap(await this.useCase.create(payload));
  }

  @Patch(':id')
  @Permissions(['job-type:update'])
  async update(@Param('id') id: number, @Body() payload: UpdateJobTypeRequest) {
    return await this.jobTypeMapper.toMap(
      await this.useCase.update(id, payload),
    );
  }

  @Delete(':id')
  @Permissions(['job-type:delete'])
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number) {
    await this.useCase.remove(id);
  }
}
