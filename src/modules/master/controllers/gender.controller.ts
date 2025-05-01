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
  CreateGenderRequest,
  QueryGenderRequest,
  UpdateGenderRequest,
} from '../requests';
import { GenderUseCase } from '../use-cases';
import { FileMapper, GenderMapper } from 'src/middlewares/interceptors';
import { Permissions } from 'src/common/decorators';

@ApiTags('Gender')
@UseGuards(AccessAuthGuard, PermissionGuard)
@Controller({
  path: 'gender',
  version: '1.0',
})
export class GenderController {
  constructor(
    private readonly genderMapper: GenderMapper,
    private readonly fileMapper: FileMapper,
    private readonly useCase: GenderUseCase,
  ) {}

  @Get()
  @Permissions(['gender:view'])
  async findAll(@Query() query: QueryGenderRequest) { 
    const [datas, meta] = await this.useCase.findAll(query); 

    return await this.genderMapper.toPaginate(datas, meta);
  }

  @Get(':id')
  @Permissions(['gender:view'])
  async findOne(@Param('id') id: number) {
    return await this.genderMapper.toMap(await this.useCase.findOne(id));
  }

  @Post()
  @Permissions(['gender:create'])
  async create(@Body() payload: CreateGenderRequest) {
    return await this.genderMapper.toMap(await this.useCase.create(payload));
  }

  @Patch(':id')
  @Permissions(['gender:update'])
  async update(@Param('id') id: number, @Body() payload: UpdateGenderRequest) {
    return await this.genderMapper.toMap(
      await this.useCase.update(id, payload),
    );
  }

  @Delete(':id')
  @Permissions(['gender:delete'])
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number) {
    await this.useCase.remove(id);
  }
}
