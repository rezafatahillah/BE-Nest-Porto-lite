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
  CreateCandidateRequest,
  QueryCandidateRequest,
  UpdateCandidateRequest,
} from '../requests';
import { CandidateUseCase, CandidatePictureUseCase } from '../use-cases';
import { FileMapper, CandidateMapper } from 'src/middlewares/interceptors';
import { AuthPayload, Permissions } from 'src/common/decorators';
import { ProfileEntity } from 'src/cores/entities';
import { MultipartInterceptor } from 'src/infrastructures/storage/interceptors';
import { Files } from 'src/infrastructures/storage/decorators';

@ApiTags('Candidate')
@UseGuards(AccessAuthGuard, PermissionGuard)
@Controller({
  path: 'candidate',
  version: '1.0',
})
export class CandidateController {
  constructor(
    private readonly candidateMapper: CandidateMapper,
    private readonly fileMapper: FileMapper,
    private readonly useCase: CandidateUseCase,
    private readonly candidatePictureUseCase: CandidatePictureUseCase,
  ) {}

  @Get()
  @Permissions(['candidate:view'])
  async findAll(
    @Query() query: QueryCandidateRequest,
    @AuthPayload() profile: ProfileEntity,
  ) {
    const [datas, meta] = await this.useCase.findAll(query, profile);

    return await this.candidateMapper.toPaginate(datas, meta);
  }

  @Get(':id')
  @Permissions(['candidate:view'])
  async findOne(
    @Param('id') id: string,
    @AuthPayload() profile: ProfileEntity,
  ) {
    return await this.candidateMapper.toMap(
      await this.useCase.findOne(id, profile),
    );
  }

  @Post()
  @Permissions(['candidate:create'])
  async create(
    @Body() payload: CreateCandidateRequest,
    @AuthPayload() profile: ProfileEntity,
  ) {
    return await this.candidateMapper.toMap(
      await this.useCase.create(payload, profile),
    );
  }

  @Patch('update/picture')
  @Permissions(['candidate:update'])
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(MultipartInterceptor({ maxFileSize: 1000_000 }))
  async updatePicture(
    @Files() files: Record<string, S3.MultipartFile[]>,
    @AuthPayload() profile: ProfileEntity,
  ) {

    // console.log("TEST")
    const [file] = files.file;
    const updated = await this.candidatePictureUseCase.updatePicture(
      profile,
      file,
    );

    return await this.fileMapper.toMap(updated);
    
  }

  @Patch(':id')
  @Permissions(['candidate:update'])
  async update(
    @Param('id') id: string,
    @Body() payload: UpdateCandidateRequest,
    @AuthPayload() profile: ProfileEntity,
  ) {
    return await this.candidateMapper.toMap(
      await this.useCase.update(id, payload, profile),
    );
  }

  @Delete(':id')
  @Permissions(['candidate:delete'])
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @AuthPayload() profile: ProfileEntity) {
    await this.useCase.remove(id, profile);
  }
}
