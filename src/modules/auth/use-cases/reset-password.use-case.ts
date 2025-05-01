import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AuthService, IdentityService } from 'src/services';
import { FastifyRequest } from 'fastify';
import {
  ResetPasswordResetRequest,
  ResetPasswordRequestRequest,
} from '../requests';
import { SignatureError } from 'signed';
import { SetIdentityPasswordDto } from 'src/cores/dtos';

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    private readonly authService: AuthService,
    private readonly identityService: IdentityService,
  ) {}

  private signatureUrl(origin: string) {
    return `${origin}/auth/reset-password/reset`;
  }

  async request(request: FastifyRequest, payload: ResetPasswordRequestRequest) {
    const origin = request.headers.origin;
    if (!origin) {
      throw new UnprocessableEntityException('undefined origin hostname');
    }

    const identity = await this.identityService.findUsername(payload.email);
    if (!identity) {
      throw new NotFoundException(`email or username does not found`);
    }

    const { signatureUrl, verificationCode } =
      await this.authService.resetPasswordStrategy(
        identity.id,
        this.signatureUrl(origin),
      );

    return { url: signatureUrl, code: verificationCode, identity };
  }

  async reset(request: FastifyRequest, payload: ResetPasswordResetRequest) {
    try {
      const origin = request.headers.origin;
      if (!origin) {
        throw new UnprocessableEntityException('undefined origin hostname');
      }

      const signatureUrl = new URL(this.signatureUrl(origin));
      signatureUrl.searchParams.append('signed', payload.signed);
      signatureUrl.searchParams.append('token', payload.token);

      const { data: userId } = this.authService.verifySignedUrl(
        signatureUrl.href,
      );

      const isValidToken = await this.authService.resetPasswordToken(userId);
      if (!isValidToken) {
        throw new UnprocessableEntityException('Request expired');
      }

      const isValidCode = await this.authService.resetPasswordCode(userId);
      if (!isValidCode) {
        throw new BadRequestException([
          {
            field: 'code',
            errors: [`code is expired.`],
          },
        ]);
      }

      if (isValidCode !== payload.code) {
        throw new BadRequestException([
          {
            field: 'code',
            errors: [`code is invalid.`],
          },
        ]);
      }

      const [identity] = await Promise.all([
        this.identityService.updatePassword(
          userId,
          new SetIdentityPasswordDto({
            password: payload.password,
          }),
        ),
        this.authService.passwordResetted(userId),
      ]);

      return identity;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (error instanceof SignatureError) {
        throw new UnprocessableEntityException(error.message);
      }
    }
  }
}
