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
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AccessAuthGuard, PermissionGuard } from 'src/middlewares/guards';
import {
  CreateAccountRequest,
  QueryUserRequest,
  UpdateAccountAccessRequest,
  UpdateAccountPasswordRequest,
  UpdateAccountRequest,
} from '../requests';
import {
  AccountAccessUseCase,
  AccountCredentialUseCase,
  AccountStatusUseCase,
  AccountUseCase,
} from '../use-cases';
import { AccountMapper } from 'src/middlewares/interceptors';
import { IQueueServiceProvider } from 'src/cores/contracts';
import { QueueMailerProcessor } from 'src/cores/consts';
import { FastifyRequest } from 'fastify';
import { AuthPayload, Permissions } from 'src/common/decorators';
import { ProfileEntity } from 'src/cores/entities';
import { AccountStatus } from 'src/cores/enums';

@ApiTags('Account')
@UseGuards(AccessAuthGuard, PermissionGuard)
@Controller({
  path: 'accounts',
  version: '1.0',
})
export class AccountController {
  constructor(
    private readonly accountMapper: AccountMapper,
    private readonly accountUseCase: AccountUseCase,
    private readonly accountCredentialUseCase: AccountCredentialUseCase,
    private readonly accountStatusUseCase: AccountStatusUseCase,
    private readonly accountAccessUseCase: AccountAccessUseCase,
    private readonly queueServiceProvider: IQueueServiceProvider,
  ) {}

  @Get()
  @Permissions(['account:view'])
  async findAll(
    @Query() query: QueryUserRequest,
    @AuthPayload() profile: ProfileEntity,
  ) {
    const [accounts, meta] = await this.accountUseCase.findAll(query, profile);

    return await this.accountMapper.toPaginate(accounts, meta);
  }

  @Get(':id')
  @Permissions(['account:view'])
  async findOne(@Param('id') id: string) {
    const account = await this.accountUseCase.findOne(id);

    return await this.accountMapper.toResource(account);
  }

  @Post()
  @Permissions(['account:create'])
  @HttpCode(HttpStatus.NO_CONTENT)
  async create(
    @Req() request: FastifyRequest,
    @Body() payload: CreateAccountRequest,
  ) {
    const { account, credential } = await this.accountUseCase.create(payload);

    await this.queueServiceProvider.mailer.add(QueueMailerProcessor.SendEmail, {
      to: credential.username,
      template: 'account-credential',
      context: {
        credential: credential,
        link: request.headers.origin,
      },
    });

    return await this.accountMapper.toMap(account);
  }

  @Patch(':id')
  @Permissions(['account:update'])
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(@Param('id') id: string, @Body() payload: UpdateAccountRequest) {
    return await this.accountUseCase.update(id, payload);
  }

  @Patch(':id/username')
  @Permissions(['account:update-username'])
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateUsername(
    @Param('id') id: string,
    @Body() payload: UpdateAccountRequest,
  ) {
    const account = await this.accountCredentialUseCase.updateUsername(
      id,
      payload,
    );

    await this.queueServiceProvider.mailer.add(QueueMailerProcessor.SendEmail, {
      to: account.before,
      template: 'account-username',
      context: {
        username: account.after,
      },
    });
  }

  @Patch(':id/password/reset')
  @Permissions(['account:update-password'])
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateResetPassword(
    @Req() request: FastifyRequest,
    @Param('id') id: string,
  ) {
    const account = await this.accountCredentialUseCase.resetPassword(id);

    await this.queueServiceProvider.mailer.add(QueueMailerProcessor.SendEmail, {
      to: account.credential.username,
      template: 'account-credential',
      context: {
        credential: account.credential,
        link: request.headers.origin,
      },
    });
  }

  @Patch(':id/password')
  @Permissions(['account:update-password'])
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePassword(
    @Req() request: FastifyRequest,
    @Param('id') id: string,
    @Body() payload: UpdateAccountPasswordRequest,
  ) {
    const account = await this.accountCredentialUseCase.updatePassword(
      id,
      payload,
    );

    await this.queueServiceProvider.mailer.add(QueueMailerProcessor.SendEmail, {
      to: account.credential.username,
      template: 'account-credential',
      context: {
        credential: account.credential,
        link: request.headers.origin,
      },
    });
  }

  @Patch(':id/access')
  @Permissions(['account:access-control'])
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateAccess(
    @Param('id') id: string,
    @Body() payload: UpdateAccountAccessRequest,
  ) {
    await this.accountAccessUseCase.access(id, payload);
  }

  @Patch(':id/disable')
  @Permissions(['account:update-status'])
  @HttpCode(HttpStatus.NO_CONTENT)
  async disable(@Param('id') id: string) {
    const account = await this.accountStatusUseCase.disable(id);

    await this.queueServiceProvider.mailer.add(QueueMailerProcessor.SendEmail, {
      to: account.username,
      template: 'account-disable',
    });
  }

  @Patch(':id/enable')
  @Permissions(['account:update-status'])
  @HttpCode(HttpStatus.NO_CONTENT)
  async enable(@Param('id') id: string) {
    const account = await this.accountStatusUseCase.enable(id);

    await this.queueServiceProvider.mailer.add(QueueMailerProcessor.SendEmail, {
      to: account.username,
      template: 'account-enable',
    });
  }

  @Patch(':id/status')
  @Permissions(['account:update-status'])
  @HttpCode(HttpStatus.NO_CONTENT)
  async status(@Param('id') id: string) {
    const account = await this.accountStatusUseCase.status(id);

    await this.queueServiceProvider.mailer.add(QueueMailerProcessor.SendEmail, {
      to: account.username,
      template:
        account.status === AccountStatus.Active
          ? 'account-enable'
          : 'account-disable',
    });
  }

  @Delete(':id/destroy')
  @Permissions(['account:delete'])
  @HttpCode(HttpStatus.NO_CONTENT)
  async destroy(@Param('id') id: string) {
    const account = await this.accountUseCase.destroy(id);

    await this.queueServiceProvider.mailer.add(QueueMailerProcessor.SendEmail, {
      to: account.username,
      template: 'account-destroy',
    });
  }
}
