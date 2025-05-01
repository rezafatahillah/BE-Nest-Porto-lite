import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MultipleUploadRequest, UploadRequest } from '../requests';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AccessAuthGuard } from 'src/middlewares/guards';
import { UploadUseCase } from '../use-cases';
import { MultipartInterceptor } from 'src/infrastructures/storage/interceptors';
import { Files } from 'src/infrastructures/storage/decorators';

@ApiTags('Storage')
@UseGuards(AccessAuthGuard)
@Controller({
  path: 'storages',
  version: '1.0',
})
export class StorageController {
  constructor(private readonly uploadUseCase: UploadUseCase) {}

  @Post('uploads')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(MultipartInterceptor({ maxFileSize: 1000_000 }))
  async upload(
    @Body() uploadRequest: UploadRequest,
    @Files() files: Record<string, S3.MultipartFile[]>,
  ) {
    const [file] = files.file;

    return await this.uploadUseCase.upload(uploadRequest, file);
  }

  @Post('uploads/multiple')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(MultipartInterceptor({ maxFileSize: 1000_000 }))
  async uploadMultiple(
    @Body() uploadRequest: MultipleUploadRequest,
    @Files() files: Record<string, S3.MultipartFile[]>,
  ) {
    return await this.uploadUseCase.uploadMultiple(uploadRequest, files.files);
  }

  @Delete(':id')
  async deleteFile(@Param('id') id: number) {
    return await this.uploadUseCase.delete(id);
  }
}
