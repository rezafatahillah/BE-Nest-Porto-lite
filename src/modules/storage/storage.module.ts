import { Module } from '@nestjs/common';
import { StorageController } from './controllers/storage.controller';
import { UploadUseCase } from './use-cases';

@Module({
  controllers: [StorageController],
  providers: [UploadUseCase],
})
export class StorageModule {}
