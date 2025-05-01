import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AccessAuthGuard, PermissionGuard } from 'src/middlewares/guards';
import { QueryCodeRequest } from '../requests';
import { CodeUseCase } from '../use-cases';
import { CodeMapper } from 'src/middlewares/interceptors';
import { AuthPayload, Permissions } from 'src/common/decorators';
import { ProfileEntity } from 'src/cores/entities';

@ApiTags('Code')
@UseGuards(AccessAuthGuard, PermissionGuard)
@Controller({
  path: 'code',
  version: '1.0',
})
export class CodeController {
  constructor(
    private readonly codeMapper: CodeMapper,
    private readonly useCase: CodeUseCase,
  ) {}

  @Get()
  @Permissions(['code:view'])
  async findAll(@Query() query: QueryCodeRequest) {
    const { type, sortBy } = query;
    const [datas, meta] = await this.useCase.findAll(query, type, sortBy);

    return await this.codeMapper.toPaginate(datas, meta);
  }

  @Get(':type')
  @Permissions(['code:view'])
  async findByType(
    @Param('type') type: string,
    @Query() query: QueryCodeRequest,
    @AuthPayload() profile: ProfileEntity,
  ) {
    query.type = type;
    const [datas, meta] = await this.useCase.findAll(query, type, query.sortBy);

    return await this.codeMapper.toPaginate(datas, meta);
  }
}
