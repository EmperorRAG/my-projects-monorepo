/**
 * @file libs/better-auth-utilities/src/lib/adapters/admin/admin-nestjs.service.ts
 * @description NestJS service for Admin operations.
 */

import { Injectable } from '@nestjs/common';
import { AdminAdapter } from './admin.adapter';
import type {
  ListUsersOptions,
  CreateUserOptions,
  UpdateUserOptions,
  BanUserOptions,
  UnbanUserOptions,
  ImpersonateUserOptions,
  ListUserSessionsOptions,
  RevokeUserSessionOptions,
  User,
  Session,
} from './admin.adapter';
import type { AdapterContext, AdapterResponse } from '../base/plugin-adapter.interface';

@Injectable()
export class AdminService {
  constructor(private readonly adapter: AdminAdapter) {}

  async listUsers(
    options: ListUsersOptions,
    context: AdapterContext
  ): Promise<AdapterResponse<User[]>> {
    return this.adapter.listUsers(options, context);
  }

  async createUser(
    options: CreateUserOptions,
    context: AdapterContext
  ): Promise<AdapterResponse<User>> {
    return this.adapter.createUser(options, context);
  }

  async updateUser(
    options: UpdateUserOptions,
    context: AdapterContext
  ): Promise<AdapterResponse<User>> {
    return this.adapter.updateUser(options, context);
  }

  async deleteUser(
    userId: string,
    context: AdapterContext
  ): Promise<AdapterResponse<{ success: boolean }>> {
    return this.adapter.deleteUser(userId, context);
  }

  async banUser(
    options: BanUserOptions,
    context: AdapterContext
  ): Promise<AdapterResponse<User>> {
    return this.adapter.banUser(options, context);
  }

  async unbanUser(
    options: UnbanUserOptions,
    context: AdapterContext
  ): Promise<AdapterResponse<User>> {
    return this.adapter.unbanUser(options, context);
  }

  async impersonateUser(
    options: ImpersonateUserOptions,
    context: AdapterContext
  ): Promise<AdapterResponse<{ session: Session }>> {
    return this.adapter.impersonateUser(options, context);
  }

  async listUserSessions(
    options: ListUserSessionsOptions,
    context: AdapterContext
  ): Promise<AdapterResponse<Session[]>> {
    return this.adapter.listUserSessions(options, context);
  }

  async revokeUserSession(
    options: RevokeUserSessionOptions,
    context: AdapterContext
  ): Promise<AdapterResponse<{ success: boolean }>> {
    return this.adapter.revokeUserSession(options, context);
  }

  getAdapter(): AdminAdapter {
    return this.adapter;
  }
}
