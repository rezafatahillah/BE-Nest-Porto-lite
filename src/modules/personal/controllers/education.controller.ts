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
  CreateEducationRequest,
  CreateMultipleEducationRequest,
  QueryEducationRequest,
  UpdateEducationRequest,
  UpdateMultipleEducationRequest,
} from '../requests';
import { EducationUseCase } from '../use-cases';
import { FileMapper, EducationMapper } from 'src/middlewares/interceptors';
import { AuthPayload, Permissions } from 'src/common/decorators';
import { ProfileEntity } from 'src/cores/entities';

@ApiTags('Education')
@UseGuards(AccessAuthGuard, PermissionGuard)
@Controller({
  path: 'education',
  version: '1.0',
})
export class EducationController {
  constructor(
    private readonly educationMapper: EducationMapper,
    private readonly fileMapper: FileMapper,
    private readonly useCase: EducationUseCase,
  ) {}

  @Get()
  @Permissions(['education:view'])
  async findAll(
    @Query() query: QueryEducationRequest,
    @AuthPayload() profile: ProfileEntity,
  ) {
    const [datas, meta] = await this.useCase.findAll(query, profile);

    return await this.educationMapper.toPaginate(datas, meta);
  }

  @Get(':id')
  @Permissions(['education:view'])
  async findOne(
    @Param('id') id: number,
    @AuthPayload() profile: ProfileEntity,
  ) {
    return await this.educationMapper.toMap(
      await this.useCase.findOne(id, profile),
    );
  }

  @Post()
  @Permissions(['education:create'])
  async create(
    @Body() payload: CreateEducationRequest,
    @AuthPayload() profile: ProfileEntity,
  ) {
    return await this.educationMapper.toMap(
      await this.useCase.create(payload, profile),
    );
  }

  @Post('multiple')
  @Permissions(['education:create'])
  async createMultiple(
    @Body() payload: CreateMultipleEducationRequest,
    @AuthPayload() profile: ProfileEntity,
  ) {
    const results = await this.useCase.createMultiple(payload, profile);

    return await this.educationMapper.toMapArray(results);
  }

  @Patch('multiple')
    @Permissions(['education:update'])
    async updateMultiple(
      @Body() payload: UpdateMultipleEducationRequest,
      @AuthPayload() profile: ProfileEntity,
    ) {
      const results = await this.useCase.updateMultiple(payload, profile);
  
      return await this.educationMapper.toMapArray(results);
    }

  @Patch(':id')
  @Permissions(['education:update'])
  async update(
    @Param('id') id: number,
    @Body() payload: UpdateEducationRequest,
    @AuthPayload() profile: ProfileEntity,
  ) {
    return await this.educationMapper.toMap(
      await this.useCase.update(id, payload, profile),
    );
  }

  @Delete(':id')
  @Permissions(['education:delete'])
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number, @AuthPayload() profile: ProfileEntity) {
    await this.useCase.remove(id, profile);
  }
}
