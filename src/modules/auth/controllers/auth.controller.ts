import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import {
  SignedVerifyRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequestRequest,
  ResetPasswordResetRequest,
} from '../requests';
import {
  EmailVerificationUseCase,
  LoginUseCase,
  RefreshUseCase,
  RegisterUseCase,
  ResetPasswordUseCase,
} from '../use-cases';
import { LogoutUseCase } from '../use-cases/logout.use-case';
import { LocalAuthEntity, ProfileEntity } from 'src/cores/entities';
import {
  AccessAuthGuard,
  LocalAuthGuard,
  RefreshAuthGuard,
} from 'src/middlewares/guards';
import { AuthPayload } from 'src/common/decorators';
import { FastifyRequest } from 'fastify';
import { IQueueServiceProvider } from 'src/cores/contracts';
import { QueueMailerProcessor } from 'src/cores/consts';
import { AuthMapper, ProfileMapper } from 'src/middlewares/interceptors';

@ApiTags('Authentication')
@Controller({
  path: 'auth',
  version: '1.0',
})
export class AuthController {
  constructor(
    private readonly authMapper: AuthMapper,
    private readonly profileMapper: ProfileMapper,
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly refreshUseCase: RefreshUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly emailVerificationUseCase: EmailVerificationUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly queueServiceProvider: IQueueServiceProvider,
  ) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginRequest })
  async login(
    @Request()
    { user }: { user: LocalAuthEntity },
  ) {
    const { authenticated, abilities } = await this.loginUseCase.login({
      user,
    });

    return this.authMapper.toMap({
      profile: await this.profileMapper.toMap(user.user, user.role),
      accessToken: authenticated.accessToken,
      accessTokenExpAt: authenticated.accessTokenExpAt,
      refreshToken: authenticated.refreshToken,
      refreshTokenExpAt: authenticated.refreshTokenExpAt,
      abilities,
    });
  }

  @Post('register')
  async register(
    @Req() request: FastifyRequest,
    @Body() payload: RegisterRequest,
  ) {
    const { user, role, authenticated, abilities, emailVerificationUrl } =
      await this.registerUseCase.register(request, payload);

    await this.queueServiceProvider.mailer.add(QueueMailerProcessor.SendEmail, {
      to: user.email,
      template: 'email-verification',
      context: {
        link: emailVerificationUrl,
      },
    });

    return this.authMapper.toMap({
      profile: await this.profileMapper.toMap(user, role),
      accessToken: authenticated.accessToken,
      accessTokenExpAt: authenticated.accessTokenExpAt,
      refreshToken: authenticated.refreshToken,
      refreshTokenExpAt: authenticated.refreshTokenExpAt,
      abilities,
    });
  }

  @Post('verification-email/send')
  @UseGuards(AccessAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async sendEmailVerification(
    @Req() request: FastifyRequest,
    @AuthPayload() payload: ProfileEntity,
  ) {
    const url = await this.emailVerificationUseCase.send(request, payload.id);

    await this.queueServiceProvider.mailer.add(QueueMailerProcessor.SendEmail, {
      to: payload.email,
      template: 'email-verification',
      context: {
        link: url,
      },
    });
  }

  @Post('verification-email/verify')
  @HttpCode(HttpStatus.NO_CONTENT)
  async verifyEmailVerification(
    @Req() request: FastifyRequest,
    @Body() payload: SignedVerifyRequest,
  ) {
    await this.emailVerificationUseCase.verify(request, payload);
  }

  @Post('reset-password/request')
  @HttpCode(HttpStatus.NO_CONTENT)
  async requestResetPassword(
    @Req() request: FastifyRequest,
    @Body() payload: ResetPasswordRequestRequest,
  ) {
    const { url, code, identity } = await this.resetPasswordUseCase.request(
      request,
      payload,
    );

    await this.queueServiceProvider.mailer.add(QueueMailerProcessor.SendEmail, {
      to: identity.username,
      template: 'reset-password-request',
      context: {
        link: url,
        code: code,
      },
    });
  }

  @Post('reset-password/reset')
  @HttpCode(HttpStatus.NO_CONTENT)
  async resetPassword(
    @Req() request: FastifyRequest,
    @Body() payload: ResetPasswordResetRequest,
  ) {
    const identity = await this.resetPasswordUseCase.reset(request, payload);

    await this.queueServiceProvider.mailer.add(QueueMailerProcessor.SendEmail, {
      to: identity.username,
      template: 'reset-password-success',
      context: {
        link: request.headers.origin,
      },
    });
  }

  @Post('refresh')
  @UseGuards(RefreshAuthGuard)
  async refresh(@AuthPayload() payload: ProfileEntity) {
    const { user, authenticated, abilities } =
      await this.refreshUseCase.refresh(payload);

    return this.authMapper.toMap({
      profile: user,
      accessToken: authenticated.accessToken,
      accessTokenExpAt: authenticated.accessTokenExpAt,
      refreshToken: authenticated.refreshToken,
      refreshTokenExpAt: authenticated.refreshTokenExpAt,
      abilities,
    });
  }

  @Delete('logout')
  @UseGuards(AccessAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@AuthPayload() payload: ProfileEntity) {
    await this.logoutUseCase.logout(payload);
  }
}
