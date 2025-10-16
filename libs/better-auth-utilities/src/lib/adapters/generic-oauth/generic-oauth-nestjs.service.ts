/**
 * @file libs/better-auth-utilities/src/lib/adapters/generic-oauth/generic-oauth-nestjs.service.ts
 * @description Injectable NestJS service wrapper for GenericOAuthAdapter.
 */

import { Injectable } from '@nestjs/common';
import type { AdapterResponse, AdapterContext } from '../base/plugin-adapter.interface';
import { GenericOAuthAdapter } from './generic-oauth.adapter';

/**
 * NestJS service that wraps the GenericOAuthAdapter to provide dependency injection.
 *
 * @example
 * ```typescript
 * @Controller('auth')
 * export class AuthController {
 *   constructor(private readonly genericOAuthService: GenericOAuthService) {}
 *
 *   @Post('link-oauth')
 *   async linkOAuthAccount(@Body() body, @Headers() headers) {
 *     return this.genericOAuthService.oAuth2LinkAccount(
 *       { providerId: 'google', callbackURL: '/auth/callback' },
 *       { headers }
 *     );
 *   }
 * }
 * ```
 */
@Injectable()
export class GenericOAuthService {
  constructor(private readonly adapter: GenericOAuthAdapter) {}

  /**
   * Link an OAuth account to the currently authenticated user.
   *
   * @param options - Options including providerId and callbackURL
   * @param context - Adapter context containing headers with session cookies
   * @returns The authorization URL to redirect the user to
   */
  async oAuth2LinkAccount(
    options: { providerId: string; callbackURL: string },
    context: AdapterContext
  ): Promise<AdapterResponse<{ url: string }>> {
    return this.adapter.oAuth2LinkAccount(options, context);
  }

  /**
   * Get the underlying adapter instance for advanced use cases.
   *
   * @returns The GenericOAuthAdapter instance
   */
  getAdapter(): GenericOAuthAdapter {
    return this.adapter;
  }
}
