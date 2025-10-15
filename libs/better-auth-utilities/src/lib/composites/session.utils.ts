/**
 * @module session.utils
 * @description This module provides composite utilities for session management by combining functionalities from core and plugin modules.
 * The functions are designed using the Effect-TS functional programming paradigm.
 */

import { Context, Effect, pipe } from 'effect';
import {
  generateBearerToken,
  BearerTokenExtractionError,
  BearerTokenValidationError,
  type BearerConfig,
} from '../plugins/bearer/bearer.utils';

// ============================================================================
// Custom Error Classes
// ============================================================================

/**
 * Error thrown when session validation fails.
 */
export class SessionValidationError extends Error {
  readonly _tag = 'SessionValidationError';

  constructor(
    message: string,
    public readonly sessionToken?: string,
    public override readonly cause?: unknown
  ) {
    super(message);
    this.name = 'SessionValidationError';
  }
}

/**
 * Error thrown when token generation fails.
 */
export class TokenGenerationError extends Error {
  readonly _tag = 'TokenGenerationError';

  constructor(message: string, public override readonly cause?: unknown) {
    super(message);
    this.name = 'TokenGenerationError';
  }
}

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Minimal session information returned from better-auth.
 */
export interface Session {
  readonly user: {
    readonly id: string;
    readonly email: string;
    readonly name: string;
    readonly emailVerified: boolean;
  };
  readonly session: {
    readonly id: string;
    readonly userId: string;
    readonly expiresAt: Date;
    readonly token: string;
  };
}

/**
 * Service for session operations.
 * Provides the base URL configuration needed for session validation and token generation.
 */
export interface SessionService {
  readonly baseUrl: string;
}

/**
 * Tag for SessionService using Context.Tag pattern.
 */
export class SessionServiceTag extends Context.Tag('SessionService')<
  SessionServiceTag,
  SessionService
>() {}

// ============================================================================
// Supporting Utilities
// ============================================================================

/**
 * Validates a session token.
 *
 * @pure
 * @description Ensures the session token is a non-empty string.
 *
 * @fp-pattern Pure function returning Effect for validation
 * @composition N/A - Single operation
 *
 * @param sessionToken - The session token to validate.
 * @returns {Effect.Effect<string, SessionValidationError>} Effect containing validated token or error.
 *
 * @example
 * const validatedEffect = validateSessionToken('abc123');
 * // Effect.runSync(validatedEffect) => 'abc123'
 */
export const validateSessionToken = (
  sessionToken: string
): Effect.Effect<string, SessionValidationError> =>
  Effect.try({
    try: () => {
      if (!sessionToken || sessionToken.trim().length === 0) {
        throw new SessionValidationError(
          'Session token is required and cannot be empty'
        );
      }
      return sessionToken;
    },
    catch: (error) =>
      error instanceof SessionValidationError
        ? error
        : new SessionValidationError(
            'Failed to validate session token',
            undefined,
            error
          ),
  });

/**
 * Validates a session by making a request to the better-auth session endpoint.
 *
 * @description This function makes a request to the better-auth `/api/auth/get-session` endpoint
 * with the session token in the Authorization header. If the session is valid, the endpoint
 * returns 200 OK. This function only validates the session exists and is active.
 *
 * @fp-pattern Effectful function with service dependency
 * @composition Uses SessionService from Context
 *
 * @param sessionToken - The session token to validate.
 * @returns {Effect.Effect<void, SessionValidationError, SessionServiceTag>}
 * Effect that succeeds if session is valid or fails with SessionValidationError.
 *
 * @example
 * const validateEffect = getSession('session-token-123');
 * const result = await Effect.runPromise(
 *   Effect.provide(validateEffect, SessionServiceTag.of({ baseUrl: 'http://localhost:3000' }))
 * );
 */
export const getSession = (
  sessionToken: string
): Effect.Effect<void, SessionValidationError, SessionServiceTag> =>
  Effect.gen(function* () {
    // Get SessionService from Context
    const sessionService = yield* SessionServiceTag;

    // Build the session endpoint URL
    const url = `${sessionService.baseUrl}/api/auth/get-session`;

    // Make the request with the session token
    const response = yield* Effect.tryPromise({
      try: () =>
        fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            'Content-Type': 'application/json',
          },
        }),
      catch: (error) =>
        new SessionValidationError(
          `Failed to validate session at ${url}`,
          sessionToken,
          error
        ),
    });

    // Check if the response is OK (session is valid)
    if (!response.ok) {
      return yield* Effect.fail(
        new SessionValidationError(
          `Session validation failed with status ${response.status}. The session may be invalid or expired.`,
          sessionToken
        )
      );
    }

    return;
  });

// ============================================================================
// Main Utilities
// ============================================================================

/**
 * Validates a session and generates a new bearer token upon successful validation.
 *
 * @description This function composes session validation and bearer token generation. It first validates
 * the incoming session token by making a request to the better-auth session endpoint. If the session is
 * valid, it proceeds to generate a new bearer token by triggering an authenticated endpoint. The bearer
 * token is automatically included in the `set-auth-token` response header by the better-auth bearer plugin.
 * The entire workflow is managed as a single `Effect`.
 *
 * @fp-pattern Effect composition with sequential operations
 * @composition Uses pipe and flatMap to compose validation and token generation
 *
 * @param sessionToken - The session token to be validated.
 * @returns {Effect.Effect<string, SessionValidationError | BearerTokenExtractionError | BearerTokenValidationError, SessionServiceTag>}
 * An `Effect` that, when executed, will either yield a new bearer token string upon success or fail with
 * a `SessionValidationError`, `BearerTokenExtractionError`, or `BearerTokenValidationError`.
 * It requires `SessionService` in its context.
 *
 * @example
 * import { SessionServiceTag } from './session.utils';
 * const sessionToken = "some-valid-session-token";
 * const program = validateSessionAndGenerateBearerToken(sessionToken);
 *
 * // To run the program, you need to provide the required service.
 * const result = await Effect.runPromise(
 *   Effect.provide(program, SessionServiceTag.of({ baseUrl: 'http://localhost:3000' }))
 * );
 * console.log(result); // Logs the new bearer token
 *
 * @example
 * // Using with Effect.gen for composition
 * const program = Effect.gen(function* () {
 *   const bearerToken = yield* validateSessionAndGenerateBearerToken('session-token-123');
 *   console.log('Generated bearer token:', bearerToken);
 *   return bearerToken;
 * });
 */
export const validateSessionAndGenerateBearerToken = (
  sessionToken: string
): Effect.Effect<
  string,
  | SessionValidationError
  | BearerTokenExtractionError
  | BearerTokenValidationError,
  SessionServiceTag
> =>
  pipe(
    // Step 1: Validate the session token format
    validateSessionToken(sessionToken),
    // Step 2: Validate the session with better-auth
    Effect.flatMap((validatedToken) =>
      pipe(
        getSession(validatedToken),
        // Step 3: Generate bearer token after successful validation
        Effect.flatMap(() =>
          Effect.gen(function* () {
            // Get SessionService from Context to build BearerConfig
            const sessionService = yield* SessionServiceTag;
            const bearerConfig: BearerConfig = {
              baseUrl: sessionService.baseUrl,
            };

            // Generate the bearer token
            const bearerToken = yield* generateBearerToken(bearerConfig);

            return bearerToken;
          })
        )
      )
    )
  );
