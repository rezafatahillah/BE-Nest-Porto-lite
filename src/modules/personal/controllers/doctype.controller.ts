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
  CreateDoctypeRequest,
  CreateMultipleDoctypeRequest,
  QueryDoctypeRequest,
  UpdateDoctypeRequest,
  UpdateMultipleDoctypeRequest,
} from '../requests';
import { MultipartInterceptor } from 'src/infrastructures/storage/interceptors';
import { Files } from 'src/infrastructures/storage/decorators';
import { DoctypeUseCase, DoctypeFileUseCase } from '../use-cases';
import { FileMapper, DoctypeMapper } from 'src/middlewares/interceptors';
import { AuthPayload, Permissions } from 'src/common/decorators';
import { ProfileEntity } from 'src/cores/entities';

@ApiTags('Doctype')
@UseGuards(AccessAuthGuard, PermissionGuard)
@Controller({
  path: 'doctype',
  version: '1.0',
})
export class DoctypeController {
  constructor(
    private readonly doctypeMapper: DoctypeMapper,
    private readonly fileMapper: FileMapper,
    private readonly doctypeUseCase : DoctypeUseCase,
    private readonly doctypeFileUseCase : DoctypeFileUseCase,
  ) {}

  @Get()
  @Permissions(['doctype:view'])
  async findAll(
    @Query() query: QueryDoctypeRequest,
    @AuthPayload() profile: ProfileEntity,
  ) {
    const [datas, meta] = await this.doctypeUseCase.findAll(query, profile);

    return await this.doctypeMapper.toPaginate(datas, meta);
  }

  @Get(':id')
  @Permissions(['doctype:view'])
  async findOne(
    @Param('id') id: number,
    @AuthPayload() profile: ProfileEntity,
  ) {
    return await this.doctypeMapper.toMap(
      await this.doctypeUseCase.findOne(id, profile),
    );
  }

  @Post()
  @Permissions(['doctype:create'])
  async create(
    @Body() payload: CreateDoctypeRequest,
    @AuthPayload() profile: ProfileEntity,
  ) {
    return await this.doctypeMapper.toMap(await this.doctypeUseCase.create(payload, profile));
  }

  @Patch(':id')
  @Permissions(['doctype:update'])
  async update(
    @Param('id') id: number,
    @Body() payload: UpdateDoctypeRequest,
    @AuthPayload() profile: ProfileEntity,
  ) {
    return await this.doctypeMapper.toMap(
      await this.doctypeUseCase.update(id, payload, profile),
    );
  }

  @Post('multiple')
  @Permissions(['family:create'])
  async createMultiple(
    @Body() payload: CreateMultipleDoctypeRequest,
    @AuthPayload() profile: ProfileEntity,
  ) {
    const results = await this.doctypeUseCase.createMultiple(payload, profile);

    return await this.doctypeMapper.toMapArray(results);
  }

  @Patch('multiple')
  @Permissions(['doctype:update'])
  async updateMultiple(
    @Body() payload: UpdateMultipleDoctypeRequest,
    @AuthPayload() profile: ProfileEntity,
  ) {
    const results = await this.doctypeUseCase.updateMultiple(payload, profile);

    return await this.doctypeMapper.toMapArray(results);
  }

  @Patch(':id/file')
  @Permissions(['doctype:update'])
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(MultipartInterceptor({ maxFileSize: 1000_000 }))
  async updateFile(
    @Param('id') id: number,
    @Files() files: Record<string, S3.MultipartFile[]>,
    @AuthPayload() profile: ProfileEntity,
  ) {
    const [file] = files.file;
    const updated = await this.doctypeFileUseCase.updateFile(id, file, profile);

    return await this.fileMapper.toMap(updated);
  }

  @Delete(':id')
  @Permissions(['doctype:delete'])
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number, @AuthPayload() profile: ProfileEntity) {
    await this.doctypeUseCase.remove(id, profile);
  }
}
