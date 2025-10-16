/**
 * @file libs/better-auth-utilities/src/lib/adapters/bearer/bearer.adapter.ts
 * @description Server API adapter for better-auth Bearer plugin.
 * Bearer plugin primarily handles token-based authentication via client configuration.
 * Server-side usage focuses on session validation with bearer tokens in headers.
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

export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
  token: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BearerServerAPI {
  getSession(options: {
    headers?: Headers | Record<string, string>;
  }): Promise<{ data?: { session: Session; user: User }; error?: unknown }>;
}

// ============================================================================
// BEARER ADAPTER
// ============================================================================

/**
 * Adapter for better-auth Bearer plugin.
 *
 * The Bearer plugin enables token-based authentication where tokens are:
 * - Stored in client-side storage (localStorage)
 * - Automatically included in Authorization headers
 * - Validated server-side via getSession
 *
 * Primary server-side operation is session validation using bearer tokens
 * passed in the Authorization header (format: "Bearer <token>").
 */
export class BearerAdapter implements PluginAdapter<BearerServerAPI> {
  public readonly pluginId = 'bearer';
  public readonly pluginName = 'Bearer';
  public readonly api: BearerServerAPI;

  private readonly auth: ReturnType<typeof betterAuth>;
  private readonly debug: boolean;

  constructor(config: AdapterConfig) {
    this.auth = config.auth;
    this.debug = config.debug ?? false;

    if (!this.isAvailable()) {
      throw new PluginNotAvailableError(
        this.pluginName,
        'Bearer plugin not enabled in better-auth configuration'
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const authApi = this.auth.api as any;

    this.api = {
      getSession: authApi.getSession?.bind(authApi),
    };

    this.log('Bearer adapter initialized');
  }

  public isAvailable(): boolean {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const authApi = this.auth.api as any;
    // Bearer plugin is available if getSession exists (core auth API)
    return typeof authApi.getSession === 'function';
  }

  /**
   * Retrieves session information using bearer token from headers.
   *
   * The bearer token should be provided in the Authorization header:
   * `Authorization: Bearer <token>`
   *
   * @param context - Adapter context containing headers with Authorization token
   * @returns Session and user information if token is valid
   *
   * @example
   * ```typescript
   * const result = await adapter.getSession({
   *   headers: { Authorization: 'Bearer sk_test_123...' }
   * });
   *
   * if (result.success) {
   *   console.log('User:', result.data.user);
   *   console.log('Session:', result.data.session);
   * }
   * ```
   */
  async getSession(
    context: AdapterContext
  ): Promise<AdapterResponse<{ session: Session; user: User }>> {
    try {
      this.log('Retrieving session with bearer token');
      const result = await this.api.getSession({ headers: context.headers });
      if (result.error) {
        throw new AdapterOperationError('getSession', 'Failed to get session with bearer token', result.error);
      }
      return { success: true, data: result.data, message: 'Session retrieved successfully' };
    } catch (error) {
      this.log('Error getting session:', error);
      return { success: false, error, message: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  private log(...args: unknown[]): void {
    if (this.debug) {
      console.log('[BearerAdapter]', ...args);
    }
  }
}

export function createBearerAdapter(config: AdapterConfig): BearerAdapter {
  return new BearerAdapter(config);
}
