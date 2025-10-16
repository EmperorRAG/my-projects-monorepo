/**
 * @file libs/better-auth-utilities/src/lib/adapters/api-key/api-key-nestjs.service.ts
 * @description NestJS service for API Key operations.
 * Injectable service following @thallesp/nestjs-better-auth patterns.
 */

import { Injectable } from '@nestjs/common';
import { APIKeyAdapter } from './api-key.adapter';
import type {
  CreateAPIKeyOptions,
  UpdateAPIKeyOptions,
  ListAPIKeysOptions,
  APIKey,
  VerifyAPIKeyResult,
} from './api-key.adapter';
import type { AdapterContext, AdapterResponse } from '../base/plugin-adapter.interface';

/**
 * Injectable service for API Key plugin operations.
 * Wraps APIKeyAdapter for NestJS dependency injection.
 *
 * @example
 * ```typescript
 * import { Injectable } from '@nestjs/common';
 * import { APIKeyService } from './adapters/api-key';
 *
 * @Injectable()
 * export class MyService {
 *   constructor(private readonly apiKeyService: APIKeyService) {}
 *
 *   async createKey(name: string, context: AdapterContext) {
 *     return this.apiKeyService.createApiKey({ name }, context);
 *   }
 * }
 * ```
 */
@Injectable()
export class APIKeyService {
  constructor(private readonly adapter: APIKeyAdapter) {}

  /**
   * Creates a new API key for the authenticated user.
   *
   * @param options - API key creation options
   * @param context - Request context (headers, session)
   * @returns Promise resolving to created API key
   *
   * @example
   * ```typescript
   * const result = await apiKeyService.createApiKey(
   *   {
   *     name: 'Production API Key',
   *     expiresIn: 60 * 60 * 24 * 365, // 1 year
   *     permissions: {
   *       files: ['read', 'write'],
   *       users: ['read'],
   *     },
   *     rateLimit: {
   *       enabled: true,
   *       timeWindow: 60 * 1000, // 1 minute
   *       maxRequests: 100,
   *     },
   *   },
   *   { headers: fromNodeHeaders(req.headers) }
   * );
   * ```
   */
  async createApiKey(
    options: CreateAPIKeyOptions,
    context: AdapterContext
  ): Promise<AdapterResponse<APIKey>> {
    return this.adapter.createApiKey(options, context);
  }

  /**
   * Lists API keys for the authenticated user or specified user.
   *
   * @param options - Filtering and pagination options
   * @param context - Request context
   * @returns Promise resolving to list of API keys
   *
   * @example
   * ```typescript
   * const result = await apiKeyService.listApiKeys(
   *   { limit: 10, offset: 0 },
   *   { headers: fromNodeHeaders(req.headers) }
   * );
   * ```
   */
  async listApiKeys(
    options: ListAPIKeysOptions,
    context: AdapterContext
  ): Promise<AdapterResponse<APIKey[]>> {
    return this.adapter.listApiKeys(options, context);
  }

  /**
   * Updates an existing API key.
   *
   * @param options - Update options
   * @param context - Request context
   * @returns Promise resolving to updated API key
   *
   * @example
   * ```typescript
   * const result = await apiKeyService.updateApiKey(
   *   {
   *     id: 'key_123',
   *     name: 'Updated Name',
   *     permissions: {
   *       files: ['read'],
   *     },
   *   },
   *   { headers: fromNodeHeaders(req.headers) }
   * );
   * ```
   */
  async updateApiKey(
    options: UpdateAPIKeyOptions,
    context: AdapterContext
  ): Promise<AdapterResponse<APIKey>> {
    return this.adapter.updateApiKey(options, context);
  }

  /**
   * Deletes an API key.
   *
   * @param id - API key ID
   * @param context - Request context
   * @returns Promise resolving to deletion result
   *
   * @example
   * ```typescript
   * const result = await apiKeyService.deleteApiKey(
   *   'key_123',
   *   { headers: fromNodeHeaders(req.headers) }
   * );
   * ```
   */
  async deleteApiKey(
    id: string,
    context: AdapterContext
  ): Promise<AdapterResponse<{ success: boolean }>> {
    return this.adapter.deleteApiKey(id, context);
  }

  /**
   * Verifies an API key.
   *
   * @param key - API key string
   * @param context - Request context
   * @returns Promise resolving to verification result
   *
   * @example
   * ```typescript
   * const result = await apiKeyService.verifyApiKey(
   *   'ba_key_abc123...',
   *   { headers: fromNodeHeaders(req.headers) }
   * );
   *
   * if (result.success && result.data?.valid) {
   *   console.log('API key is valid:', result.data.apiKey);
   * }
   * ```
   */
  async verifyApiKey(
    key: string,
    context: AdapterContext
  ): Promise<AdapterResponse<VerifyAPIKeyResult>> {
    return this.adapter.verifyApiKey(key, context);
  }

  /**
   * Gets the underlying adapter instance.
   * Useful for advanced use cases.
   */
  getAdapter(): APIKeyAdapter {
    return this.adapter;
  }
}
