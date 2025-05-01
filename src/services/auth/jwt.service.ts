import { Injectable } from '@nestjs/common';
import { JwtSignDto } from 'src/cores/dtos';
import { JwtEntity } from 'src/cores/entities';
import { TokenScope } from 'src/cores/enums';
import { IJwtRepository } from 'src/cores/interfaces';

@Injectable()
export class JwtService {
  constructor(private readonly jwtRepository: IJwtRepository) {}

  async verify(token: string): Promise<JwtEntity> {
    try {
      return await this.jwtRepository.verify({ token });
    } catch (error) {
      return null;
    }
  }

  async generate(data: JwtSignDto) {
    return await this.jwtRepository.generate({ data });
  }

  async accessToken({
    userId,
    username,
    permissions,
  }: {
    userId: string;
    username: string;
    permissions?: string[];
  }) {
    return await this.jwtRepository.generate({
      data: {
        userId,
        username,
        scope: TokenScope.Access,
        permissions,
      },
    });
  }

  async refreshToken({
    userId,
    username,
    permissions,
  }: {
    userId: string;
    username: string;
    permissions?: string[];
  }) {
    return await this.jwtRepository.generate({
      data: {
        userId,
        username,
        scope: TokenScope.Refresh,
        permissions,
      },
    });
  }

  async rememberMeToken({
    userId,
    username,
    permissions,
  }: {
    userId: string;
    username: string;
    permissions: string[];
  }) {
    return await this.jwtRepository.generate({
      data: {
        userId,
        username,
        scope: TokenScope.RememberMe,
        permissions,
      },
    });
  }

  async generateTokens(
    payload: {
      sub: string;
      username: string;
      permissions: string[];
    },
    rememberMe?: boolean,
  ): Promise<{
    accessToken: string;
    accessTokenExpAt: number;
    refreshToken: string;
    refreshTokenExpAt: number;
    rememberMeToken?: string;
    rememberMeTokenExpAt?: number;
  }> {
    const { exp: accessTokenExpAt, token: accessToken } =
      await this.accessToken({
        userId: payload.sub,
        username: payload.username,
        permissions: payload.permissions,
      });

    const { exp: refreshTokenExpAt, token: refreshToken } =
      await this.refreshToken({
        userId: payload.sub,
        username: payload.username,
        permissions: payload.permissions,
      });

    if (rememberMe) {
      const { exp: rememberMeTokenExpAt, token: rememberMeToken } =
        await this.rememberMeToken({
          userId: payload.sub,
          username: payload.username,
          permissions: payload.permissions,
        });

      return {
        accessToken,
        accessTokenExpAt,
        refreshToken,
        refreshTokenExpAt,
        rememberMeToken,
        rememberMeTokenExpAt,
      };
    }

    return {
      accessToken,
      accessTokenExpAt,
      refreshToken,
      refreshTokenExpAt,
    };
  }

  expiration(params: { scope: TokenScope }) {
    return this.jwtRepository.getExpiration(params);
  }
}
