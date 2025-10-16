/**
 * @file libs/better-auth-utilities/src/lib/adapters/admin/admin.adapter.ts
 * @description Server API adapter for better-auth Admin plugin.
 * Provides type-safe methods for user management, role administration, and session control.
 */

import type { betterAuth } from 'better-auth';
import {
  type PluginAdapter,
  type AdapterConfig,
  type AdapterContext,
  type AdapterResponse,
  AdapterOperationError,
  PluginNotAvailableError,
} from '../base/plugin-adapter.interface';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * User data structure.
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  emailVerified: boolean;
  banned?: boolean;
  banReason?: string;
  banExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: unknown;
}

/**
 * Session data structure.
 */
export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Options for listing users.
 */
export interface ListUsersOptions {
  limit?: number;
  offset?: number;
  sortBy?: 'createdAt' | 'email' | 'name';
  sortDirection?: 'asc' | 'desc';
  filterBy?: string;
  filterValue?: string;
}

/**
 * Options for creating a user.
 */
export interface CreateUserOptions {
  email: string;
  password: string;
  name: string;
  role?: string;
  emailVerified?: boolean;
  [key: string]: unknown;
}

/**
 * Options for updating a user.
 */
export interface UpdateUserOptions {
  userId: string;
  data: {
    name?: string;
    email?: string;
    role?: string;
    emailVerified?: boolean;
    [key: string]: unknown;
  };
}

/**
 * Options for banning a user.
 */
export interface BanUserOptions {
  userId: string;
  reason?: string;
  banUntil?: Date;
}

/**
 * Options for unbanning a user.
 */
export interface UnbanUserOptions {
  userId: string;
}

/**
 * Options for impersonating a user.
 */
export interface ImpersonateUserOptions {
  userId: string;
}

/**
 * Options for listing user sessions.
 */
export interface ListUserSessionsOptions {
  userId: string;
}

/**
 * Options for revoking a session.
 */
export interface RevokeUserSessionOptions {
  sessionId: string;
}

/**
 * Server API interface for Admin plugin operations.
 */
export interface AdminServerAPI {
  listUsers(
    options: ListUsersOptions & { headers?: Headers | Record<string, string> }
  ): Promise<{ data?: User[]; error?: unknown }>;

  createUser(
    options: CreateUserOptions & { headers?: Headers | Record<string, string> }
  ): Promise<{ data?: User; error?: unknown }>;

  updateUser(
    options: UpdateUserOptions & { headers?: Headers | Record<string, string> }
  ): Promise<{ data?: User; error?: unknown }>;

  deleteUser(options: {
    userId: string;
    headers?: Headers | Record<string, string>;
  }): Promise<{ data?: { success: boolean }; error?: unknown }>;

  banUser(
    options: BanUserOptions & { headers?: Headers | Record<string, string> }
  ): Promise<{ data?: User; error?: unknown }>;

  unbanUser(
    options: UnbanUserOptions & { headers?: Headers | Record<string, string> }
  ): Promise<{ data?: User; error?: unknown }>;

  impersonateUser(
    options: ImpersonateUserOptions & { headers?: Headers | Record<string, string> }
  ): Promise<{ data?: { session: Session }; error?: unknown }>;

  listUserSessions(
    options: ListUserSessionsOptions & { headers?: Headers | Record<string, string> }
  ): Promise<{ data?: Session[]; error?: unknown }>;

  revokeUserSession(
    options: RevokeUserSessionOptions & { headers?: Headers | Record<string, string> }
  ): Promise<{ data?: { success: boolean }; error?: unknown }>;
}

// ============================================================================
// ADMIN ADAPTER
// ============================================================================

/**
 * Adapter for better-auth Admin plugin.
 * Wraps server API methods with type safety and error handling.
 */
export class AdminAdapter implements PluginAdapter<AdminServerAPI> {
  public readonly pluginId = 'admin';
  public readonly pluginName = 'Admin';
  public readonly api: AdminServerAPI;

  private readonly auth: ReturnType<typeof betterAuth>;
  private readonly debug: boolean;

  constructor(config: AdapterConfig) {
    this.auth = config.auth;
    this.debug = config.debug ?? false;

    if (!this.isAvailable()) {
      throw new PluginNotAvailableError(
        this.pluginName,
        'Admin plugin not enabled in better-auth configuration'
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const authApi = this.auth.api as any;

    this.api = {
      listUsers: authApi.listUsers?.bind(authApi),
      createUser: authApi.createUser?.bind(authApi),
      updateUser: authApi.updateUser?.bind(authApi),
      deleteUser: authApi.deleteUser?.bind(authApi),
      banUser: authApi.banUser?.bind(authApi),
      unbanUser: authApi.unbanUser?.bind(authApi),
      impersonateUser: authApi.impersonateUser?.bind(authApi),
      listUserSessions: authApi.listUserSessions?.bind(authApi),
      revokeUserSession: authApi.revokeUserSession?.bind(authApi),
    };

    this.log('Admin adapter initialized');
  }

  public isAvailable(): boolean {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const authApi = this.auth.api as any;
    return typeof authApi.listUsers === 'function';
  }

  /**
   * Lists all users with optional filtering and pagination.
   */
  public async listUsers(
    options: ListUsersOptions,
    context: AdapterContext
  ): Promise<AdapterResponse<User[]>> {
    try {
      this.log('Listing users with options:', options);

      const result = await this.api.listUsers({
        ...options,
        headers: context.headers,
      });

      if (result.error) {
        throw new AdapterOperationError('listUsers', 'Failed to list users', result.error);
      }

      return {
        success: true,
        data: result.data || [],
        message: 'Users retrieved successfully',
      };
    } catch (error) {
      this.log('Error listing users:', error);
      return {
        success: false,
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Creates a new user (admin only).
   */
  public async createUser(
    options: CreateUserOptions,
    context: AdapterContext
  ): Promise<AdapterResponse<User>> {
    try {
      this.log('Creating user:', options.email);

      const result = await this.api.createUser({
        ...options,
        headers: context.headers,
      });

      if (result.error) {
        throw new AdapterOperationError('createUser', 'Failed to create user', result.error);
      }

      return {
        success: true,
        data: result.data,
        message: 'User created successfully',
      };
    } catch (error) {
      this.log('Error creating user:', error);
      return {
        success: false,
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Updates an existing user.
   */
  public async updateUser(
    options: UpdateUserOptions,
    context: AdapterContext
  ): Promise<AdapterResponse<User>> {
    try {
      this.log('Updating user:', options.userId);

      const result = await this.api.updateUser({
        ...options,
        headers: context.headers,
      });

      if (result.error) {
        throw new AdapterOperationError('updateUser', 'Failed to update user', result.error);
      }

      return {
        success: true,
        data: result.data,
        message: 'User updated successfully',
      };
    } catch (error) {
      this.log('Error updating user:', error);
      return {
        success: false,
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Deletes a user.
   */
  public async deleteUser(
    userId: string,
    context: AdapterContext
  ): Promise<AdapterResponse<{ success: boolean }>> {
    try {
      this.log('Deleting user:', userId);

      const result = await this.api.deleteUser({
        userId,
        headers: context.headers,
      });

      if (result.error) {
        throw new AdapterOperationError('deleteUser', 'Failed to delete user', result.error);
      }

      return {
        success: true,
        data: result.data,
        message: 'User deleted successfully',
      };
    } catch (error) {
      this.log('Error deleting user:', error);
      return {
        success: false,
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Bans a user.
   */
  public async banUser(
    options: BanUserOptions,
    context: AdapterContext
  ): Promise<AdapterResponse<User>> {
    try {
      this.log('Banning user:', options.userId);

      const result = await this.api.banUser({
        ...options,
        headers: context.headers,
      });

      if (result.error) {
        throw new AdapterOperationError('banUser', 'Failed to ban user', result.error);
      }

      return {
        success: true,
        data: result.data,
        message: 'User banned successfully',
      };
    } catch (error) {
      this.log('Error banning user:', error);
      return {
        success: false,
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Unbans a user.
   */
  public async unbanUser(
    options: UnbanUserOptions,
    context: AdapterContext
  ): Promise<AdapterResponse<User>> {
    try {
      this.log('Unbanning user:', options.userId);

      const result = await this.api.unbanUser({
        ...options,
        headers: context.headers,
      });

      if (result.error) {
        throw new AdapterOperationError('unbanUser', 'Failed to unban user', result.error);
      }

      return {
        success: true,
        data: result.data,
        message: 'User unbanned successfully',
      };
    } catch (error) {
      this.log('Error unbanning user:', error);
      return {
        success: false,
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Impersonates a user (creates a session as that user).
   */
  public async impersonateUser(
    options: ImpersonateUserOptions,
    context: AdapterContext
  ): Promise<AdapterResponse<{ session: Session }>> {
    try {
      this.log('Impersonating user:', options.userId);

      const result = await this.api.impersonateUser({
        ...options,
        headers: context.headers,
      });

      if (result.error) {
        throw new AdapterOperationError(
          'impersonateUser',
          'Failed to impersonate user',
          result.error
        );
      }

      return {
        success: true,
        data: result.data,
        message: 'User impersonation successful',
      };
    } catch (error) {
      this.log('Error impersonating user:', error);
      return {
        success: false,
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Lists all sessions for a user.
   */
  public async listUserSessions(
    options: ListUserSessionsOptions,
    context: AdapterContext
  ): Promise<AdapterResponse<Session[]>> {
    try {
      this.log('Listing sessions for user:', options.userId);

      const result = await this.api.listUserSessions({
        ...options,
        headers: context.headers,
      });

      if (result.error) {
        throw new AdapterOperationError(
          'listUserSessions',
          'Failed to list user sessions',
          result.error
        );
      }

      return {
        success: true,
        data: result.data || [],
        message: 'User sessions retrieved successfully',
      };
    } catch (error) {
      this.log('Error listing user sessions:', error);
      return {
        success: false,
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Revokes a specific user session.
   */
  public async revokeUserSession(
    options: RevokeUserSessionOptions,
    context: AdapterContext
  ): Promise<AdapterResponse<{ success: boolean }>> {
    try {
      this.log('Revoking session:', options.sessionId);

      const result = await this.api.revokeUserSession({
        ...options,
        headers: context.headers,
      });

      if (result.error) {
        throw new AdapterOperationError(
          'revokeUserSession',
          'Failed to revoke user session',
          result.error
        );
      }

      return {
        success: true,
        data: result.data,
        message: 'User session revoked successfully',
      };
    } catch (error) {
      this.log('Error revoking user session:', error);
      return {
        success: false,
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private log(...args: unknown[]): void {
    if (this.debug) {
      console.log('[AdminAdapter]', ...args);
    }
  }
}

/**
 * Factory function to create an Admin adapter instance.
 */
export function createAdminAdapter(config: AdapterConfig): AdminAdapter {
  return new AdminAdapter(config);
}
