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
  CreateJobFieldRequest,
  QueryJobFieldRequest,
  UpdateJobFieldRequest,
} from '../requests';
import { JobFieldUseCase } from '../use-cases';
import { FileMapper, JobFieldMapper } from 'src/middlewares/interceptors';
import { Permissions } from 'src/common/decorators';

@ApiTags('Job Field')
@UseGuards(AccessAuthGuard, PermissionGuard)
@Controller({
  path: 'job-field',
  version: '1.0',
})
export class JobFieldController {
  constructor(
    private readonly jobFieldMapper: JobFieldMapper,
    private readonly fileMapper: FileMapper,
    private readonly useCase: JobFieldUseCase,
  ) {}

  @Get()
  @Permissions(['job-field:view'])
  async findAll(@Query() query: QueryJobFieldRequest) { 
    const [datas, meta] = await this.useCase.findAll(query); 

    return await this.jobFieldMapper.toPaginate(datas, meta);
  }

  @Get(':id')
  @Permissions(['job-field:view'])
  async findOne(@Param('id') id: number) {
    return await this.jobFieldMapper.toMap(await this.useCase.findOne(id));
  }

  @Post()
  @Permissions(['job-field:create'])
  async create(@Body() payload: CreateJobFieldRequest) {
    return await this.jobFieldMapper.toMap(await this.useCase.create(payload));
  }

  @Patch(':id')
  @Permissions(['job-field:update'])
  async update(@Param('id') id: number, @Body() payload: UpdateJobFieldRequest) {
    return await this.jobFieldMapper.toMap(
      await this.useCase.update(id, payload),
    );
  }

  @Delete(':id')
  @Permissions(['job-field:delete'])
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number) {
    await this.useCase.remove(id);
  }
}
