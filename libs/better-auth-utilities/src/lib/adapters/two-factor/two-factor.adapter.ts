/**
 * @file libs/better-auth-utilities/src/lib/adapters/two-factor/two-factor.adapter.ts
 * @description Server API adapter for better-auth Two-Factor Authentication plugin.
 *
 * This adapter provides methods for implementing Two-Factor Authentication (2FA) in your NestJS application.
 * It supports both TOTP (Time-based One-Time Password) for authenticator apps and OTP (One-Time Password)
 * sent via email or SMS. The plugin also includes backup codes for account recovery and trusted device management.
 *
 * **Key Features:**
 * - TOTP support for authenticator apps (Google Authenticator, Authy, etc.)
 * - OTP support for email/SMS-based 2FA
 * - Backup codes for account recovery
 * - Trusted device management (30-day trust period)
 * - Password verification for sensitive operations (enable/disable 2FA)
 *
 * **Configuration Example:**
 * ```typescript
 * import { betterAuth } from 'better-auth';
 * import { twoFactor } from 'better-auth/plugins';
 *
 * export const auth = betterAuth({
 *   plugins: [
 *     twoFactor({
 *       // Optional: Custom issuer name for TOTP
 *       issuer: 'My App',
 *       // Optional: Custom OTP send function (for email/SMS)
 *       sendOTP: async ({ user, otp }) => {
 *         await emailService.send({
 *           to: user.email,
 *           subject: 'Your 2FA Code',
 *           text: `Your verification code is: ${otp}`
 *         });
 *       },
 *       // Optional: Trusted device cookie settings
 *       trustedDeviceCookieName: 'trusted-device',
 *       // Optional: Skip 2FA verification for trusted devices (default: false)
 *       skipVerificationOnTrustedDevice: false,
 *     }),
 *   ],
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Enable TOTP-based 2FA
 * const enableResult = await twoFactorAdapter.enableTwoFactor(
 *   { password: 'user-password' },
 *   { headers: { cookie: 'session-cookie' } }
 * );
 * if (enableResult.success) {
 *   // Display TOTP URI as QR code to user
 *   console.log(enableResult.data.totpURI);
 *   // Save backup codes securely
 *   console.log(enableResult.data.backupCodes);
 * }
 *
 * // Verify OTP during login
 * const verifyResult = await twoFactorAdapter.verifyOTP(
 *   { code: '123456' },
 *   { headers: { cookie: 'session-cookie' } }
 * );
 * if (verifyResult.success) {
 *   console.log('2FA verification successful');
 * }
 * ```
 */

import type {
  PluginAdapter,
  AdapterConfig,
  AdapterContext,
  AdapterResponse,
} from '../base/plugin-adapter.interface';
import { AdapterOperationError } from '../base/plugin-adapter.interface';

/**
 * User model from better-auth
 */
interface User {
  id: string;
  email: string;
  name: string;
  [key: string]: unknown;
}

/**
 * Session model from better-auth
 */
interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
  [key: string]: unknown;
}

/**
 * Options for sending a 2FA OTP (email/SMS)
 */
interface Send2FaOTPOptions {
  /** Optional user ID if known */
  userId?: string;
}

/**
 * Result of sending a 2FA OTP
 */
interface Send2FaOTPResult {
  /** Whether the OTP was successfully sent */
  success: boolean;
}

/**
 * Options for verifying a 2FA OTP or TOTP code
 */
interface VerifyOTPOptions {
  /** The OTP or TOTP code to verify */
  code: string;
  /** Optional: Trust this device for 30 days */
  trustDevice?: boolean;
}

/**
 * Result of verifying a 2FA OTP or TOTP code
 */
interface VerifyOTPResult {
  /** The authenticated user */
  user: User;
  /** The session created after successful verification */
  session: Session;
  /** Whether the device was trusted */
  trusted?: boolean;
}

/**
 * Options for getting the TOTP URI
 */
interface GetTOTPURIOptions {
  /** Optional: User ID if authenticating a specific user */
  userId?: string;
}

/**
 * Result of getting the TOTP URI
 */
interface GetTOTPURIResult {
  /** The TOTP URI to display as a QR code */
  totpURI: string;
}

/**
 * Options for enabling two-factor authentication
 */
interface EnableTwoFactorOptions {
  /** The user's password for verification */
  password: string;
}

/**
 * Result of enabling two-factor authentication
 */
interface EnableTwoFactorResult {
  /** The TOTP URI to display as a QR code */
  totpURI: string;
  /** Array of backup codes for account recovery */
  backupCodes: string[];
}

/**
 * Options for disabling two-factor authentication
 */
interface DisableTwoFactorOptions {
  /** The user's password for verification */
  password: string;
}

/**
 * Result of disabling two-factor authentication
 */
interface DisableTwoFactorResult {
  /** Whether 2FA was successfully disabled */
  success: boolean;
}

/**
 * Result of generating new backup codes
 */
interface GenerateBackupCodesResult {
  /** Array of new backup codes */
  backupCodes: string[];
}

/**
 * Result of viewing existing backup codes
 */
interface ViewBackupCodesResult {
  /** Array of existing backup codes */
  backupCodes: string[];
}

/**
 * Server API methods for the Two-Factor Authentication plugin.
 *
 * This interface defines all server-side operations available for 2FA management.
 */
interface TwoFactorServerAPI {
  /**
   * Send a 2FA OTP to the user's email or phone.
   *
   * This method initiates the OTP-based 2FA flow by sending a one-time password
   * to the user through the configured channel (email or SMS).
   *
   * @param options - Options for sending the OTP
   * @param context - Adapter context containing request headers
   * @returns Result indicating whether the OTP was sent successfully
   */
  send2FaOTP: (options: Send2FaOTPOptions, context: AdapterContext) => Promise<Send2FaOTPResult>;

  /**
   * Verify a 2FA OTP or TOTP code.
   *
   * This method verifies the code provided by the user during 2FA authentication.
   * It works with both OTP codes (sent via email/SMS) and TOTP codes (from authenticator apps).
   *
   * @param options - Options including the code to verify and optional trust device flag
   * @param context - Adapter context containing request headers
   * @returns The authenticated user and session if verification succeeds
   */
  verifyOTP: (options: VerifyOTPOptions, context: AdapterContext) => Promise<VerifyOTPResult>;

  /**
   * Get the TOTP URI for setting up an authenticator app.
   *
   * This method generates a TOTP URI that can be displayed as a QR code for users
   * to scan with authenticator apps like Google Authenticator or Authy.
   *
   * @param options - Options for getting the TOTP URI
   * @param context - Adapter context containing request headers
   * @returns The TOTP URI
   */
  getTOTPURI: (options: GetTOTPURIOptions, context: AdapterContext) => Promise<GetTOTPURIResult>;

  /**
   * Enable two-factor authentication for the authenticated user.
   *
   * This method enables 2FA and returns the TOTP URI and backup codes. The user's
   * password is required for security verification.
   *
   * @param options - Options including the user's password
   * @param context - Adapter context containing request headers with session cookies
   * @returns The TOTP URI and backup codes
   */
  enableTwoFactor: (options: EnableTwoFactorOptions, context: AdapterContext) => Promise<EnableTwoFactorResult>;

  /**
   * Disable two-factor authentication for the authenticated user.
   *
   * This method disables 2FA for the user. The user's password is required
   * for security verification.
   *
   * @param options - Options including the user's password
   * @param context - Adapter context containing request headers with session cookies
   * @returns Result indicating whether 2FA was successfully disabled
   */
  disableTwoFactor: (options: DisableTwoFactorOptions, context: AdapterContext) => Promise<DisableTwoFactorResult>;

  /**
   * Generate new backup codes for the authenticated user.
   *
   * This method generates a fresh set of backup codes, invalidating any previous codes.
   * Backup codes can be used to access the account if the primary 2FA method is unavailable.
   *
   * @param context - Adapter context containing request headers with session cookies
   * @returns Array of new backup codes
   */
  generateBackupCodes: (context: AdapterContext) => Promise<GenerateBackupCodesResult>;

  /**
   * View existing backup codes for the authenticated user.
   *
   * This method retrieves the user's current backup codes. Each backup code
   * can only be used once.
   *
   * @param context - Adapter context containing request headers with session cookies
   * @returns Array of existing backup codes
   */
  viewBackupCodes: (context: AdapterContext) => Promise<ViewBackupCodesResult>;
}

/**
 * Adapter for better-auth Two-Factor Authentication plugin.
 *
 * This adapter wraps the better-auth Two-Factor Authentication plugin's server API methods,
 * providing type-safe access with NestJS dependency injection support.
 *
 * @example
 * ```typescript
 * const twoFactorAdapter = new TwoFactorAdapter({
 *   auth: betterAuthInstance,
 *   debug: true,
 * });
 *
 * // Enable 2FA
 * const enableResult = await twoFactorAdapter.enableTwoFactor(
 *   { password: 'user-password' },
 *   { headers: { cookie: 'session-cookie' } }
 * );
 *
 * // Verify OTP
 * const verifyResult = await twoFactorAdapter.verifyOTP(
 *   { code: '123456', trustDevice: true },
 *   { headers: { cookie: 'session-cookie' } }
 * );
 * ```
 */
export class TwoFactorAdapter implements PluginAdapter<TwoFactorServerAPI> {
  public readonly pluginId: string = 'two-factor';
  public readonly pluginName: string = 'Two-Factor Authentication Adapter';
  public readonly api: TwoFactorServerAPI;

  private readonly auth: AdapterConfig['auth'];
  private readonly debug: boolean;

  constructor(config: AdapterConfig) {
    this.auth = config.auth;
    this.debug = config.debug ?? false;

    // Initialize server API from better-auth instance
    this.api = this.auth.api as unknown as TwoFactorServerAPI;

    if (this.debug) {
      console.log('[TwoFactorAdapter] Initialized with config:', {
        pluginId: this.pluginId,
        hasAuth: !!this.auth,
        hasAPI: !!this.api,
      });
    }
  }

  /**
   * Check if the Two-Factor Authentication plugin is available in the better-auth instance.
   *
   * @returns True if the plugin is available, false otherwise
   */
  public isAvailable(): boolean {
    const available =
      'send2FaOTP' in this.api &&
      'verifyOTP' in this.api &&
      'getTOTPURI' in this.api &&
      'enableTwoFactor' in this.api &&
      'disableTwoFactor' in this.api &&
      'generateBackupCodes' in this.api &&
      'viewBackupCodes' in this.api;

    if (this.debug) {
      console.log('[TwoFactorAdapter] Plugin availability check:', available);
    }

    return available;
  }

  /**
   * Send a 2FA OTP to the user's email or phone.
   *
   * @param options - Options for sending the OTP
   * @param context - Adapter context containing request headers
   * @returns Result indicating whether the OTP was sent successfully
   */
  async send2FaOTP(options: Send2FaOTPOptions, context: AdapterContext): Promise<AdapterResponse<Send2FaOTPResult>> {
    try {
      if (this.debug) {
        console.log('[TwoFactorAdapter] send2FaOTP called with options:', options);
      }

      const result = await this.api.send2FaOTP(options, context);

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new AdapterOperationError('send2FaOTP', 'Failed to send 2FA OTP', error);
    }
  }

  /**
   * Verify a 2FA OTP or TOTP code.
   *
   * @param options - Options including the code to verify and optional trust device flag
   * @param context - Adapter context containing request headers
   * @returns The authenticated user and session if verification succeeds
   */
  async verifyOTP(options: VerifyOTPOptions, context: AdapterContext): Promise<AdapterResponse<VerifyOTPResult>> {
    try {
      if (this.debug) {
        console.log('[TwoFactorAdapter] verifyOTP called with options:', options);
      }

      const result = await this.api.verifyOTP(options, context);

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new AdapterOperationError('verifyOTP', 'Failed to verify OTP', error);
    }
  }

  /**
   * Get the TOTP URI for setting up an authenticator app.
   *
   * @param options - Options for getting the TOTP URI
   * @param context - Adapter context containing request headers
   * @returns The TOTP URI
   */
  async getTOTPURI(options: GetTOTPURIOptions, context: AdapterContext): Promise<AdapterResponse<GetTOTPURIResult>> {
    try {
      if (this.debug) {
        console.log('[TwoFactorAdapter] getTOTPURI called with options:', options);
      }

      const result = await this.api.getTOTPURI(options, context);

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new AdapterOperationError('getTOTPURI', 'Failed to get TOTP URI', error);
    }
  }

  /**
   * Enable two-factor authentication for the authenticated user.
   *
   * @param options - Options including the user's password
   * @param context - Adapter context containing request headers with session cookies
   * @returns The TOTP URI and backup codes
   */
  async enableTwoFactor(
    options: EnableTwoFactorOptions,
    context: AdapterContext
  ): Promise<AdapterResponse<EnableTwoFactorResult>> {
    try {
      if (this.debug) {
        console.log('[TwoFactorAdapter] enableTwoFactor called');
      }

      const result = await this.api.enableTwoFactor(options, context);

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new AdapterOperationError('enableTwoFactor', 'Failed to enable two-factor authentication', error);
    }
  }

  /**
   * Disable two-factor authentication for the authenticated user.
   *
   * @param options - Options including the user's password
   * @param context - Adapter context containing request headers with session cookies
   * @returns Result indicating whether 2FA was successfully disabled
   */
  async disableTwoFactor(
    options: DisableTwoFactorOptions,
    context: AdapterContext
  ): Promise<AdapterResponse<DisableTwoFactorResult>> {
    try {
      if (this.debug) {
        console.log('[TwoFactorAdapter] disableTwoFactor called');
      }

      const result = await this.api.disableTwoFactor(options, context);

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new AdapterOperationError('disableTwoFactor', 'Failed to disable two-factor authentication', error);
    }
  }

  /**
   * Generate new backup codes for the authenticated user.
   *
   * @param context - Adapter context containing request headers with session cookies
   * @returns Array of new backup codes
   */
  async generateBackupCodes(context: AdapterContext): Promise<AdapterResponse<GenerateBackupCodesResult>> {
    try {
      if (this.debug) {
        console.log('[TwoFactorAdapter] generateBackupCodes called');
      }

      const result = await this.api.generateBackupCodes(context);

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new AdapterOperationError('generateBackupCodes', 'Failed to generate backup codes', error);
    }
  }

  /**
   * View existing backup codes for the authenticated user.
   *
   * @param context - Adapter context containing request headers with session cookies
   * @returns Array of existing backup codes
   */
  async viewBackupCodes(context: AdapterContext): Promise<AdapterResponse<ViewBackupCodesResult>> {
    try {
      if (this.debug) {
        console.log('[TwoFactorAdapter] viewBackupCodes called');
      }

      const result = await this.api.viewBackupCodes(context);

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new AdapterOperationError('viewBackupCodes', 'Failed to view backup codes', error);
    }
  }
}
