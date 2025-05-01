import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { TransactionHost } from '@nestjs-cls/transactional';
import { ConfigService } from '@nestjs/config';
import { IJwtServiceEnv, IVerificationEnv } from 'src/cores/interfaces';
import {
  ICacheServiceProvider,
  ISignedUrlServiceProvider,
} from 'src/cores/contracts';
import { Generate, Hash, String } from 'src/common/helpers';
import { LocalAuthEntity, ProfileEntity } from 'src/cores/entities';
import { AccountStatus, TokenScope } from 'src/cores/enums';
import { JwtService } from './jwt.service';
import { ExtendedPrismaClient } from 'src/infrastructures/database';
import { ProfileMapper } from 'src/middlewares/interceptors';

@Injectable()
export class AuthService {
  private jwtConfig: IJwtServiceEnv;
  private verificationConfig: IVerificationEnv;

  constructor(
    private readonly profileMapper: ProfileMapper,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly cacheService: ICacheServiceProvider,
    private readonly signedUrlService: ISignedUrlServiceProvider,
    private readonly dataService: TransactionHost<
      TransactionalAdapterPrisma<ExtendedPrismaClient>
    >,
  ) {
    this.jwtConfig = this.configService.get<IJwtServiceEnv>('jwt');
    this.verificationConfig =
      this.configService.get<IVerificationEnv>('verification');
  }

  async validate(username: string, password: string) {
    const identity = await this.dataService.tx.identity.findFirst({
      where: {
        username,
        deletedAt: null,
      },
      include: {
        user: {
          include: {
            picture: true,
            notificationTokens: true,
          },
        },
        role: true,
        permissionsOnIdentities: {
          select: {
            permission: {
              select: {
                id: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    if (!identity) {
      throw new BadRequestException([
        {
          field: 'username',
          errors: [`username doesn't registered.`],
        },
      ]);
    }

    if (identity.status === AccountStatus.Inactive) {
      throw new BadRequestException([
        {
          field: 'username',
          errors: [`username is inactive, please contact the administrator.`],
        },
      ]);
    }

    if (!(await Hash.verify(password, identity.password))) {
      throw new BadRequestException([
        {
          field: 'username',
          errors: [`username or password doesn't match.`],
        },
      ]);
    }

    return identity;
  }

  async attempt({ localAuth }: { localAuth: LocalAuthEntity }): Promise<{
    accessToken: string;
    accessTokenExpAt: number;
    refreshToken?: string;
    refreshTokenExpAt?: number;
  }> {
    const permissions = localAuth.permissions.map((p) => p.slug);

    const token: {
      accessToken: string;
      accessTokenExpAt: number;
      refreshToken?: string;
      refreshTokenExpAt?: number;
    } = {
      accessToken: '',
      accessTokenExpAt: 0,
      refreshToken: undefined,
      refreshTokenExpAt: undefined,
    };

    const { exp: accessTokenExpAt, token: accessToken } =
      await this.jwtService.accessToken({
        userId: localAuth.id,
        username: localAuth.username,
      });

    token.accessToken = accessToken;
    token.accessTokenExpAt = accessTokenExpAt;

    if (this.isRefreshStrategy()) {
      const { exp: refreshTokenExpAt, token: refreshToken } =
        await this.jwtService.refreshToken({
          userId: localAuth.id,
          username: localAuth.username,
        });

      token.refreshToken = refreshToken;
      token.refreshTokenExpAt = refreshTokenExpAt;
    }

    const user: ProfileEntity = await this.profileMapper.toMap(
      localAuth.user,
      localAuth.role,
    );

    await Promise.all([
      this.destroy(localAuth.id),
      this.setAccessToken(localAuth.id, token.accessToken),
      this.setRefreshToken(localAuth.id, token.refreshToken),
      this.setPermissions(localAuth.id, permissions),
      this.setUser(localAuth.id, user),
      this.setCacheStrategy(localAuth.id),
    ]);

    return token;
  }

  async revalidateToken(userId: string) {
    const [user, permissions] = await Promise.all([
      this.user(userId),
      this.permissions(userId),
    ]);

    const token: {
      accessToken: string;
      accessTokenExpAt: number;
      refreshToken?: string;
      refreshTokenExpAt?: number;
    } = {
      accessToken: '',
      accessTokenExpAt: 0,
      refreshToken: undefined,
      refreshTokenExpAt: undefined,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.accessToken({
        userId: user.id,
        username: user.email,
      }),
      this.jwtService.refreshToken({
        userId: user.id,
        username: user.email,
      }),
    ]);

    token.accessToken = accessToken.token;
    token.accessTokenExpAt = accessToken.exp;
    token.refreshToken = refreshToken.token;
    token.refreshTokenExpAt = refreshToken.exp;

    await Promise.all([
      this.destroy(user.id),
      this.setAccessToken(user.id, token.accessToken),
      this.setRefreshToken(user.id, token.refreshToken),
      this.setPermissions(user.id, permissions),
      this.setUser(user.id, user),
      this.setCacheStrategy(user.id),
    ]);

    return { user, permissions, token };
  }

  async destroy(userId: string) {
    await Promise.all([
      this.cacheService.del(`${userId}:accessToken`),
      this.cacheService.del(`${userId}:refreshToken`),
      this.cacheService.del(`${userId}:permissions`),
      this.cacheService.del(`${userId}:user`),
      this.cacheService.del(`${userId}:caching`),
    ]);
  }

  async passwordResetted(userId: string) {
    await Promise.all([
      this.cacheService.del(`${userId}:reset-password:token`),
      this.cacheService.del(`${userId}:reset-password:refresh`),
    ]);
  }

  async emailVerified(userId: string) {
    await Promise.all([
      this.cacheService.del(`${userId}:verification-email:token`),
      this.cacheService.del(`${userId}:verification-email:refresh`),
    ]);
  }

  async cacheStrategy(userId: string, token: string) {
    const caching = await this.cacheService.get<number | undefined>(
      `${userId}:caching`,
    );

    if (!caching) {
      const accessToken = await this.accessToken(userId);
      if (!accessToken) return false;
      if (accessToken !== token) return false;

      const [permissions, user] = await Promise.all([
        this.permissions(userId),
        this.user(userId),
      ]);

      await Promise.all([
        this.setAccessToken(userId, accessToken),
        this.setPermissions(userId, permissions),
        this.setUser(userId, user),
        this.setCacheStrategy(userId),
      ]);

      return true;
    }

    const cachedAccessToken = await this.accessToken(userId);

    return cachedAccessToken === token;
  }

  async refreshStrategy(userId: string, token: string) {
    const cachedRefreshToken = await this.refreshToken(userId);
    if (!cachedRefreshToken) return false;

    return cachedRefreshToken === token;
  }

  async resetPasswordStrategy(userId: string, url: string) {
    const isAlreadySent = await this.resetPasswordRefresh(userId);
    if (isAlreadySent) {
      throw new UnprocessableEntityException('reset password already sent');
    }

    const signatureUrl = this.createSignedUrl(url, userId);
    const token = String.extractURL(signatureUrl, 'token');
    const verificationCode = Generate.verificationCode();

    await Promise.all([
      await this.setResetPasswordToken(userId, token),
      await this.setResetPasswordCode(userId, verificationCode),
      await this.setResetPasswordRefresh(userId),
    ]);

    return { signatureUrl, verificationCode };
  }

  async verifyEmailStrategy(userId: string, url: string) {
    const isAlreadySent = await this.emailVerificationRefresh(userId);
    if (isAlreadySent) {
      throw new UnprocessableEntityException('email verification already sent');
    }

    const signatureUrl = this.createSignedUrl(url, userId);
    const token = String.extractURL(signatureUrl, 'token');

    await Promise.all([
      await this.setEmailVerificationToken(userId, token),
      await this.setEmailVerificationRefresh(userId),
    ]);

    return signatureUrl;
  }

  async accessToken(userId: string) {
    return await this.cacheService.get<string>(`${userId}:accessToken`);
  }

  async refreshToken(userId: string) {
    return await this.cacheService.get<string>(`${userId}:refreshToken`);
  }

  async permissions(userId: string) {
    return await this.cacheService.get<string[]>(`${userId}:permissions`);
  }

  async user(userId: string): Promise<ProfileEntity> {
    return await this.cacheService.get<ProfileEntity>(`${userId}:user`);
  }

  async resetPasswordToken(userId: string) {
    return await this.cacheService.get<string>(
      `${userId}:reset-password:token`,
    );
  }

  async resetPasswordCode(userId: string) {
    return await this.cacheService.get<string>(`${userId}:reset-password:code`);
  }

  async resetPasswordRefresh(userId: string) {
    return await this.cacheService.get<string>(
      `${userId}:reset-password:refresh`,
    );
  }

  async emailVerificationToken(userId: string) {
    return await this.cacheService.get<string>(
      `${userId}:verification-email:token`,
    );
  }

  async emailVerificationRefresh(userId: string) {
    return await this.cacheService.get<string>(
      `${userId}:verification-email:refresh`,
    );
  }

  async setAccessToken(userId: string, accessToken: string) {
    await this.cacheService.set(
      `${userId}:accessToken`,
      accessToken,
      this.jwtService.expiration({
        scope: this.isRefreshStrategy()
          ? TokenScope.Access
          : TokenScope.Refresh,
      }),
    );
  }

  async setRefreshToken(userId: string, refreshToken?: string) {
    if (refreshToken) {
      await this.cacheService.set(
        `${userId}:refreshToken`,
        refreshToken,
        this.jwtService.expiration({ scope: TokenScope.Refresh }),
      );
    }
  }

  async setPermissions(userId: string, permissions: string[]) {
    await this.cacheService.set(
      `${userId}:permissions`,
      permissions,
      this.jwtService.expiration({ scope: TokenScope.Refresh }),
    );
  }

  async setUser(userId: string, user: ProfileEntity) {
    await this.cacheService.set(
      `${userId}:user`,
      user,
      this.jwtService.expiration({ scope: TokenScope.Refresh }),
    );
  }

  async updateUser(userId: string, user: Partial<ProfileEntity>) {
    const cached = await this.user(`${userId}:user`);
    if (cached) {
      await this.cacheService.set(
        `${userId}:user`,
        {
          ...cached,
          ...user,
        },
        this.jwtService.expiration({ scope: TokenScope.Refresh }),
      );
    }
  }

  async setCacheStrategy(userId: string) {
    await this.cacheService.set(
      `${userId}:caching`,
      1,
      this.jwtService.expiration({ scope: TokenScope.Access }),
    );
  }

  async setResetPasswordToken(userId: string, token: string) {
    await this.cacheService.set(
      `${userId}:reset-password:token`,
      token,
      this.verificationConfig.resetTtl,
    );
  }

  async setResetPasswordCode(userId: string, code: string) {
    await this.cacheService.set(
      `${userId}:reset-password:code`,
      code,
      this.verificationConfig.resetTtl,
    );
  }

  async setResetPasswordRefresh(userId: string) {
    await this.cacheService.set(
      `${userId}:reset-password:refresh`,
      1,
      this.verificationConfig.resetRefreshTtl,
    );
  }

  async setEmailVerificationToken(userId: string, token: string) {
    await this.cacheService.set(
      `${userId}:verification-email:token`,
      token,
      this.verificationConfig.emailTtl,
    );
  }

  async setEmailVerificationRefresh(userId: string) {
    await this.cacheService.set(
      `${userId}:verification-email:refresh`,
      1,
      this.verificationConfig.emailRefreshTtl,
    );
  }

  async hasPermission(userId: string, reqPermissions: string[]) {
    const permissions = await this.permissions(userId);
    return reqPermissions.some((permission) =>
      permissions.includes(permission),
    );
  }

  createSignedUrl(url: string, data?: string) {
    return this.signedUrlService.sign(url, {
      data: data,
      ttl: this.verificationConfig.emailTtl,
    });
  }

  verifySignedUrl(url: string) {
    return this.signedUrlService.verify(url);
  }

  isRefreshStrategy() {
    return this.jwtConfig.strategy === 'refresh';
  }
}
