/**
 * @module bearer.utils
 * @description Provides utilities for interacting with the `better-auth` Bearer Token plugin.
 * These functions are designed using the Effect-TS functional programming paradigm.
 */

import { Effect } from 'effect';

// ============================================================================
// Custom Error Classes
// ============================================================================

/**
 * Error thrown when bearer token extraction fails.
 */
export class BearerTokenExtractionError extends Error {
  readonly _tag = 'BearerTokenExtractionError';

  constructor(
    message: string,
    public override readonly cause?: unknown
  ) {
    super(message);
    this.name = 'BearerTokenExtractionError';
  }
}

/**
 * Error thrown when bearer token validation fails.
 */
export class BearerTokenValidationError extends Error {
  readonly _tag = 'BearerTokenValidationError';

  constructor(
    message: string,
    public override readonly cause?: unknown
  ) {
    super(message);
    this.name = 'BearerTokenValidationError';
  }
}

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Minimal session type for bearer token operations.
 * Represents the essential session information needed for token generation.
 */
export interface Session {
  readonly userId: string;
  readonly sessionId: string;
  readonly email?: string;
}

/**
 * Configuration for bearer token operations.
 */
export interface BearerConfig {
  readonly baseUrl: string;
  readonly authEndpoint?: string;
}

/**
 * Response from the authentication endpoint containing the bearer token.
 * The token is provided in the `set-auth-token` response header.
 */
export interface BearerTokenResponse {
  readonly token: string;
}

// ============================================================================
// Supporting Utilities
// ============================================================================

/**
 * Builds the URL for the authentication endpoint.
 *
 * @pure
 * @description Constructs the full URL for the better-auth endpoint that triggers
 * bearer token generation via the `set-auth-token` header.
 *
 * @fp-pattern Pure function
 * @composition N/A - Single operation
 *
 * @param config - Configuration containing the base URL and optional auth endpoint.
 * @returns {string} The complete URL for the authentication endpoint.
 *
 * @example
 * const url = buildAuthUrl({ baseUrl: 'http://localhost:3000' });
 * // => 'http://localhost:3000/api/auth/get-session'
 */
export const buildAuthUrl = (config: BearerConfig): string => {
  const endpoint = config.authEndpoint || '/api/auth/get-session';
  return `${config.baseUrl}${endpoint}`;
};

/**
 * Extracts the bearer token from response headers.
 *
 * @pure
 * @description Safely extracts the `set-auth-token` header value from HTTP response headers.
 * Returns an Effect that succeeds with the token or fails if the header is missing.
 *
 * @fp-pattern Pure function returning Effect for error handling
 * @composition N/A - Single operation
 *
 * @param headers - The HTTP response headers object.
 * @returns {Effect.Effect<string, BearerTokenExtractionError>} Effect containing the token or error.
 *
 * @example
 * const headers = new Headers({ 'set-auth-token': 'abc123' });
 * const tokenEffect = extractBearerToken(headers);
 * // Effect.runSync(tokenEffect) => 'abc123'
 */
export const extractBearerToken = (
  headers: Headers
): Effect.Effect<string, BearerTokenExtractionError> =>
  Effect.try({
    try: () => {
      const token = headers.get('set-auth-token');
      if (!token) {
        throw new BearerTokenExtractionError(
          'Bearer token not found in response headers. Ensure the bearer plugin is active and the session is valid.'
        );
      }
      return token;
    },
    catch: (error) =>
      error instanceof BearerTokenExtractionError
        ? error
        : new BearerTokenExtractionError(
            'Failed to extract bearer token from headers',
            error
          ),
  });

/**
 * Validates the structure of a bearer token.
 *
 * @pure
 * @description Ensures the token is a non-empty string.
 * Returns an Effect that succeeds with the validated token or fails with an error.
 *
 * @fp-pattern Pure function returning Effect for validation
 * @composition N/A - Single operation
 *
 * @param token - The bearer token string to validate.
 * @returns {Effect.Effect<string, BearerTokenValidationError>} Effect containing the validated token or error.
 *
 * @example
 * const validatedEffect = validateBearerToken('abc123');
 * // Effect.runSync(validatedEffect) => 'abc123'
 */
export const validateBearerToken = (
  token: string
): Effect.Effect<string, BearerTokenValidationError> =>
  Effect.try({
    try: () => {
      if (!token || token.trim().length === 0) {
        throw new BearerTokenValidationError(
          'Bearer token is empty or invalid'
        );
      }
      return token;
    },
    catch: (error) =>
      error instanceof BearerTokenValidationError
        ? error
        : new BearerTokenValidationError('Failed to validate bearer token', error),
  });

// ============================================================================
// Main Utilities
// ============================================================================

/**
 * Generates a bearer token by triggering an authenticated endpoint.
 *
 * @description This function makes a request to a better-auth endpoint (typically `/api/auth/get-session`)
 * with session credentials. The better-auth bearer plugin automatically includes the bearer token
 * in the `set-auth-token` response header. This utility extracts and validates that token.
 *
 * Note: This implementation assumes the session is already established via cookies. The bearer token
 * is automatically generated by the better-auth bearer plugin when any authenticated endpoint is called.
 *
 * @param config - Configuration containing the base URL and optional auth endpoint.
 * @returns {Effect.Effect<string, BearerTokenExtractionError | BearerTokenValidationError>}
 * Effect that resolves with the bearer token string or fails with an extraction/validation error.
 *
 * @example
 * const config = { baseUrl: 'http://localhost:3000' };
 * const tokenEffect = generateBearerToken(config);
 * const token = await Effect.runPromise(tokenEffect);
 * // => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 *
 * @example
 * // Using in a service layer with Effect.gen
 * const program = Effect.gen(function* () {
 *   const token = yield* generateBearerToken({ baseUrl: 'http://localhost:3000' });
 *   // Use the token for subsequent API calls
 *   return token;
 * });
 */
export const generateBearerToken = (
  config: BearerConfig
): Effect.Effect<
  string,
  BearerTokenExtractionError | BearerTokenValidationError
> =>
  Effect.gen(function* () {
    // Build the authentication endpoint URL
    const url = buildAuthUrl(config);

    // Make the request with credentials to include session cookies
    // The bearer plugin automatically sets the token in the response header
    const response = yield* Effect.tryPromise({
      try: () =>
        fetch(url, {
          method: 'GET',
          credentials: 'include', // Include session cookies
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      catch: (error) =>
        new BearerTokenExtractionError(
          `Failed to fetch bearer token from ${url}`,
          error
        ),
    });

    // Check if the response is OK
    if (!response.ok) {
      return yield* Effect.fail(
        new BearerTokenExtractionError(
          `Authentication endpoint returned status ${response.status}. Ensure the session is valid and the bearer plugin is active.`
        )
      );
    }

    // Extract the token from the response headers
    const token = yield* extractBearerToken(response.headers);

    // Validate the token
    const validatedToken = yield* validateBearerToken(token);

    return validatedToken;
  });

/**
 * Extracts and validates a bearer token from an existing response.
 *
 * @description This utility is useful when you already have a response from a better-auth
 * endpoint and want to extract the bearer token from its headers. This is common when
 * handling sign-in responses or other authenticated operations.
 *
 * @param response - The fetch Response object from a better-auth endpoint.
 * @returns {Effect.Effect<string, BearerTokenExtractionError | BearerTokenValidationError>}
 * Effect that resolves with the bearer token or fails with an error.
 *
 * @example
 * const response = await fetch('/api/auth/sign-in/email', { ... });
 * const tokenEffect = extractBearerTokenFromResponse(response);
 * const token = await Effect.runPromise(tokenEffect);
 * // => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 */
export const extractBearerTokenFromResponse = (
  response: Response
): Effect.Effect<
  string,
  BearerTokenExtractionError | BearerTokenValidationError
> =>
  Effect.gen(function* () {
    // Extract the token from headers
    const token = yield* extractBearerToken(response.headers);

    // Validate the token
    const validatedToken = yield* validateBearerToken(token);

    return validatedToken;
  });
