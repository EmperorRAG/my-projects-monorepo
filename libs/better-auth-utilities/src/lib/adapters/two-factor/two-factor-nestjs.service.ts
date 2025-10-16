/**
 * @file libs/better-auth-utilities/src/lib/adapters/two-factor/two-factor-nestjs.service.ts
 * @description Injectable NestJS service wrapper for TwoFactorAdapter.
 */

import { Injectable } from '@nestjs/common';
import type { AdapterResponse, AdapterContext } from '../base/plugin-adapter.interface';
import { TwoFactorAdapter } from './two-factor.adapter';

/**
 * NestJS service that wraps the TwoFactorAdapter to provide dependency injection.
 *
 * @example
 * ```typescript
 * @Controller('auth')
 * export class AuthController {
 *   constructor(private readonly twoFactorService: TwoFactorService) {}
 *
 *   @Post('2fa/enable')
 *   async enable2FA(@Body() body, @Headers() headers) {
 *     return this.twoFactorService.enableTwoFactor(
 *       { password: body.password },
 *       { headers }
 *     );
 *   }
 *
 *   @Post('2fa/verify')
 *   async verify2FA(@Body() body, @Headers() headers) {
 *     return this.twoFactorService.verifyOTP(
 *       { code: body.code, trustDevice: body.trustDevice },
 *       { headers }
 *     );
 *   }
 * }
 * ```
 */
@Injectable()
export class TwoFactorService {
  constructor(private readonly adapter: TwoFactorAdapter) {}

  /**
   * Send a 2FA OTP to the user's email or phone.
   *
   * @param options - Options for sending the OTP
   * @param context - Adapter context containing request headers
   * @returns Result indicating whether the OTP was sent successfully
   */
  async send2FaOTP(
    options: { userId?: string },
    context: AdapterContext
  ): Promise<AdapterResponse<{ success: boolean }>> {
    return this.adapter.send2FaOTP(options, context);
  }

  /**
   * Verify a 2FA OTP or TOTP code.
   *
   * @param options - Options including the code to verify and optional trust device flag
   * @param context - Adapter context containing request headers
   * @returns The authenticated user and session if verification succeeds
   */
  async verifyOTP(
    options: { code: string; trustDevice?: boolean },
    context: AdapterContext
  ): Promise<AdapterResponse<{ user: unknown; session: unknown; trusted?: boolean }>> {
    return this.adapter.verifyOTP(options, context);
  }

  /**
   * Get the TOTP URI for setting up an authenticator app.
   *
   * @param options - Options for getting the TOTP URI
   * @param context - Adapter context containing request headers
   * @returns The TOTP URI
   */
  async getTOTPURI(
    options: { userId?: string },
    context: AdapterContext
  ): Promise<AdapterResponse<{ totpURI: string }>> {
    return this.adapter.getTOTPURI(options, context);
  }

  /**
   * Enable two-factor authentication for the authenticated user.
   *
   * @param options - Options including the user's password
   * @param context - Adapter context containing request headers with session cookies
   * @returns The TOTP URI and backup codes
   */
  async enableTwoFactor(
    options: { password: string },
    context: AdapterContext
  ): Promise<AdapterResponse<{ totpURI: string; backupCodes: string[] }>> {
    return this.adapter.enableTwoFactor(options, context);
  }

  /**
   * Disable two-factor authentication for the authenticated user.
   *
   * @param options - Options including the user's password
   * @param context - Adapter context containing request headers with session cookies
   * @returns Result indicating whether 2FA was successfully disabled
   */
  async disableTwoFactor(
    options: { password: string },
    context: AdapterContext
  ): Promise<AdapterResponse<{ success: boolean }>> {
    return this.adapter.disableTwoFactor(options, context);
  }

  /**
   * Generate new backup codes for the authenticated user.
   *
   * @param context - Adapter context containing request headers with session cookies
   * @returns Array of new backup codes
   */
  async generateBackupCodes(context: AdapterContext): Promise<AdapterResponse<{ backupCodes: string[] }>> {
    return this.adapter.generateBackupCodes(context);
  }

  /**
   * View existing backup codes for the authenticated user.
   *
   * @param context - Adapter context containing request headers with session cookies
   * @returns Array of existing backup codes
   */
  async viewBackupCodes(context: AdapterContext): Promise<AdapterResponse<{ backupCodes: string[] }>> {
    return this.adapter.viewBackupCodes(context);
  }

  /**
   * Get the underlying adapter instance for advanced use cases.
   *
   * @returns The TwoFactorAdapter instance
   */
  getAdapter(): TwoFactorAdapter {
    return this.adapter;
  }
}
