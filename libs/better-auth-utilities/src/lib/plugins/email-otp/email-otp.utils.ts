/**
 * @module email-otp.utils
 * @description Utilities for the better-auth Email OTP plugin using Effect-TS.
 */

import { Effect } from 'effect';

export class EmailOTPError extends Error {
  readonly _tag = 'EmailOTPError';
  constructor(message: string, public override readonly cause?: unknown) {
    super(message);
    this.name = 'EmailOTPError';
  }
}

export interface EmailOTPConfig {
  readonly baseUrl: string;
  readonly sendEndpoint?: string;
  readonly verifyEndpoint?: string;
}

export interface SendEmailOTPResponse {
  readonly sent: boolean;
  readonly email: string;
}

export interface VerifyEmailOTPResponse {
  readonly verified: boolean;
  readonly session?: {
    readonly userId: string;
    readonly sessionId: string;
  };
}

export const buildSendEmailOTPUrl = (config: EmailOTPConfig): string =>
  `${config.baseUrl}${config.sendEndpoint || '/api/auth/email-otp/send'}`;

export const buildVerifyEmailOTPUrl = (config: EmailOTPConfig): string =>
  `${config.baseUrl}${config.verifyEndpoint || '/api/auth/email-otp/verify'}`;

/**
 * Sends an OTP to an email address.
 *
 * @param email - The email address to send OTP to.
 * @param config - Configuration for the API endpoint.
 * @returns {Effect.Effect<SendEmailOTPResponse, EmailOTPError>} Effect with send result.
 *
 * @example
 * const result = await Effect.runPromise(
 *   sendEmailOTP('user@example.com', { baseUrl: 'http://localhost:3000' })
 * );
 */
export const sendEmailOTP = (
  email: string,
  config: EmailOTPConfig
): Effect.Effect<SendEmailOTPResponse, EmailOTPError> =>
  Effect.gen(function* () {
    if (!email || email.trim().length === 0) {
      return yield* Effect.fail(new EmailOTPError('Email is required'));
    }

    const url = buildSendEmailOTPUrl(config);
    const response = yield* Effect.tryPromise({
      try: () =>
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email }),
        }),
      catch: (error) => new EmailOTPError(`Failed to send OTP to ${url}`, error),
    });

    if (!response.ok) {
      const errorText = yield* Effect.tryPromise({
        try: () => response.text(),
        catch: () => new EmailOTPError('Failed to read error response'),
      });
      return yield* Effect.fail(
        new EmailOTPError(`Send OTP failed with status ${response.status}: ${errorText}`)
      );
    }

    const result = yield* Effect.tryPromise({
      try: () => response.json() as Promise<SendEmailOTPResponse>,
      catch: (error) => new EmailOTPError('Failed to parse send response', error),
    });

    return result;
  });

/**
 * Verifies an OTP code for email authentication.
 *
 * @param email - The email address.
 * @param code - The OTP code.
 * @param config - Configuration for the API endpoint.
 * @returns {Effect.Effect<VerifyEmailOTPResponse, EmailOTPError>} Effect with verification result.
 *
 * @example
 * const result = await Effect.runPromise(
 *   verifyEmailOTP('user@example.com', '123456', { baseUrl: 'http://localhost:3000' })
 * );
 */
export const verifyEmailOTP = (
  email: string,
  code: string,
  config: EmailOTPConfig
): Effect.Effect<VerifyEmailOTPResponse, EmailOTPError> =>
  Effect.gen(function* () {
    if (!email || !code) {
      return yield* Effect.fail(new EmailOTPError('Email and code are required'));
    }

    const url = buildVerifyEmailOTPUrl(config);
    const response = yield* Effect.tryPromise({
      try: () =>
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email, code }),
        }),
      catch: (error) => new EmailOTPError(`Failed to verify OTP at ${url}`, error),
    });

    if (!response.ok) {
      const errorText = yield* Effect.tryPromise({
        try: () => response.text(),
        catch: () => new EmailOTPError('Failed to read error response'),
      });
      return yield* Effect.fail(
        new EmailOTPError(`Verify OTP failed with status ${response.status}: ${errorText}`)
      );
    }

    const result = yield* Effect.tryPromise({
      try: () => response.json() as Promise<VerifyEmailOTPResponse>,
      catch: (error) => new EmailOTPError('Failed to parse verify response', error),
    });

    return result;
  });
