/**
 * @file libs/better-auth-utilities/src/lib/adapters/email-otp/email-otp.adapter.ts
 * @description Email OTP plugin adapter for NestJS integration with better-auth.
 *
 * The Email OTP plugin enables One-Time Password (OTP) authentication via email.
 * Users can sign in, verify their email, or reset their password using OTPs sent to their email address.
 *
 * **Server API Methods:**
 * - `sendVerificationOTP`: Sends an OTP to a user's email for sign-in, email verification, or password reset
 * - `signInEmailOTP`: Authenticates a user with their email and OTP (auto-registers if not exists)
 * - `checkVerificationOTP`: Validates an OTP without signing in (useful for pre-validation)
 * - `verifyEmailOTP`: Verifies a user's email address using an OTP
 * - `forgetPasswordEmailOTP`: Initiates the password reset process by sending an OTP
 * - `resetPasswordEmailOTP`: Completes password reset using email + OTP + new password
 *
 * @see https://better-auth.com/docs/plugins/email-otp
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
  emailVerified: boolean;
  name: string;
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

export type OTPType = 'sign-in' | 'email-verification' | 'forget-password';

export interface SendVerificationOTPOptions {
  email: string;
  type: OTPType;
}

export interface SignInEmailOTPOptions {
  email: string;
  otp: string;
}

export interface CheckVerificationOTPOptions {
  email: string;
  type: OTPType;
  otp: string;
}

export interface VerifyEmailOTPOptions {
  email: string;
  otp: string;
}

export interface ForgetPasswordEmailOTPOptions {
  email: string;
}

export interface ResetPasswordEmailOTPOptions {
  email: string;
  otp: string;
  password: string;
}

export interface EmailOTPServerAPI {
  sendVerificationOTP(
    options: SendVerificationOTPOptions & { headers?: Headers | Record<string, string> }
  ): Promise<{ data?: { success: boolean }; error?: unknown }>;

  signInEmailOTP(
    options: SignInEmailOTPOptions & { headers?: Headers | Record<string, string> }
  ): Promise<{ data?: { user: User; session: Session }; error?: unknown }>;

  checkVerificationOTP(
    options: CheckVerificationOTPOptions & { headers?: Headers | Record<string, string> }
  ): Promise<{ data?: { valid: boolean }; error?: unknown }>;

  verifyEmailOTP(
    options: VerifyEmailOTPOptions & { headers?: Headers | Record<string, string> }
  ): Promise<{ data?: User; error?: unknown }>;

  forgetPasswordEmailOTP(
    options: ForgetPasswordEmailOTPOptions & { headers?: Headers | Record<string, string> }
  ): Promise<{ data?: { success: boolean }; error?: unknown }>;

  resetPasswordEmailOTP(
    options: ResetPasswordEmailOTPOptions & { headers?: Headers | Record<string, string> }
  ): Promise<{ data?: User; error?: unknown }>;
}

// ============================================================================
// EMAIL OTP ADAPTER
// ============================================================================

/**
 * Email OTP adapter for better-auth NestJS integration.
 *
 * This adapter wraps the better-auth Email OTP plugin's server API methods,
 * providing a type-safe interface for email-based One-Time Password authentication.
 *
 * **Configuration:**
 * The Email OTP plugin requires a `sendVerificationOTP` function in the server config:
 * ```typescript
 * emailOTP({
 *   async sendVerificationOTP({ email, otp, type }) {
 *     if (type === "sign-in") {
 *       // Send OTP for sign-in
 *     } else if (type === "email-verification") {
 *       // Send OTP for email verification
 *     } else {
 *       // Send OTP for password reset
 *     }
 *   },
 * })
 * ```
 */
export class EmailOTPAdapter implements PluginAdapter<EmailOTPServerAPI> {
  public readonly pluginId = 'email-otp';
  public readonly pluginName = 'Email OTP';
  public readonly api: EmailOTPServerAPI;

  private readonly auth: ReturnType<typeof betterAuth>;
  private readonly debug: boolean;

  constructor(config: AdapterConfig) {
    this.auth = config.auth;
    this.debug = config.debug ?? false;
    this.api = this.auth.api as unknown as EmailOTPServerAPI;

    if (this.debug) {
      console.log(`[EmailOTPAdapter] Initialized for plugin "${this.pluginName}"`);
    }
  }

  public isAvailable(): boolean {
    try {
      // Check if the API object exists and has the expected methods
      return !!(
        this.api &&
        typeof this.api === 'object' &&
        'sendVerificationOTP' in this.api
      );
    } catch {
      return false;
    }
  }

  public async sendVerificationOTP(
    options: SendVerificationOTPOptions,
    context?: AdapterContext
  ): Promise<AdapterResponse<{ success: boolean }>> {
    const operation = 'sendVerificationOTP';

    if (!this.isAvailable()) {
      throw new PluginNotAvailableError(
        this.pluginName,
        'Plugin not properly configured or not enabled'
      );
    }

    try {
      if (this.debug) {
        console.log(`[EmailOTPAdapter] ${operation}`, options);
      }

      const result = await this.api.sendVerificationOTP({
        ...options,
        headers: context?.headers as Headers | Record<string, string>,
      });

      if (result.error) {
        throw new AdapterOperationError(operation, String(result.error), result.error);
      }

      return {
        data: result.data,
        success: true,
        message: 'Verification OTP sent successfully',
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

  public async signInEmailOTP(
    options: SignInEmailOTPOptions,
    context?: AdapterContext
  ): Promise<AdapterResponse<{ user: User; session: Session }>> {
    const operation = 'signInEmailOTP';

    if (!this.isAvailable()) {
      throw new PluginNotAvailableError(
        this.pluginName,
        'Plugin not properly configured or not enabled'
      );
    }

    try {
      if (this.debug) {
        console.log(`[EmailOTPAdapter] ${operation}`, { email: options.email });
      }

      const result = await this.api.signInEmailOTP({
        ...options,
        headers: context?.headers as Headers | Record<string, string>,
      });

      if (result.error) {
        throw new AdapterOperationError(operation, String(result.error), result.error);
      }

      return {
        data: result.data,
        success: true,
        message: 'Signed in successfully with email OTP',
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

  public async checkVerificationOTP(
    options: CheckVerificationOTPOptions,
    context?: AdapterContext
  ): Promise<AdapterResponse<{ valid: boolean }>> {
    const operation = 'checkVerificationOTP';

    if (!this.isAvailable()) {
      throw new PluginNotAvailableError(
        this.pluginName,
        'Plugin not properly configured or not enabled'
      );
    }

    try {
      if (this.debug) {
        console.log(`[EmailOTPAdapter] ${operation}`, { email: options.email, type: options.type });
      }

      const result = await this.api.checkVerificationOTP({
        ...options,
        headers: context?.headers as Headers | Record<string, string>,
      });

      if (result.error) {
        throw new AdapterOperationError(operation, String(result.error), result.error);
      }

      return {
        data: result.data,
        success: true,
        message: 'OTP validation completed',
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

  public async verifyEmailOTP(
    options: VerifyEmailOTPOptions,
    context?: AdapterContext
  ): Promise<AdapterResponse<User>> {
    const operation = 'verifyEmailOTP';

    if (!this.isAvailable()) {
      throw new PluginNotAvailableError(
        this.pluginName,
        'Plugin not properly configured or not enabled'
      );
    }

    try {
      if (this.debug) {
        console.log(`[EmailOTPAdapter] ${operation}`, { email: options.email });
      }

      const result = await this.api.verifyEmailOTP({
        ...options,
        headers: context?.headers as Headers | Record<string, string>,
      });

      if (result.error) {
        throw new AdapterOperationError(operation, String(result.error), result.error);
      }

      return {
        data: result.data,
        success: true,
        message: 'Email verified successfully',
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

  public async forgetPasswordEmailOTP(
    options: ForgetPasswordEmailOTPOptions,
    context?: AdapterContext
  ): Promise<AdapterResponse<{ success: boolean }>> {
    const operation = 'forgetPasswordEmailOTP';

    if (!this.isAvailable()) {
      throw new PluginNotAvailableError(
        this.pluginName,
        'Plugin not properly configured or not enabled'
      );
    }

    try {
      if (this.debug) {
        console.log(`[EmailOTPAdapter] ${operation}`, options);
      }

      const result = await this.api.forgetPasswordEmailOTP({
        ...options,
        headers: context?.headers as Headers | Record<string, string>,
      });

      if (result.error) {
        throw new AdapterOperationError(operation, String(result.error), result.error);
      }

      return {
        data: result.data,
        success: true,
        message: 'Password reset OTP sent successfully',
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

  public async resetPasswordEmailOTP(
    options: ResetPasswordEmailOTPOptions,
    context?: AdapterContext
  ): Promise<AdapterResponse<User>> {
    const operation = 'resetPasswordEmailOTP';

    if (!this.isAvailable()) {
      throw new PluginNotAvailableError(
        this.pluginName,
        'Plugin not properly configured or not enabled'
      );
    }

    try {
      if (this.debug) {
        console.log(`[EmailOTPAdapter] ${operation}`, { email: options.email });
      }

      const result = await this.api.resetPasswordEmailOTP({
        ...options,
        headers: context?.headers as Headers | Record<string, string>,
      });

      if (result.error) {
        throw new AdapterOperationError(operation, String(result.error), result.error);
      }

      return {
        data: result.data,
        success: true,
        message: 'Password reset successfully',
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
