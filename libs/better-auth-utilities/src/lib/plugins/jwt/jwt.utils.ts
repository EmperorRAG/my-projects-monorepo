/**
 * @module jwt.utils
 * @description Provides utilities for interacting with the `better-auth` JWT plugin.
 * These functions are designed using the Effect-TS functional programming paradigm.
 */

import { Effect } from 'effect';

/**
 * Custom error class for JWT generation failures.
 *
 * @class JwtGenerationError
 * @extends {Error}
 */
export class JwtGenerationError extends Error {
  readonly _tag = 'JwtGenerationError';
  override readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = 'JwtGenerationError';
    this.cause = cause;
  }
}

/**
 * Custom error class for JWT validation failures.
 *
 * @class JwtValidationError
 * @extends {Error}
 */
export class JwtValidationError extends Error {
  readonly _tag = 'JwtValidationError';
  override readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = 'JwtValidationError';
    this.cause = cause;
  }
}

/**
 * Type representing a user session object.
 * This is a minimal type definition based on better-auth session structure.
 */
export interface Session {
  readonly userId: string;
  readonly sessionId: string;
  readonly email?: string;
  readonly expiresAt?: Date | string;
  readonly [key: string]: unknown;
}

/**
 * Configuration for JWT operations.
 */
export interface JwtConfig {
  /**
   * Base URL of the better-auth server.
   * Defaults to '/api/auth' if not provided.
   */
  readonly baseUrl?: string;

  /**
   * Authorization header value (e.g., Bearer token for session-based auth).
   * Optional - if provided, will be included in requests.
   */
  readonly authorization?: string;
}

/**
 * Response from the JWT token endpoint.
 */
export interface JwtTokenResponse {
  readonly token: string;
}

/**
 * Builds the full URL for the JWT token endpoint.
 *
 * @pure
 * @description Constructs the complete URL by combining base URL and token endpoint path.
 *
 * @fp-pattern Pure function
 *
 * @param config - Configuration with optional baseUrl
 * @returns {string} The complete URL for the JWT token endpoint
 *
 * @example
 * const url = buildJwtTokenUrl({});
 * // => '/api/auth/token'
 *
 * const customUrl = buildJwtTokenUrl({ baseUrl: 'https://example.com/auth' });
 * // => 'https://example.com/auth/token'
 */
export const buildJwtTokenUrl = (config: JwtConfig = {}): string => {
  const baseUrl = config.baseUrl ?? '/api/auth';
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  return `${normalizedBase}/token`;
};

/**
 * Builds the full URL for the JWKS endpoint.
 *
 * @pure
 * @description Constructs the complete URL for retrieving the JSON Web Key Set.
 *
 * @fp-pattern Pure function
 *
 * @param config - Configuration with optional baseUrl
 * @returns {string} The complete URL for the JWKS endpoint
 *
 * @example
 * const url = buildJwksUrl({});
 * // => '/api/auth/jwks'
 */
export const buildJwksUrl = (config: JwtConfig = {}): string => {
  const baseUrl = config.baseUrl ?? '/api/auth';
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  return `${normalizedBase}/jwks`;
};

/**
 * Validates that the response contains a JWT token.
 *
 * @description Checks if the response object has a valid token field.
 *
 * @param data - The data to validate
 * @returns {Effect.Effect<JwtTokenResponse, JwtGenerationError>} An Effect that succeeds with the validated response or fails
 *
 * @example
 * const result = validateJwtTokenResponse({ token: 'ey...' });
 * // => Effect.succeed({ token: 'ey...' })
 */
export const validateJwtTokenResponse = (data: unknown): Effect.Effect<JwtTokenResponse, JwtGenerationError> =>
  Effect.try({
    try: () => {
      if (typeof data !== 'object' || data === null) {
        throw new JwtGenerationError('Response is not an object');
      }

      const response = data as Record<string, unknown>;

      if (typeof response.token !== 'string' || response.token.length === 0) {
        throw new JwtGenerationError('Missing or invalid "token" field');
      }

      return { token: response.token };
    },
    catch: (error) => {
      if (error instanceof JwtGenerationError) {
        return error;
      }
      return new JwtGenerationError('Failed to validate JWT token response', error);
    },
  });

/**
 * Generates a JSON Web Token (JWT) for a given user session.
 *
 * @description This function uses the `better-auth` JWT plugin's `/api/auth/token` endpoint
 * to create a token. The process is wrapped in an `Effect` to handle potential errors during
 * token generation. The function makes a GET request to the token endpoint, which requires
 * an active session (typically via cookies or Authorization header).
 *
 * @param config - Optional configuration for the request
 * @returns {Effect.Effect<string, JwtGenerationError>} An `Effect` that resolves with the
 * JWT string or fails with a `JwtGenerationError`.
 *
 * @example
 * // Basic usage with default configuration
 * const program = pipe(
 *   generateJwt(),
 *   Effect.tap((token) => Console.log('Generated JWT:', token))
 * );
 *
 * // Usage with custom configuration and authorization
 * const customProgram = pipe(
 *   generateJwt({ baseUrl: 'https://api.example.com', authorization: 'Bearer session-token' }),
 *   Effect.map((token) => token.substring(0, 10) + '...')
 * );
 */
export const generateJwt = (
  config: JwtConfig = {}
): Effect.Effect<string, JwtGenerationError> =>
  Effect.gen(function* () {
    // Build the URL for the JWT token endpoint
    const url = buildJwtTokenUrl(config);

    // Prepare headers
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    // Add authorization header if provided
    if (config.authorization) {
      headers['Authorization'] = config.authorization;
    }

    // Make the GET request to the token endpoint
    const response = yield* Effect.tryPromise({
      try: async () => {
        const res = await fetch(url, {
          method: 'GET',
          headers,
          credentials: 'include', // Include cookies for session-based auth
        });

        if (!res.ok) {
          throw new JwtGenerationError(
            `Failed to generate JWT: ${res.status} ${res.statusText}`
          );
        }

        return await res.json();
      },
      catch: (error) => {
        if (error instanceof JwtGenerationError) {
          return error;
        }
        return new JwtGenerationError('Failed to fetch JWT token', error);
      },
    });

    // Validate the response
    const validatedResponse = yield* validateJwtTokenResponse(response);

    return validatedResponse.token;
  });

/**
 * Decodes a JWT payload without verification.
 *
 * @pure
 * @description Extracts and parses the payload from a JWT string. This does NOT verify the signature.
 * Use this only for inspecting token contents, not for authentication.
 *
 * @fp-pattern Pure function with error handling
 *
 * @param token - The JWT string to decode
 * @returns {Effect.Effect<unknown, JwtValidationError>} An Effect with the decoded payload or error
 *
 * @example
 * const payload = decodeJwtPayload('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMifQ.xyz');
 * // => Effect.succeed({ userId: '123' })
 */
export const decodeJwtPayload = (token: string): Effect.Effect<unknown, JwtValidationError> =>
  Effect.try({
    try: () => {
      const parts = token.split('.');

      if (parts.length !== 3) {
        throw new JwtValidationError('Invalid JWT format: must have 3 parts');
      }

      // Decode the payload (second part)
      const payload = parts[1];

      // Base64 decode
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));

      // Parse JSON
      return JSON.parse(decoded);
    },
    catch: (error) => {
      if (error instanceof JwtValidationError) {
        return error;
      }
      return new JwtValidationError('Failed to decode JWT payload', error);
    },
  });

/**
 * Verifies a JSON Web Token (JWT) using the better-auth JWKS endpoint.
 *
 * @description This function validates a JWT string by fetching the public keys from the
 * `/api/auth/jwks` endpoint and verifying the token's signature. Note: This is a simplified
 * verification that checks token structure and decodes the payload. For production use,
 * you should use a proper JWT verification library like 'jose' that can verify signatures
 * against the JWKS.
 *
 * @param token - The JWT string to verify
 * @param _config - Optional configuration for the request (reserved for future JWKS verification)
 * @returns {Effect.Effect<Session, JwtValidationError>} An `Effect` that resolves with the
 * decoded session or fails with a validation error.
 *
 * @example
 * // Basic usage with default configuration
 * const program = pipe(
 *   verifyJwt('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'),
 *   Effect.tap((session) => Console.log('Verified session:', session))
 * );
 *
 * // Usage with custom configuration
 * const customProgram = pipe(
 *   verifyJwt('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', { baseUrl: 'https://api.example.com' }),
 *   Effect.map((session) => session.userId)
 * );
 */
export const verifyJwt = (
  token: string,
  _config: JwtConfig = {} // Reserved for future JWKS verification implementation
): Effect.Effect<Session, JwtValidationError> =>
  Effect.gen(function* () {
    // First, decode the payload to check basic structure
    const payload = yield* decodeJwtPayload(token);

    // Validate that payload contains required session fields
    if (typeof payload !== 'object' || payload === null) {
      yield* Effect.fail(new JwtValidationError('JWT payload is not an object'));
    }

    const session = payload as Record<string, unknown>;

    // Check for required fields
    if (typeof session.userId !== 'string') {
      yield* Effect.fail(new JwtValidationError('JWT payload missing required "userId" field'));
    }

    if (typeof session.sessionId !== 'string') {
      yield* Effect.fail(new JwtValidationError('JWT payload missing required "sessionId" field'));
    }

    // Check expiration if present
    if (session.expiresAt) {
      const expiresAt = typeof session.expiresAt === 'string'
        ? new Date(session.expiresAt)
        : session.expiresAt as Date;

      if (expiresAt < new Date()) {
        yield* Effect.fail(new JwtValidationError('JWT token has expired'));
      }
    }

    // Note: In production, you should verify the signature using the JWKS
    // This would require using a library like 'jose' to:
    // 1. Fetch JWKS from buildJwksUrl(config)
    // 2. Verify token signature against the public keys
    // 3. Validate issuer and audience claims

    return session as Session;
  });
