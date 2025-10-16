/**
 * @file libs/better-auth-utilities/src/lib/adapters/username/username.adapter.ts
 * @description Server API adapter for better-auth Username plugin.
 * Provides type-safe methods for username-based authentication.
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

export interface User {
  id: string;
  email: string;
  name: string;
  username?: string;
  displayUsername?: string;
  emailVerified: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
  token: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface SignInUsernameOptions {
  username: string;
  password: string;
}

export interface SignUpEmailOptions {
  email: string;
  name: string;
  password: string;
  username: string;
  displayUsername?: string;
}

export interface IsUsernameAvailableOptions {
  username: string;
}

export interface UpdateUserOptions {
  username?: string;
  name?: string;
  image?: string;
}

export interface IsUsernameAvailableResult {
  available: boolean;
}

export interface UsernameServerAPI {
  signInUsername(
    options: SignInUsernameOptions & { headers?: Headers | Record<string, string> }
  ): Promise<{ data?: { user: User; session: Session }; error?: unknown }>;

  signUpEmail(
    options: SignUpEmailOptions & { headers?: Headers | Record<string, string> }
  ): Promise<{ data?: { user: User; session: Session }; error?: unknown }>;

  isUsernameAvailable(
    options: IsUsernameAvailableOptions & { headers?: Headers | Record<string, string> }
  ): Promise<{ data?: IsUsernameAvailableResult; error?: unknown }>;

  updateUser(
    options: UpdateUserOptions & { headers?: Headers | Record<string, string> }
  ): Promise<{ data?: User; error?: unknown }>;
}

// ============================================================================
// USERNAME ADAPTER
// ============================================================================

export class UsernameAdapter implements PluginAdapter<UsernameServerAPI> {
  public readonly pluginId = 'username';
  public readonly pluginName = 'Username';
  public readonly api: UsernameServerAPI;

  private readonly auth: ReturnType<typeof betterAuth>;
  private readonly debug: boolean;

  constructor(config: AdapterConfig) {
    this.auth = config.auth;
    this.debug = config.debug ?? false;

    if (!this.isAvailable()) {
      throw new PluginNotAvailableError(
        this.pluginName,
        'Username plugin not enabled in better-auth configuration'
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const authApi = this.auth.api as any;

    this.api = {
      signInUsername: authApi.signInUsername?.bind(authApi),
      signUpEmail: authApi.signUpEmail?.bind(authApi),
      isUsernameAvailable: authApi.isUsernameAvailable?.bind(authApi),
      updateUser: authApi.updateUser?.bind(authApi),
    };

    this.log('Username adapter initialized');
  }

  public isAvailable(): boolean {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const authApi = this.auth.api as any;
    return typeof authApi.signInUsername === 'function';
  }

  async signInUsername(
    options: SignInUsernameOptions,
    context: AdapterContext
  ): Promise<AdapterResponse<{ user: User; session: Session }>> {
    try {
      this.log('Signing in user with username:', options.username);
      const result = await this.api.signInUsername({ ...options, headers: context.headers });
      if (result.error) {
        throw new AdapterOperationError('signInUsername', 'Failed to sign in with username', result.error);
      }
      return { success: true, data: result.data, message: 'Sign in successful' };
    } catch (error) {
      this.log('Error signing in with username:', error);
      return { success: false, error, message: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async signUpEmail(
    options: SignUpEmailOptions,
    context: AdapterContext
  ): Promise<AdapterResponse<{ user: User; session: Session }>> {
    try {
      this.log('Signing up user with username:', options.username);
      const result = await this.api.signUpEmail({ ...options, headers: context.headers });
      if (result.error) {
        throw new AdapterOperationError('signUpEmail', 'Failed to sign up with username', result.error);
      }
      return { success: true, data: result.data, message: 'Sign up successful' };
    } catch (error) {
      this.log('Error signing up with username:', error);
      return { success: false, error, message: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async isUsernameAvailable(
    options: IsUsernameAvailableOptions,
    context: AdapterContext
  ): Promise<AdapterResponse<IsUsernameAvailableResult>> {
    try {
      this.log('Checking username availability:', options.username);
      const result = await this.api.isUsernameAvailable({ ...options, headers: context.headers });
      if (result.error) {
        throw new AdapterOperationError('isUsernameAvailable', 'Failed to check username availability', result.error);
      }
      return { success: true, data: result.data, message: 'Username availability checked' };
    } catch (error) {
      this.log('Error checking username availability:', error);
      return { success: false, error, message: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async updateUser(
    options: UpdateUserOptions,
    context: AdapterContext
  ): Promise<AdapterResponse<User>> {
    try {
      this.log('Updating user:', options.username || '(no username change)');
      const result = await this.api.updateUser({ ...options, headers: context.headers });
      if (result.error) {
        throw new AdapterOperationError('updateUser', 'Failed to update user', result.error);
      }
      return { success: true, data: result.data, message: 'User updated successfully' };
    } catch (error) {
      this.log('Error updating user:', error);
      return { success: false, error, message: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  private log(...args: unknown[]): void {
    if (this.debug) {
      console.log('[UsernameAdapter]', ...args);
    }
  }
}

export function createUsernameAdapter(config: AdapterConfig): UsernameAdapter {
  return new UsernameAdapter(config);
}
