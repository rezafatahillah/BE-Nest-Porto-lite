import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthPayload, Permissions } from 'src/common/decorators';
import { ProfileEntity } from 'src/cores/entities';
import { AccessAuthGuard, PermissionGuard } from 'src/middlewares/guards';
import {
  UpdatePasswordRequest,
  UpdateProfileRequest,
  UpdateUsernameRequest,
} from '../requests';
import { MultipartInterceptor } from 'src/infrastructures/storage/interceptors';
import { Files } from 'src/infrastructures/storage/decorators';
import { IQueueServiceProvider } from 'src/cores/contracts';
import { QueueMailerProcessor } from 'src/cores/consts';
import {
  ProfilePasswordUseCase,
  ProfilePictureUseCase,
  ProfileUseCase,
  ProfileUsernameUseCase,
} from '../use-cases';

@ApiTags('Profile')
@UseGuards(AccessAuthGuard, PermissionGuard)
@Controller({
  path: 'profile',
  version: '1.0',
})
export class ProfileController {
  constructor(
    private readonly profileUseCase: ProfileUseCase,
    private readonly profilePictureUseCase: ProfilePictureUseCase,
    private readonly profileUsernameUseCase: ProfileUsernameUseCase,
    private readonly profilePasswordUseCase: ProfilePasswordUseCase,
    private readonly queueServiceProvider: IQueueServiceProvider,
  ) {}

  @Get()
  @Permissions(['profile:view'])
  async profile(@AuthPayload() profile: ProfileEntity) {
    return {
      data: profile,
    };
  }

  @Patch('update/profile')
  @Permissions(['profile:update'])
  async updateProfile(
    @Body() payload: UpdateProfileRequest,
    @AuthPayload() profile: ProfileEntity,
  ) {
    return await this.profileUseCase.update(profile, payload);
  }

  @Patch('update/picture')
  @Permissions(['profile:update'])
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(MultipartInterceptor({ maxFileSize: 1000_000 }))
  async updatePicture(
    @Files() files: Record<string, S3.MultipartFile[]>,
    @AuthPayload() profile: ProfileEntity,
  ) {
    const [file] = files.file;
    const updated = await this.profilePictureUseCase.updatePicture(
      profile,
      file,
    );

    return { data: updated };
  }

  @Patch('update/username')
  @Permissions(['profile:update-username'])
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateUsername(
    @Body() payload: UpdateUsernameRequest,
    @AuthPayload() profile: ProfileEntity,
  ) {
    await this.profileUsernameUseCase.updateUsername(profile, payload);
  }

  @Patch('update/password')
  @Permissions(['profile:update-password'])
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePassword(
    @Body() payload: UpdatePasswordRequest,
    @AuthPayload() profile: ProfileEntity,
  ) {
    await this.profilePasswordUseCase.updatePassword(profile, payload);
  }

  @Delete('destroy')
  @Permissions(['profile:delete'])
  @HttpCode(HttpStatus.NO_CONTENT)
  async destroy(@AuthPayload() profile: ProfileEntity) {
    await this.profileUseCase.destroy(profile);

    await this.queueServiceProvider.mailer.add(QueueMailerProcessor.SendEmail, {
      to: profile.email,
      template: 'account-destroy',
    });
  }
}
