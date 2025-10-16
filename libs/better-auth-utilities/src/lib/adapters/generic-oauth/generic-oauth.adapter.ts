/**
 * @file libs/better-auth-utilities/src/lib/adapters/generic-oauth/generic-oauth.adapter.ts
 * @description Generic OAuth plugin adapter for NestJS integration with better-auth.
 *
 * The Generic OAuth plugin enables OAuth 2.0 and OIDC authentication with custom providers.
 * This adapter focuses on server-side operations, primarily linking OAuth accounts to existing users.
 *
 * **Server API Methods:**
 * - `oAuth2LinkAccount`: Links an OAuth account to an existing authenticated user
 *
 * **Note:** Generic OAuth is primarily a configuration plugin for setting up custom OAuth providers.
 * Most OAuth functionality is client-side. The server-side API focuses on account linking for
 * users who want to add additional OAuth providers to their existing account.
 *
 * @see https://better-auth.com/docs/plugins/generic-oauth
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

export interface LinkAccountOptions {
  /** The ID of the OAuth provider to link */
  providerId: string;
  /** Callback URL after successful linking */
  callbackURL: string;
}

export interface LinkAccountResult {
  /** URL to redirect user to for OAuth authorization */
  url: string;
  /** Whether the operation was successful */
  success: boolean;
}

export interface GenericOAuthServerAPI {
  oAuth2LinkAccount(
    options: LinkAccountOptions & { headers?: Headers | Record<string, string> }
  ): Promise<{ data?: LinkAccountResult; error?: unknown }>;
}

// ============================================================================
// GENERIC OAUTH ADAPTER
// ============================================================================

/**
 * Generic OAuth adapter for better-auth NestJS integration.
 *
 * This adapter wraps the better-auth Generic OAuth plugin's server API methods,
 * providing a type-safe interface for linking OAuth accounts to existing users.
 *
 * **OAuth Account Linking Flow:**
 * 1. User is authenticated with an existing account
 * 2. User requests to link an OAuth provider (e.g., Google, GitHub)
 * 3. `oAuth2LinkAccount` generates authorization URL
 * 4. User is redirected to OAuth provider for authorization
 * 5. After authorization, user is redirected back with linked account
 *
 * **Configuration:**
 * The Generic OAuth plugin requires provider configuration in the server config:
 * ```typescript
 * genericOAuth({
 *   providers: [
 *     {
 *       id: 'custom-provider',
 *       name: 'Custom Provider',
 *       clientId: process.env.CUSTOM_OAUTH_CLIENT_ID,
 *       clientSecret: process.env.CUSTOM_OAUTH_CLIENT_SECRET,
 *       authorizationUrl: 'https://provider.com/oauth/authorize',
 *       tokenUrl: 'https://provider.com/oauth/token',
 *       userInfoUrl: 'https://provider.com/oauth/userinfo',
 *     }
 *   ]
 * })
 * ```
 */
export class GenericOAuthAdapter implements PluginAdapter<GenericOAuthServerAPI> {
  public readonly pluginId = 'generic-oauth';
  public readonly pluginName = 'Generic OAuth';
  public readonly api: GenericOAuthServerAPI;

  private readonly auth: ReturnType<typeof betterAuth>;
  private readonly debug: boolean;

  constructor(config: AdapterConfig) {
    this.auth = config.auth;
    this.debug = config.debug ?? false;
    this.api = this.auth.api as unknown as GenericOAuthServerAPI;

    if (this.debug) {
      console.log(`[GenericOAuthAdapter] Initialized for plugin "${this.pluginName}"`);
    }
  }

  public isAvailable(): boolean {
    try {
      return !!(
        this.api &&
        typeof this.api === 'object' &&
        'oAuth2LinkAccount' in this.api
      );
    } catch {
      return false;
    }
  }

  /**
   * Links an OAuth account to an existing authenticated user.
   *
   * This method generates an OAuth authorization URL that the user should be redirected to.
   * After the user authorizes the OAuth provider, they will be redirected back to the
   * specified callback URL with the account linked.
   *
   * **Requirements:**
   * - User must be authenticated (requires session cookies in headers)
   * - OAuth provider must be configured in the Generic OAuth plugin
   *
   * @param options - Provider ID and callback URL
   * @param context - Request context (must include session headers)
   * @returns Authorization URL to redirect user to
   *
   * @example
   * ```typescript
   * const result = await adapter.oAuth2LinkAccount(
   *   {
   *     providerId: 'google',
   *     callbackURL: '/dashboard/linked'
   *   },
   *   { headers: request.headers }
   * );
   *
   * if (result.data) {
   *   // Redirect user to result.data.url for OAuth authorization
   *   return redirect(result.data.url);
   * }
   * ```
   */
  public async oAuth2LinkAccount(
    options: LinkAccountOptions,
    context?: AdapterContext
  ): Promise<AdapterResponse<LinkAccountResult>> {
    const operation = 'oAuth2LinkAccount';

    if (!this.isAvailable()) {
      throw new PluginNotAvailableError(
        this.pluginName,
        'Plugin not properly configured or not enabled'
      );
    }

    try {
      if (this.debug) {
        console.log(`[GenericOAuthAdapter] ${operation}`, {
          providerId: options.providerId,
          callbackURL: options.callbackURL,
        });
      }

      const result = await this.api.oAuth2LinkAccount({
        ...options,
        headers: context?.headers as Headers | Record<string, string>,
      });

      if (result.error) {
        throw new AdapterOperationError(operation, String(result.error), result.error);
      }

      return {
        data: result.data,
        success: true,
        message: 'OAuth account linking initiated successfully',
      };
    } catch (error) {
      if (error instanceof AdapterOperationError) {
        throw error;
      }
      throw new AdapterOperationError(
        operation,
        error instanceof Error ? error.message : 'Unknown error',
        error
      );
    }
  }
}
