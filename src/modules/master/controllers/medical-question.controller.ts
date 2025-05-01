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
  CreateMedicalQuestionRequest,
  QueryMedicalQuestionRequest,
  QueryMedicalQuestionCustomRequest,
  UpdateMedicalQuestionRequest,
} from '../requests';
import { MedicalQuestionUseCase } from '../use-cases';
import { FileMapper, MedicalQuestionMapper } from 'src/middlewares/interceptors';
import { Permissions } from 'src/common/decorators';

@ApiTags('Medical Question')
@UseGuards(AccessAuthGuard, PermissionGuard)
@Controller({
  path: 'medical-question',
  version: '1.0',
})
export class MedicalQuestionController {
  constructor(
    private readonly medicalQuestionMapper: MedicalQuestionMapper,
    private readonly fileMapper: FileMapper,
    private readonly useCase: MedicalQuestionUseCase,
  ) {}

  @Get()
  @Permissions(['medical-question:view'])
  async findAll(@Query() query: QueryMedicalQuestionRequest) { 
    const [datas, meta] = await this.useCase.findAll(query); 

    return await this.medicalQuestionMapper.toPaginate(datas, meta);
  }

  @Get('custom')
  @Permissions(['medical-question:view'])
  async findAllCustom(@Query() query: QueryMedicalQuestionCustomRequest) {
    const [datas, meta] = await this.useCase.findAllCustom(query);

    return await this.medicalQuestionMapper.toPaginate(datas, meta);
  }

  @Get(':id')
  @Permissions(['medical-question:view'])
  async findOne(@Param('id') id: number) {
    return await this.medicalQuestionMapper.toMap(await this.useCase.findOne(id));
  }

  @Post()
  @Permissions(['medical-question:create'])
  async create(@Body() payload: CreateMedicalQuestionRequest) {
    return await this.medicalQuestionMapper.toMap(await this.useCase.create(payload));
  }

  @Patch(':id')
  @Permissions(['medical-question:update'])
  async update(@Param('id') id: number, @Body() payload: UpdateMedicalQuestionRequest) {
    return await this.medicalQuestionMapper.toMap(
      await this.useCase.update(id, payload),
    );
  }

  @Delete(':id')
  @Permissions(['medical-question:delete'])
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number) {
    await this.useCase.remove(id);
  }
}
