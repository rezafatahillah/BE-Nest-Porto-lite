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
  CreateMedicalRequest,
  CreateMultipleMedicalRequest,
  QueryMedicalRequest,
  QueryMedicalCustomRequest,
  UpdateMedicalRequest,
  UpdateMultipleMedicalRequest,
} from '../requests';
import { MedicalUseCase } from '../use-cases';
import { FileMapper, MedicalMapper } from 'src/middlewares/interceptors';
import { AuthPayload, Permissions } from 'src/common/decorators';
import { ProfileEntity } from 'src/cores/entities';

@ApiTags('Medical')
@UseGuards(AccessAuthGuard, PermissionGuard)
@Controller({
  path: 'medical',
  version: '1.0',
})
export class MedicalController {
  constructor(
    private readonly medicalMapper: MedicalMapper,
    private readonly fileMapper: FileMapper,
    private readonly useCase: MedicalUseCase,
  ) {}

  @Get()
  @Permissions(['medical-question:view'])
  async findAll(
    @Query() query: QueryMedicalRequest,
    @AuthPayload() profile: ProfileEntity,
  ) {
    const [datas, meta] = await this.useCase.findAll(query, profile);

    return await this.medicalMapper.toPaginate(datas, meta);
  }

  @Get('custom')
  @Permissions(['medical-question:view'])
  async findAllCustom(
    @Query() query: QueryMedicalCustomRequest,
    @AuthPayload() profile: ProfileEntity,
  ) {
    const [datas, meta] = await this.useCase.findAllCustom(query, profile);

    return await this.medicalMapper.toPaginate(datas, meta);
  }

  @Get(':id')
  @Permissions(['medical-question:view'])
  async findOne(
    @Param('id') id: number,
    @AuthPayload() profile: ProfileEntity,
  ) {
    return await this.medicalMapper.toMap(
      await this.useCase.findOne(id, profile),
    );
  }

  @Post()
  @Permissions(['medical-question:create'])
  async create(
    @Body() payload: CreateMedicalRequest,
    @AuthPayload() profile: ProfileEntity,
  ) {
    return await this.medicalMapper.toMap(
      await this.useCase.create(payload, profile),
    );
  }

  @Post('multiple')
  @Permissions(['medical-question:create'])
  async createMultiple(
    @Body() payload: CreateMultipleMedicalRequest,
    @AuthPayload() profile: ProfileEntity,
  ) {
    const results = await this.useCase.createMultiple(payload, profile);

    return await this.medicalMapper.toMapArray(results);
  }

  @Patch('multiple')
  @Permissions(['medical-question:update'])
  async updateMultiple(
    @Body() payload: UpdateMultipleMedicalRequest,
    @AuthPayload() profile: ProfileEntity,
  ) {
    const results = await this.useCase.updateMultiple(payload, profile);

    return await this.medicalMapper.toMapArray(results);
  }

  @Patch(':id')
  @Permissions(['medical-question:update'])
  async update(
    @Param('id') id: number,
    @Body() payload: UpdateMedicalRequest,
    @AuthPayload() profile: ProfileEntity,
  ) {
    return await this.medicalMapper.toMap(
      await this.useCase.update(id, payload, profile),
    );
  }

  @Delete(':id')
  @Permissions(['medical-question:delete'])
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number, @AuthPayload() profile: ProfileEntity) {
    await this.useCase.remove(id, profile);
  }
}
