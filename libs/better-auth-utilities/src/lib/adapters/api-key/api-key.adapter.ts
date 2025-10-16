/**
 * @file libs/better-auth-utilities/src/lib/adapters/api-key/api-key.adapter.ts
 * @description Server API adapter for better-auth API Key plugin.
 * Provides type-safe methods for managing API keys with rate limiting, permissions, and metadata.
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
 * API Key data structure.
 */
export interface APIKey {
  id: string;
  name: string;
  key: string;
  userId: string;
  expiresAt?: Date;
  permissions?: Record<string, string[]>;
  metadata?: Record<string, unknown>;
  rateLimit?: {
    enabled: boolean;
    timeWindow: number;
    maxRequests: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Options for creating an API key.
 */
export interface CreateAPIKeyOptions {
  name: string;
  expiresIn?: number;
  permissions?: Record<string, string[]>;
  metadata?: Record<string, unknown>;
  rateLimit?: {
    enabled: boolean;
    timeWindow: number;
    maxRequests: number;
  };
}

/**
 * Options for updating an API key.
 */
export interface UpdateAPIKeyOptions {
  id: string;
  name?: string;
  permissions?: Record<string, string[]>;
  metadata?: Record<string, unknown>;
  rateLimit?: {
    enabled?: boolean;
    timeWindow?: number;
    maxRequests?: number;
  };
}

/**
 * Options for listing API keys.
 */
export interface ListAPIKeysOptions {
  userId?: string;
  limit?: number;
  offset?: number;
}

/**
 * Options for verifying an API key.
 */
export interface VerifyAPIKeyOptions {
  key: string;
}

/**
 * API Key verification result.
 */
export interface VerifyAPIKeyResult {
  valid: boolean;
  apiKey?: APIKey;
  error?: string;
}

/**
 * Server API interface for API Key plugin operations.
 */
export interface APIKeyServerAPI {
  createApiKey(
    options: CreateAPIKeyOptions & { headers?: Headers | Record<string, string> }
  ): Promise<{ data?: APIKey; error?: unknown }>;

  listApiKeys(
    options: ListAPIKeysOptions & { headers?: Headers | Record<string, string> }
  ): Promise<{ data?: APIKey[]; error?: unknown }>;

  updateApiKey(
    options: UpdateAPIKeyOptions & { headers?: Headers | Record<string, string> }
  ): Promise<{ data?: APIKey; error?: unknown }>;

  deleteApiKey(options: {
    id: string;
    headers?: Headers | Record<string, string>;
  }): Promise<{ data?: { success: boolean }; error?: unknown }>;

  verifyApiKey(
    options: VerifyAPIKeyOptions & { headers?: Headers | Record<string, string> }
  ): Promise<{ data?: VerifyAPIKeyResult; error?: unknown }>;
}

// ============================================================================
// API KEY ADAPTER
// ============================================================================

/**
 * Adapter for better-auth API Key plugin.
 * Wraps server API methods with type safety and error handling.
 */
export class APIKeyAdapter implements PluginAdapter<APIKeyServerAPI> {
  public readonly pluginId = 'api-key';
  public readonly pluginName = 'API Key';
  public readonly api: APIKeyServerAPI;

  private readonly auth: ReturnType<typeof betterAuth>;
  private readonly debug: boolean;

  constructor(config: AdapterConfig) {
    this.auth = config.auth;
    this.debug = config.debug ?? false;

    // Check if API key plugin is available
    if (!this.isAvailable()) {
      throw new PluginNotAvailableError(
        this.pluginName,
        'API Key plugin not enabled in better-auth configuration'
      );
    }

    // Extract API key methods from auth.api
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const authApi = this.auth.api as any;

    this.api = {
      createApiKey: authApi.createApiKey?.bind(authApi),
      listApiKeys: authApi.listApiKeys?.bind(authApi),
      updateApiKey: authApi.updateApiKey?.bind(authApi),
      deleteApiKey: authApi.deleteApiKey?.bind(authApi),
      verifyApiKey: authApi.verifyApiKey?.bind(authApi),
    };

    this.log('API Key adapter initialized');
  }

  /**
   * Checks if the API Key plugin is available in the auth instance.
   */
  public isAvailable(): boolean {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const authApi = this.auth.api as any;
    return typeof authApi.createApiKey === 'function';
  }

  /**
   * Creates a new API key for the authenticated user.
   */
  public async createApiKey(
    options: CreateAPIKeyOptions,
    context: AdapterContext
  ): Promise<AdapterResponse<APIKey>> {
    try {
      this.log('Creating API key:', options.name);

      const result = await this.api.createApiKey({
        ...options,
        headers: context.headers,
      });

      if (result.error) {
        throw new AdapterOperationError(
          'createApiKey',
          'Failed to create API key',
          result.error
        );
      }

      return {
        success: true,
        data: result.data,
        message: 'API key created successfully',
      };
    } catch (error) {
      this.log('Error creating API key:', error);
      return {
        success: false,
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Lists API keys for a user.
   */
  public async listApiKeys(
    options: ListAPIKeysOptions,
    context: AdapterContext
  ): Promise<AdapterResponse<APIKey[]>> {
    try {
      this.log('Listing API keys for user:', options.userId);

      const result = await this.api.listApiKeys({
        ...options,
        headers: context.headers,
      });

      if (result.error) {
        throw new AdapterOperationError(
          'listApiKeys',
          'Failed to list API keys',
          result.error
        );
      }

      return {
        success: true,
        data: result.data || [],
        message: 'API keys retrieved successfully',
      };
    } catch (error) {
      this.log('Error listing API keys:', error);
      return {
        success: false,
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Updates an existing API key.
   */
  public async updateApiKey(
    options: UpdateAPIKeyOptions,
    context: AdapterContext
  ): Promise<AdapterResponse<APIKey>> {
    try {
      this.log('Updating API key:', options.id);

      const result = await this.api.updateApiKey({
        ...options,
        headers: context.headers,
      });

      if (result.error) {
        throw new AdapterOperationError(
          'updateApiKey',
          'Failed to update API key',
          result.error
        );
      }

      return {
        success: true,
        data: result.data,
        message: 'API key updated successfully',
      };
    } catch (error) {
      this.log('Error updating API key:', error);
      return {
        success: false,
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Deletes an API key.
   */
  public async deleteApiKey(
    id: string,
    context: AdapterContext
  ): Promise<AdapterResponse<{ success: boolean }>> {
    try {
      this.log('Deleting API key:', id);

      const result = await this.api.deleteApiKey({
        id,
        headers: context.headers,
      });

      if (result.error) {
        throw new AdapterOperationError(
          'deleteApiKey',
          'Failed to delete API key',
          result.error
        );
      }

      return {
        success: true,
        data: result.data,
        message: 'API key deleted successfully',
      };
    } catch (error) {
      this.log('Error deleting API key:', error);
      return {
        success: false,
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Verifies an API key.
   */
  public async verifyApiKey(
    key: string,
    context: AdapterContext
  ): Promise<AdapterResponse<VerifyAPIKeyResult>> {
    try {
      this.log('Verifying API key');

      const result = await this.api.verifyApiKey({
        key,
        headers: context.headers,
      });

      if (result.error) {
        throw new AdapterOperationError(
          'verifyApiKey',
          'Failed to verify API key',
          result.error
        );
      }

      return {
        success: true,
        data: result.data,
        message: 'API key verified successfully',
      };
    } catch (error) {
      this.log('Error verifying API key:', error);
      return {
        success: false,
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Internal logging method.
   */
  private log(...args: unknown[]): void {
    if (this.debug) {
      console.log('[APIKeyAdapter]', ...args);
    }
  }
}

/**
 * Factory function to create an API Key adapter instance.
 */
export function createAPIKeyAdapter(
  config: AdapterConfig
): APIKeyAdapter {
  return new APIKeyAdapter(config);
}
