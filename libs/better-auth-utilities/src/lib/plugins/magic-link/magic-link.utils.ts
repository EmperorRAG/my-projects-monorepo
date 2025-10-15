/**
 * @module magic-link.utils
 * @description Provides utilities for interacting with the `better-auth` Magic Link plugin.
 * These functions are designed using the Effect-TS functional programming paradigm.
 */

import { Effect } from 'effect';

// ============================================================================
// Custom Error Classes
// ============================================================================

/**
 * Error thrown when magic link operations fail.
 */
export class MagicLinkError extends Error {
  readonly _tag = 'MagicLinkError';

  constructor(
    message: string,
    public override readonly cause?: unknown
  ) {
    super(message);
    this.name = 'MagicLinkError';
  }
}

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Options for sending a magic link.
 */
export interface SendMagicLinkOptions {
  readonly email: string;
  readonly redirectTo?: string;
}

/**
 * Options for verifying a magic link.
 */
export interface VerifyMagicLinkOptions {
  readonly token: string;
}

/**
 * Configuration for magic link operations.
 */
export interface MagicLinkConfig {
  readonly baseUrl: string;
  readonly sendEndpoint?: string;
  readonly verifyEndpoint?: string;
}

/**
 * Response from sending a magic link.
 */
export interface SendMagicLinkResponse {
  readonly sent: boolean;
  readonly email: string;
}

/**
 * Response from verifying a magic link.
 */
export interface VerifyMagicLinkResponse {
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
 * Builds the URL for the send magic link endpoint.
 *
 * @pure
 * @fp-pattern Pure function
 *
 * @param config - Configuration containing the base URL.
 * @returns {string} The complete URL.
 *
 * @example
 * const url = buildSendMagicLinkUrl({ baseUrl: 'http://localhost:3000' });
 * // => 'http://localhost:3000/api/auth/magic-link/send'
 */
export const buildSendMagicLinkUrl = (config: MagicLinkConfig): string => {
  const endpoint = config.sendEndpoint || '/api/auth/magic-link/send';
  return `${config.baseUrl}${endpoint}`;
};

/**
 * Builds the URL for the verify magic link endpoint.
 *
 * @pure
 * @fp-pattern Pure function
 *
 * @param config - Configuration containing the base URL.
 * @returns {string} The complete URL.
 *
 * @example
 * const url = buildVerifyMagicLinkUrl({ baseUrl: 'http://localhost:3000' });
 * // => 'http://localhost:3000/api/auth/magic-link/verify'
 */
export const buildVerifyMagicLinkUrl = (config: MagicLinkConfig): string => {
  const endpoint = config.verifyEndpoint || '/api/auth/magic-link/verify';
  return `${config.baseUrl}${endpoint}`;
};

/**
 * Validates email format.
 *
 * @pure
 * @fp-pattern Pure function returning Effect for validation
 *
 * @param email - The email to validate.
 * @returns {Effect.Effect<string, MagicLinkError>} Effect containing validated email or error.
 *
 * @example
 * const validatedEffect = validateEmail('user@example.com');
 * // Effect.runSync(validatedEffect) => 'user@example.com'
 */
export const validateEmail = (email: string): Effect.Effect<string, MagicLinkError> =>
  Effect.try({
    try: () => {
      if (!email || email.trim().length === 0) {
        throw new MagicLinkError('Email is required');
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new MagicLinkError('Invalid email format');
      }
      return email;
    },
    catch: (error) =>
      error instanceof MagicLinkError
        ? error
        : new MagicLinkError('Failed to validate email', error),
  });

// ============================================================================
// Main Utilities
// ============================================================================

/**
 * Sends a magic link to the specified email address.
 *
 * @description Makes a POST request to send a magic link authentication email.
 * The user can click the link to sign in without a password.
 *
 * @param options - The options containing the email and optional redirect URL.
 * @param config - Configuration for the API endpoint.
 * @returns {Effect.Effect<SendMagicLinkResponse, MagicLinkError>} An Effect with the send result.
 *
 * @example
 * const sendEffect = sendMagicLink(
 *   { email: 'user@example.com' },
 *   { baseUrl: 'http://localhost:3000' }
 * );
 * const result = await Effect.runPromise(sendEffect);
 * // => { sent: true, email: 'user@example.com' }
 *
 * @example
 * // With custom redirect
 * const program = Effect.gen(function* () {
 *   const result = yield* sendMagicLink(
 *     { email: 'user@example.com', redirectTo: '/dashboard' },
 *     config
 *   );
 *   console.log('Magic link sent to:', result.email);
 *   return result;
 * });
 */
export const sendMagicLink = (
  options: SendMagicLinkOptions,
  config: MagicLinkConfig
): Effect.Effect<SendMagicLinkResponse, MagicLinkError> =>
  Effect.gen(function* () {
    const validatedEmail = yield* validateEmail(options.email);
    const url = buildSendMagicLinkUrl(config);

    const requestBody: Record<string, unknown> = {
      email: validatedEmail,
    };

    if (options.redirectTo) {
      requestBody.redirectTo = options.redirectTo;
    }

    const response = yield* Effect.tryPromise({
      try: () =>
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(requestBody),
        }),
      catch: (error) => new MagicLinkError(`Failed to send magic link request to ${url}`, error),
    });

    if (!response.ok) {
      const errorText = yield* Effect.tryPromise({
        try: () => response.text(),
        catch: () => new MagicLinkError('Failed to read error response'),
      });
      return yield* Effect.fail(
        new MagicLinkError(`Send magic link failed with status ${response.status}: ${errorText}`)
      );
    }

    const result = yield* Effect.tryPromise({
      try: () => response.json() as Promise<SendMagicLinkResponse>,
      catch: (error) => new MagicLinkError('Failed to parse send response', error),
    });

    return result;
  });

/**
 * Verifies a magic link token.
 *
 * @description Makes a POST request to verify a magic link token and create a session.
 * This is typically called when the user clicks the magic link in their email.
 *
 * @param options - The options containing the verification token.
 * @param config - Configuration for the API endpoint.
 * @returns {Effect.Effect<VerifyMagicLinkResponse, MagicLinkError>} An Effect with the verification result.
 *
 * @example
 * const verifyEffect = verifyMagicLink(
 *   { token: 'magic-token-abc123' },
 *   { baseUrl: 'http://localhost:3000' }
 * );
 * const result = await Effect.runPromise(verifyEffect);
 * // => { verified: true, session: { userId: 'user-123', sessionId: 'sess-456' } }
 *
 * @example
 * // Using in authentication flow
 * const program = Effect.gen(function* () {
 *   const result = yield* verifyMagicLink({ token: urlToken }, config);
 *   if (result.verified) {
 *     console.log('User authenticated:', result.session?.userId);
 *     return result.session;
 *   }
 *   return null;
 * });
 */
export const verifyMagicLink = (
  options: VerifyMagicLinkOptions,
  config: MagicLinkConfig
): Effect.Effect<VerifyMagicLinkResponse, MagicLinkError> =>
  Effect.gen(function* () {
    if (!options.token || options.token.trim().length === 0) {
      return yield* Effect.fail(new MagicLinkError('Token is required'));
    }

    const url = buildVerifyMagicLinkUrl(config);

    const response = yield* Effect.tryPromise({
      try: () =>
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ token: options.token }),
        }),
      catch: (error) => new MagicLinkError(`Failed to send verify request to ${url}`, error),
    });

    if (!response.ok) {
      const errorText = yield* Effect.tryPromise({
        try: () => response.text(),
        catch: () => new MagicLinkError('Failed to read error response'),
      });
      return yield* Effect.fail(
        new MagicLinkError(`Verify magic link failed with status ${response.status}: ${errorText}`)
      );
    }

    const result = yield* Effect.tryPromise({
      try: () => response.json() as Promise<VerifyMagicLinkResponse>,
      catch: (error) => new MagicLinkError('Failed to parse verify response', error),
    });

    return result;
  });
