import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  CreateAccountRequest,
  QueryUserRequest,
  UpdateAccountRequest,
} from '../requests';
import { Transactional } from '@nestjs-cls/transactional';
import { Generate } from 'src/common/helpers';
import {
  AuthService,
  IdentityService,
  RoleService,
  UserService,
} from 'src/services';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ProfileEntity } from 'src/cores/entities';
import { CreateIdentityDto } from 'src/cores/dtos';

@Injectable()
export class AccountUseCase {
  constructor(
    private readonly authService: AuthService,
    private readonly identityService: IdentityService,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
  ) {}

  async findAll(query: QueryUserRequest, profile: ProfileEntity) {
    return await this.identityService.findAll({
      ...query,
      currentUserId: profile.id,
    });
  }

  async findOne(userId: string) {
    return await this.identityService.findOne<
      Prisma.IdentityGetPayload<{
        include: {
          role: true;
          user: { include: { picture: true } };
          permissionsOnIdentities: {
            include: {
              permission: true;
            };
          };
        };
      }>
    >(userId, {
      user: {
        include: {
          picture: true,
        },
      },
      role: true,
      permissionsOnIdentities: {
        include: {
          permission: true,
        },
      },
    });
  }

  @Transactional()
  async create(payload: CreateAccountRequest) {
    try {
      const exist = await this.identityService.findOne<
        Prisma.IdentityGetPayload<Prisma.IdentityDefaultArgs>
      >(payload.userId);
      if (exist) {
        throw new BadRequestException([
          {
            field: 'userId',
            errors: [`User account is already exist.`],
          },
        ]);
      }

      if (!payload.password) {
        payload.password = Generate.randomString();
      }

      const [user, role] = await Promise.all([
        this.userService.findOne<
          Prisma.UserGetPayload<{
            include: {
              picture: true;
            };
          }>
        >(payload.userId, {
          picture: true,
        }),
        this.roleService.findOne<
          Prisma.RoleGetPayload<{
            include: {
              permissionsOnRoles: true;
            };
          }>
        >(payload.roleId, {
          permissionsOnRoles: true,
        }),
      ]);

      if (!payload.permissions || payload.permissions.length < 1) {
        payload.permissions = role.permissionsOnRoles.map(
          (por) => por.permissionId,
        );
      }

      const created = await this.identityService.upsert<
        Prisma.IdentityGetPayload<Prisma.IdentityDefaultArgs>
      >(
        new CreateIdentityDto({
          userId: payload.userId,
          roleId: role.id,
          username: user.email,
          password: payload.password,
          permissionIds: payload.permissions,
        }),
      );

      const account: Prisma.IdentityGetPayload<{
        include: {
          role: true;
          user: { include: { picture: true } };
        };
      }> = {
        ...created,
        role: role,
        user: user,
      };

      return {
        account: account,
        credential: {
          username: created.username,
          password: payload.password,
        },
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new UnprocessableEntityException('account is already exists');
        }
      }

      throw error;
    }
  }

  @Transactional()
  async update(userId: string, payload: UpdateAccountRequest) {
    const updated = await this.identityService.updateUsername(userId, {
      username: payload.username,
    });

    await this.authService.updateUser(updated.id, { email: updated.username });

    return updated;
  }

  @Transactional()
  async destroy(userId: string) {
    const removed = await this.identityService.remove(userId);

    await this.authService.destroy(removed.id);

    return removed;
  }
}
