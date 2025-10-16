/**
 * @module two-factor.utils
 * @description Provides utilities for interacting with the `better-auth` Two-Factor Authentication plugin.
 * These functions are designed using the Effect-TS functional programming paradigm and provide server API
 * functionality for enabling, disabling, and verifying two-factor authentication.
 */

import { Effect } from 'effect';

// ============================================================================
// Custom Error Classes
// ============================================================================

/**
 * Error thrown when two-factor enable operation fails.
 */
export class TwoFactorEnableError extends Error {
  readonly _tag = 'TwoFactorEnableError';

  constructor(
    message: string,
    public override readonly cause?: unknown
  ) {
    super(message);
    this.name = 'TwoFactorEnableError';
  }
}

/**
 * Error thrown when two-factor disable operation fails.
 */
export class TwoFactorDisableError extends Error {
  readonly _tag = 'TwoFactorDisableError';

  constructor(
    message: string,
    public override readonly cause?: unknown
  ) {
    super(message);
    this.name = 'TwoFactorDisableError';
  }
}

/**
 * Error thrown when two-factor verification fails.
 */
export class TwoFactorVerificationError extends Error {
  readonly _tag = 'TwoFactorVerificationError';

  constructor(
    message: string,
    public override readonly cause?: unknown
  ) {
    super(message);
    this.name = 'TwoFactorVerificationError';
  }
}

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Options for enabling two-factor authentication.
 */
export interface EnableTwoFactorOptions {
  readonly password: string;
}

/**
 * Response from enabling two-factor authentication.
 */
export interface EnableTwoFactorResponse {
  readonly secret: string;
  readonly qrCode: string;
  readonly backupCodes: readonly string[];
}

/**
 * Options for verifying two-factor code during setup.
 */
export interface VerifyTwoFactorSetupOptions {
  readonly code: string;
}

/**
 * Options for verifying two-factor code during login.
 */
export interface VerifyTwoFactorCodeOptions {
  readonly code: string;
}

/**
 * Configuration for two-factor operations.
 */
export interface TwoFactorConfig {
  readonly baseUrl: string;
  readonly enableEndpoint?: string;
  readonly disableEndpoint?: string;
  readonly verifyEndpoint?: string;
}

/**
 * Result of two-factor verification.
 */
export interface TwoFactorVerificationResult {
  readonly verified: boolean;
  readonly session?: {
    readonly userId: string;
    readonly sessionId: string;
  };
}

// ============================================================================
// Supporting Utilities
// ============================================================================

/**
 * Builds the URL for the two-factor enable endpoint.
 *
 * @pure
 * @description Constructs the full URL for the better-auth two-factor enable endpoint.
 *
 * @fp-pattern Pure function
 * @composition N/A - Single operation
 *
 * @param config - Configuration containing the base URL and optional enable endpoint.
 * @returns {string} The complete URL for the enable endpoint.
 *
 * @example
 * const url = buildEnableUrl({ baseUrl: 'http://localhost:3000' });
 * // => 'http://localhost:3000/api/auth/two-factor/enable'
 */
export const buildEnableUrl = (config: TwoFactorConfig): string => {
  const endpoint = config.enableEndpoint || '/api/auth/two-factor/enable';
  return `${config.baseUrl}${endpoint}`;
};

/**
 * Builds the URL for the two-factor disable endpoint.
 *
 * @pure
 * @description Constructs the full URL for the better-auth two-factor disable endpoint.
 *
 * @fp-pattern Pure function
 * @composition N/A - Single operation
 *
 * @param config - Configuration containing the base URL and optional disable endpoint.
 * @returns {string} The complete URL for the disable endpoint.
 *
 * @example
 * const url = buildDisableUrl({ baseUrl: 'http://localhost:3000' });
 * // => 'http://localhost:3000/api/auth/two-factor/disable'
 */
export const buildDisableUrl = (config: TwoFactorConfig): string => {
  const endpoint = config.disableEndpoint || '/api/auth/two-factor/disable';
  return `${config.baseUrl}${endpoint}`;
};

/**
 * Builds the URL for the two-factor verification endpoint.
 *
 * @pure
 * @description Constructs the full URL for the better-auth two-factor verification endpoint.
 *
 * @fp-pattern Pure function
 * @composition N/A - Single operation
 *
 * @param config - Configuration containing the base URL and optional verify endpoint.
 * @returns {string} The complete URL for the verification endpoint.
 *
 * @example
 * const url = buildVerifyUrl({ baseUrl: 'http://localhost:3000' });
 * // => 'http://localhost:3000/api/auth/two-factor/verify'
 */
export const buildVerifyUrl = (config: TwoFactorConfig): string => {
  const endpoint = config.verifyEndpoint || '/api/auth/two-factor/verify';
  return `${config.baseUrl}${endpoint}`;
};

/**
 * Validates enable two-factor options.
 *
 * @pure
 * @description Ensures required fields are present and valid.
 *
 * @fp-pattern Pure function returning Effect for validation
 * @composition N/A - Single operation
 *
 * @param options - The enable options to validate.
 * @returns {Effect.Effect<EnableTwoFactorOptions, TwoFactorEnableError>} Effect containing validated options or error.
 *
 * @example
 * const options = { password: 'mypassword' };
 * const validatedEffect = validateEnableOptions(options);
 * // Effect.runSync(validatedEffect) => { password: 'mypassword' }
 */
export const validateEnableOptions = (
  options: EnableTwoFactorOptions
): Effect.Effect<EnableTwoFactorOptions, TwoFactorEnableError> =>
  Effect.try({
    try: () => {
      if (!options.password || options.password.trim().length === 0) {
        throw new TwoFactorEnableError('Password is required to enable two-factor authentication');
      }
      return options;
    },
    catch: (error) =>
      error instanceof TwoFactorEnableError
        ? error
        : new TwoFactorEnableError('Failed to validate enable options', error),
  });

/**
 * Validates two-factor verification code.
 *
 * @pure
 * @description Ensures the verification code is present and valid format.
 *
 * @fp-pattern Pure function returning Effect for validation
 * @composition N/A - Single operation
 *
 * @param code - The verification code to validate.
 * @returns {Effect.Effect<string, TwoFactorVerificationError>} Effect containing validated code or error.
 *
 * @example
 * const validatedEffect = validateVerificationCode('123456');
 * // Effect.runSync(validatedEffect) => '123456'
 */
export const validateVerificationCode = (
  code: string
): Effect.Effect<string, TwoFactorVerificationError> =>
  Effect.try({
    try: () => {
      if (!code || code.trim().length === 0) {
        throw new TwoFactorVerificationError('Verification code is required');
      }
      if (!/^\d{6}$/.test(code)) {
        throw new TwoFactorVerificationError('Verification code must be 6 digits');
      }
      return code;
    },
    catch: (error) =>
      error instanceof TwoFactorVerificationError
        ? error
        : new TwoFactorVerificationError('Failed to validate verification code', error),
  });

// ============================================================================
// Main Utilities
// ============================================================================

/**
 * Enables two-factor authentication for the current user.
 *
 * @description This function uses the better-auth two-factor plugin to enable 2FA for a user.
 * It makes a POST request to the `/api/auth/two-factor/enable` endpoint with the user's password.
 * The response includes a secret key, QR code for authenticator apps, and backup codes.
 *
 * Note: This is a server-only operation that requires an active session.
 *
 * @param options - The options including the user's password for verification.
 * @param config - Configuration for the API endpoint, including base URL.
 * @returns {Effect.Effect<EnableTwoFactorResponse, TwoFactorEnableError>} An Effect that resolves
 * with the 2FA setup information or fails with an error.
 *
 * @example
 * const options = { password: 'userPassword123' };
 * const config = { baseUrl: 'http://localhost:3000' };
 * const enableEffect = enableTwoFactor(options, config);
 * const result = await Effect.runPromise(enableEffect);
 * // => { secret: 'JBSWY3DPEHPK3PXP', qrCode: 'data:image/png;base64,...', backupCodes: [...] }
 *
 * @example
 * // Using in an Effect program
 * const program = Effect.gen(function* () {
 *   const setupInfo = yield* enableTwoFactor({ password: 'userPassword' }, config);
 *   console.log('Scan this QR code:', setupInfo.qrCode);
 *   console.log('Backup codes:', setupInfo.backupCodes);
 *   return setupInfo;
 * });
 */
export const enableTwoFactor = (
  options: EnableTwoFactorOptions,
  config: TwoFactorConfig
): Effect.Effect<EnableTwoFactorResponse, TwoFactorEnableError> =>
  Effect.gen(function* () {
    // Validate options
    const validatedOptions = yield* validateEnableOptions(options);

    // Build the endpoint URL
    const url = buildEnableUrl(config);

    // Make the POST request
    const response = yield* Effect.tryPromise({
      try: () =>
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ password: validatedOptions.password }),
        }),
      catch: (error) =>
        new TwoFactorEnableError(`Failed to send enable request to ${url}`, error),
    });

    // Check response status
    if (!response.ok) {
      const errorText = yield* Effect.tryPromise({
        try: () => response.text(),
        catch: () => new TwoFactorEnableError('Failed to read error response'),
      });
      return yield* Effect.fail(
        new TwoFactorEnableError(
          `Enable two-factor failed with status ${response.status}: ${errorText}`
        )
      );
    }

    // Parse the response
    const result = yield* Effect.tryPromise({
      try: () => response.json() as Promise<EnableTwoFactorResponse>,
      catch: (error) => new TwoFactorEnableError('Failed to parse enable response', error),
    });

    return result;
  });

/**
 * Disables two-factor authentication for the current user.
 *
 * @description This function uses the better-auth two-factor plugin to disable 2FA.
 * It makes a POST request to the `/api/auth/two-factor/disable` endpoint with the user's password.
 *
 * Note: This is a server-only operation that requires an active session.
 *
 * @param options - The options including the user's password for verification.
 * @param config - Configuration for the API endpoint, including base URL.
 * @returns {Effect.Effect<void, TwoFactorDisableError>} An Effect that succeeds if 2FA is disabled or fails with an error.
 *
 * @example
 * const options = { password: 'userPassword123' };
 * const config = { baseUrl: 'http://localhost:3000' };
 * const disableEffect = disableTwoFactor(options, config);
 * await Effect.runPromise(disableEffect);
 * // Two-factor authentication disabled successfully
 *
 * @example
 * // Using in an Effect program
 * const program = Effect.gen(function* () {
 *   yield* disableTwoFactor({ password: 'userPassword' }, config);
 *   console.log('Two-factor authentication has been disabled');
 * });
 */
export const disableTwoFactor = (
  options: EnableTwoFactorOptions,
  config: TwoFactorConfig
): Effect.Effect<void, TwoFactorDisableError> =>
  Effect.gen(function* () {
    // Validate options
    const validatedOptions = yield* Effect.mapError(
      validateEnableOptions(options),
      (err) => new TwoFactorDisableError(err.message, err.cause)
    );

    // Build the endpoint URL
    const url = buildDisableUrl(config);

    // Make the POST request
    const response = yield* Effect.tryPromise({
      try: () =>
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ password: validatedOptions.password }),
        }),
      catch: (error) =>
        new TwoFactorDisableError(`Failed to send disable request to ${url}`, error),
    });

    // Check response status
    if (!response.ok) {
      const errorText = yield* Effect.tryPromise({
        try: () => response.text(),
        catch: () => new TwoFactorDisableError('Failed to read error response'),
      });
      return yield* Effect.fail(
        new TwoFactorDisableError(
          `Disable two-factor failed with status ${response.status}: ${errorText}`
        )
      );
    }

    return;
  });

/**
 * Verifies a two-factor authentication code.
 *
 * @description This function validates a TOTP code from an authenticator app or a backup code.
 * It makes a POST request to the `/api/auth/two-factor/verify` endpoint with the code.
 * This is typically used during login when 2FA is enabled.
 *
 * @param options - The options containing the verification code.
 * @param config - Configuration for the API endpoint, including base URL.
 * @returns {Effect.Effect<TwoFactorVerificationResult, TwoFactorVerificationError>} An Effect
 * that resolves with verification result or fails with an error.
 *
 * @example
 * const options = { code: '123456' };
 * const config = { baseUrl: 'http://localhost:3000' };
 * const verifyEffect = verifyTwoFactorCode(options, config);
 * const result = await Effect.runPromise(verifyEffect);
 * // => { verified: true, session: { userId: 'user-123', sessionId: 'sess-456' } }
 *
 * @example
 * // Using in an authentication flow
 * const program = Effect.gen(function* () {
 *   const result = yield* verifyTwoFactorCode({ code: userInputCode }, config);
 *   if (result.verified) {
 *     console.log('Two-factor verification successful');
 *     return result.session;
 *   } else {
 *     console.log('Invalid code');
 *     return null;
 *   }
 * });
 */
export const verifyTwoFactorCode = (
  options: VerifyTwoFactorCodeOptions,
  config: TwoFactorConfig
): Effect.Effect<TwoFactorVerificationResult, TwoFactorVerificationError> =>
  Effect.gen(function* () {
    // Validate the code
    const validatedCode = yield* validateVerificationCode(options.code);

    // Build the endpoint URL
    const url = buildVerifyUrl(config);

    // Make the POST request
    const response = yield* Effect.tryPromise({
      try: () =>
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ code: validatedCode }),
        }),
      catch: (error) =>
        new TwoFactorVerificationError(`Failed to send verification request to ${url}`, error),
    });

    // Check response status
    if (!response.ok) {
      const errorText = yield* Effect.tryPromise({
        try: () => response.text(),
        catch: () => new TwoFactorVerificationError('Failed to read error response'),
      });
      return yield* Effect.fail(
        new TwoFactorVerificationError(
          `Verify two-factor failed with status ${response.status}: ${errorText}`
        )
      );
    }

    // Parse the response
    const result = yield* Effect.tryPromise({
      try: () => response.json() as Promise<TwoFactorVerificationResult>,
      catch: (error) =>
        new TwoFactorVerificationError('Failed to parse verification response', error),
    });

    return result;
  });
