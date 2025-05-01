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
  CreateWorkRequest,
  QueryWorkRequest,
  UpdateWorkRequest,
} from '../requests';
import { WorkUseCase } from '../use-cases';
import { FileMapper, WorkMapper } from 'src/middlewares/interceptors';
import { AuthPayload, Permissions } from 'src/common/decorators';
import { ProfileEntity } from 'src/cores/entities';

@ApiTags('Work')
@UseGuards(AccessAuthGuard, PermissionGuard)
@Controller({
  path: 'work',
  version: '1.0',
})
export class WorkController {
  constructor(
    private readonly workMapper: WorkMapper,
    private readonly fileMapper: FileMapper,
    private readonly useCase: WorkUseCase,
  ) {}

  @Get()
  @Permissions(['work:view'])
  async findAll(
    @Query() query: QueryWorkRequest,
    @AuthPayload() profile: ProfileEntity,
  ) {
    const [datas, meta] = await this.useCase.findAll(query, profile);

    return await this.workMapper.toPaginate(datas, meta);
  }

  @Get(':id')
  @Permissions(['work:view'])
  async findOne(
    @Param('id') id: number,
    @AuthPayload() profile: ProfileEntity,
  ) {
    return await this.workMapper.toMap(
      await this.useCase.findOne(id, profile),
    );
  }

  @Post()
  @Permissions(['work:create'])
  async create(
    @Body() payload: CreateWorkRequest,
    @AuthPayload() profile: ProfileEntity,
  ) {
    return await this.workMapper.toMap(await this.useCase.create(payload, profile));
  }

  @Patch(':id')
  @Permissions(['work:update'])
  async update(
    @Param('id') id: number,
    @Body() payload: UpdateWorkRequest,
    @AuthPayload() profile: ProfileEntity,
  ) {
    return await this.workMapper.toMap(
      await this.useCase.update(id, payload, profile),
    );
  }

  @Delete(':id')
  @Permissions(['work:delete'])
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number, @AuthPayload() profile: ProfileEntity) {
    await this.useCase.remove(id, profile);
  }
}

// import {
//   Body,
//   Controller,
//   Delete,
//   Get,
//   HttpCode,
//   HttpStatus,
//   Param,
//   Patch,
//   Post,
//   Query,
//   UseGuards,
//   UseInterceptors,
// } from '@nestjs/common';
// import { ApiConsumes, ApiTags } from '@nestjs/swagger';
// import { AccessAuthGuard, PermissionGuard} from 'src/middlewares/guards';
// import {
//   CreateWorkRequest,
//   QueryWorkRequest,
//   UpdateWorkRequest,
// } from '../requests';
// import { WorkUseCase } from '../use-cases';
// import { FileMapper, WorkMapper } from 'src/middlewares/interceptors';
// import { Permissions } from 'src/common/decorators';

// @ApiTags('Work')
// @UseGuards(AccessAuthGuard, PermissionGuard)
// @Controller({
//   path: 'work',
//   version: '1.0',
// })
// export class WorkController {
//   constructor(
//     private readonly workMapper: WorkMapper,
//     private readonly fileMapper: FileMapper,
//     private readonly useCase: WorkUseCase,
//   ) {}

//   @Get()
//   @Permissions(['work:view'])
//   async findAll(@Query() query: QueryWorkRequest) { 
//     const [datas, meta] = await this.useCase.findAll(query); 

//     return await this.workMapper.toPaginate(datas, meta);
//   }

//   @Get(':id')
//   @Permissions(['work:view'])
//   async findOne(@Param('id') id: number) {
//     return await this.workMapper.toMap(await this.useCase.findOne(id));
//   }

//   @Post()
//   @Permissions(['work:create'])
//   async create(@Body() payload: CreateWorkRequest) {
//     return await this.workMapper.toMap(await this.useCase.create(payload));
//   }

//   @Patch(':id')
//   @Permissions(['work:update'])
//   async update(@Param('id') id: number, @Body() payload: UpdateWorkRequest) {
//     return await this.workMapper.toMap(
//       await this.useCase.update(id, payload),
//     );
//   }

//   @Delete(':id')
//   @Permissions(['work:delete'])
//   @HttpCode(HttpStatus.NO_CONTENT)
//   async remove(@Param('id') id: number) {
//     await this.useCase.remove(id);
//   }
// }
