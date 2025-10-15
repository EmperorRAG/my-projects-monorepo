/**
 * @module phone-number.utils
 * @description Utilities for the better-auth Phone Number plugin using Effect-TS.
 */

import { Effect } from 'effect';

export class PhoneNumberError extends Error {
  readonly _tag = 'PhoneNumberError';
  constructor(message: string, public override readonly cause?: unknown) {
    super(message);
    this.name = 'PhoneNumberError';
  }
}

export interface PhoneNumberConfig {
  readonly baseUrl: string;
  readonly sendOTPEndpoint?: string;
  readonly verifyOTPEndpoint?: string;
}

export interface SendOTPResponse {
  readonly sent: boolean;
  readonly phoneNumber: string;
}

export interface VerifyOTPResponse {
  readonly verified: boolean;
  readonly session?: {
    readonly userId: string;
    readonly sessionId: string;
  };
}

export const buildSendOTPUrl = (config: PhoneNumberConfig): string =>
  `${config.baseUrl}${config.sendOTPEndpoint || '/api/auth/phone-number/send-otp'}`;

export const buildVerifyOTPUrl = (config: PhoneNumberConfig): string =>
  `${config.baseUrl}${config.verifyOTPEndpoint || '/api/auth/phone-number/verify-otp'}`;

/**
 * Sends an OTP to a phone number.
 *
 * @param phoneNumber - The phone number to send OTP to.
 * @param config - Configuration for the API endpoint.
 * @returns {Effect.Effect<SendOTPResponse, PhoneNumberError>} Effect with send result.
 *
 * @example
 * const result = await Effect.runPromise(
 *   sendPhoneOTP('+1234567890', { baseUrl: 'http://localhost:3000' })
 * );
 */
export const sendPhoneOTP = (
  phoneNumber: string,
  config: PhoneNumberConfig
): Effect.Effect<SendOTPResponse, PhoneNumberError> =>
  Effect.gen(function* () {
    if (!phoneNumber || phoneNumber.trim().length === 0) {
      return yield* Effect.fail(new PhoneNumberError('Phone number is required'));
    }

    const url = buildSendOTPUrl(config);
    const response = yield* Effect.tryPromise({
      try: () =>
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ phoneNumber }),
        }),
      catch: (error) => new PhoneNumberError(`Failed to send OTP to ${url}`, error),
    });

    if (!response.ok) {
      const errorText = yield* Effect.tryPromise({
        try: () => response.text(),
        catch: () => new PhoneNumberError('Failed to read error response'),
      });
      return yield* Effect.fail(
        new PhoneNumberError(`Send OTP failed with status ${response.status}: ${errorText}`)
      );
    }

    const result = yield* Effect.tryPromise({
      try: () => response.json() as Promise<SendOTPResponse>,
      catch: (error) => new PhoneNumberError('Failed to parse send response', error),
    });

    return result;
  });

/**
 * Verifies an OTP code for phone number authentication.
 *
 * @param phoneNumber - The phone number.
 * @param code - The OTP code.
 * @param config - Configuration for the API endpoint.
 * @returns {Effect.Effect<VerifyOTPResponse, PhoneNumberError>} Effect with verification result.
 *
 * @example
 * const result = await Effect.runPromise(
 *   verifyPhoneOTP('+1234567890', '123456', { baseUrl: 'http://localhost:3000' })
 * );
 */
export const verifyPhoneOTP = (
  phoneNumber: string,
  code: string,
  config: PhoneNumberConfig
): Effect.Effect<VerifyOTPResponse, PhoneNumberError> =>
  Effect.gen(function* () {
    if (!phoneNumber || !code) {
      return yield* Effect.fail(new PhoneNumberError('Phone number and code are required'));
    }

    const url = buildVerifyOTPUrl(config);
    const response = yield* Effect.tryPromise({
      try: () =>
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ phoneNumber, code }),
        }),
      catch: (error) => new PhoneNumberError(`Failed to verify OTP at ${url}`, error),
    });

    if (!response.ok) {
      const errorText = yield* Effect.tryPromise({
        try: () => response.text(),
        catch: () => new PhoneNumberError('Failed to read error response'),
      });
      return yield* Effect.fail(
        new PhoneNumberError(`Verify OTP failed with status ${response.status}: ${errorText}`)
      );
    }

    const result = yield* Effect.tryPromise({
      try: () => response.json() as Promise<VerifyOTPResponse>,
      catch: (error) => new PhoneNumberError('Failed to parse verify response', error),
    });

    return result;
  });
