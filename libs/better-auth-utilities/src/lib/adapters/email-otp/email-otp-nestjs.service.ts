/**
 * @file libs/better-auth-utilities/src/lib/adapters/email-otp/email-otp-nestjs.service.ts
 * @description Injectable NestJS service wrapping EmailOTPAdapter for dependency injection.
 */

import { Injectable } from '@nestjs/common';
import type { AdapterContext, AdapterResponse } from '../base/plugin-adapter.interface';
import { EmailOTPAdapter, type SendVerificationOTPOptions, type SignInEmailOTPOptions, type CheckVerificationOTPOptions, type VerifyEmailOTPOptions, type ForgetPasswordEmailOTPOptions, type ResetPasswordEmailOTPOptions, type User, type Session } from './email-otp.adapter';

@Injectable()
export class EmailOTPService {
  constructor(private readonly adapter: EmailOTPAdapter) {}

  async sendVerificationOTP(
    options: SendVerificationOTPOptions,
    context?: AdapterContext
  ): Promise<AdapterResponse<{ success: boolean }>> {
    return this.adapter.sendVerificationOTP(options, context);
  }

  async signInEmailOTP(
    options: SignInEmailOTPOptions,
    context?: AdapterContext
  ): Promise<AdapterResponse<{ user: User; session: Session }>> {
    return this.adapter.signInEmailOTP(options, context);
  }

  async checkVerificationOTP(
    options: CheckVerificationOTPOptions,
    context?: AdapterContext
  ): Promise<AdapterResponse<{ valid: boolean }>> {
    return this.adapter.checkVerificationOTP(options, context);
  }

  async verifyEmailOTP(
    options: VerifyEmailOTPOptions,
    context?: AdapterContext
  ): Promise<AdapterResponse<User>> {
    return this.adapter.verifyEmailOTP(options, context);
  }

  async forgetPasswordEmailOTP(
    options: ForgetPasswordEmailOTPOptions,
    context?: AdapterContext
  ): Promise<AdapterResponse<{ success: boolean }>> {
    return this.adapter.forgetPasswordEmailOTP(options, context);
  }

  async resetPasswordEmailOTP(
    options: ResetPasswordEmailOTPOptions,
    context?: AdapterContext
  ): Promise<AdapterResponse<User>> {
    return this.adapter.resetPasswordEmailOTP(options, context);
  }

  getAdapter(): EmailOTPAdapter {
    return this.adapter;
  }
}
