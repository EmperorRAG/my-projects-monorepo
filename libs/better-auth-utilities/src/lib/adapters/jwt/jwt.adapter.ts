/**
 * @file libs/better-auth-utilities/src/lib/adapters/jwt/jwt.adapter.ts
 * @description Server API adapter for better-auth JWT plugin.
 * JWT plugin primarily handles JSON Web Token signing and verification.
 * It affects token generation but doesn't expose distinct server API endpoints.
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

export interface JWTServerAPI {
  getSession(options: {
    headers?: Headers | Record<string, string>;
  }): Promise<{ data?: { session: Session; user: User }; error?: unknown }>;
}

// ============================================================================
// JWT ADAPTER
// ============================================================================

/**
 * Adapter for better-auth JWT plugin.
 *
 * The JWT plugin enables JSON Web Token-based authentication where:
 * - Tokens are signed using JWT standards (HS256, RS256, etc.)
 * - Tokens contain claims and can be verified cryptographically
 * - Session tokens are JWT-formatted instead of random strings
 *
 * The plugin configures better-auth to use JWT for session tokens but doesn't
 * expose additional server API endpoints beyond the core getSession method.
 *
 * Primary server-side operation is session validation using JWT tokens
 * passed in headers or cookies.
 */
export class JWTAdapter implements PluginAdapter<JWTServerAPI> {
  public readonly pluginId = 'jwt';
  public readonly pluginName = 'JWT';
  public readonly api: JWTServerAPI;

  private readonly auth: ReturnType<typeof betterAuth>;
  private readonly debug: boolean;

  constructor(config: AdapterConfig) {
    this.auth = config.auth;
    this.debug = config.debug ?? false;

    if (!this.isAvailable()) {
      throw new PluginNotAvailableError(
        this.pluginName,
        'JWT plugin not enabled in better-auth configuration'
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const authApi = this.auth.api as any;

    this.api = {
      getSession: authApi.getSession?.bind(authApi),
    };

    this.log('JWT adapter initialized');
  }

  public isAvailable(): boolean {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const authApi = this.auth.api as any;
    // JWT plugin is available if getSession exists (core auth API)
    // JWT affects token format but doesn't add new endpoints
    return typeof authApi.getSession === 'function';
  }

  /**
   * Retrieves session information using JWT token from headers or cookies.
   *
   * When JWT plugin is enabled, session tokens are JWT-formatted and can be
   * validated cryptographically. This method works with both:
   * - Authorization header: `Authorization: Bearer <jwt-token>`
   * - Session cookies containing JWT tokens
   *
   * @param context - Adapter context containing headers/cookies with JWT token
   * @returns Session and user information if token is valid
   *
   * @example
   * ```typescript
   * // With Authorization header
   * const result = await adapter.getSession({
   *   headers: { Authorization: 'Bearer eyJhbGc...' }
   * });
   *
   * // With cookies (automatic)
   * const result = await adapter.getSession({
   *   headers: req.headers
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
      this.log('Retrieving session with JWT token');
      const result = await this.api.getSession({ headers: context.headers });
      if (result.error) {
        throw new AdapterOperationError('getSession', 'Failed to get session with JWT token', result.error);
      }
      return { success: true, data: result.data, message: 'Session retrieved successfully' };
    } catch (error) {
      this.log('Error getting session:', error);
      return { success: false, error, message: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  private log(...args: unknown[]): void {
    if (this.debug) {
      console.log('[JWTAdapter]', ...args);
    }
  }
}

export function createJWTAdapter(config: AdapterConfig): JWTAdapter {
  return new JWTAdapter(config);
}
