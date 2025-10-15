/**
 * @module username.utils
 * @description Provides utilities for interacting with the `better-auth` Username plugin.
 * These functions are designed using the Effect-TS functional programming paradigm.
 */

import { Effect } from 'effect';

// ============================================================================
// Custom Error Classes
// ============================================================================

/**
 * Error thrown when username operations fail.
 */
export class UsernameError extends Error {
  readonly _tag = 'UsernameError';

  constructor(
    message: string,
    public override readonly cause?: unknown
  ) {
    super(message);
    this.name = 'UsernameError';
  }
}

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Options for setting a username.
 */
export interface SetUsernameOptions {
  readonly username: string;
}

/**
 * Options for checking username availability.
 */
export interface CheckUsernameOptions {
  readonly username: string;
}

/**
 * Configuration for username operations.
 */
export interface UsernameConfig {
  readonly baseUrl: string;
  readonly setEndpoint?: string;
  readonly checkEndpoint?: string;
}

/**
 * Response from username availability check.
 */
export interface UsernameAvailabilityResponse {
  readonly available: boolean;
  readonly username: string;
}

// ============================================================================
// Supporting Utilities
// ============================================================================

/**
 * Builds the URL for the set username endpoint.
 *
 * @pure
 * @fp-pattern Pure function
 *
 * @param config - Configuration containing the base URL.
 * @returns {string} The complete URL.
 *
 * @example
 * const url = buildSetUsernameUrl({ baseUrl: 'http://localhost:3000' });
 * // => 'http://localhost:3000/api/auth/username/set'
 */
export const buildSetUsernameUrl = (config: UsernameConfig): string => {
  const endpoint = config.setEndpoint || '/api/auth/username/set';
  return `${config.baseUrl}${endpoint}`;
};

/**
 * Builds the URL for the check username endpoint.
 *
 * @pure
 * @fp-pattern Pure function
 *
 * @param config - Configuration containing the base URL.
 * @returns {string} The complete URL.
 *
 * @example
 * const url = buildCheckUsernameUrl({ baseUrl: 'http://localhost:3000' });
 * // => 'http://localhost:3000/api/auth/username/check'
 */
export const buildCheckUsernameUrl = (config: UsernameConfig): string => {
  const endpoint = config.checkEndpoint || '/api/auth/username/check';
  return `${config.baseUrl}${endpoint}`;
};

/**
 * Validates username format.
 *
 * @pure
 * @fp-pattern Pure function returning Effect for validation
 *
 * @param username - The username to validate.
 * @returns {Effect.Effect<string, UsernameError>} Effect containing validated username or error.
 *
 * @example
 * const validatedEffect = validateUsername('johndoe');
 * // Effect.runSync(validatedEffect) => 'johndoe'
 */
export const validateUsername = (username: string): Effect.Effect<string, UsernameError> =>
  Effect.try({
    try: () => {
      if (!username || username.trim().length === 0) {
        throw new UsernameError('Username is required');
      }
      if (username.length < 3 || username.length > 30) {
        throw new UsernameError('Username must be between 3 and 30 characters');
      }
      if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        throw new UsernameError('Username can only contain letters, numbers, hyphens, and underscores');
      }
      return username;
    },
    catch: (error) =>
      error instanceof UsernameError
        ? error
        : new UsernameError('Failed to validate username', error),
  });

// ============================================================================
// Main Utilities
// ============================================================================

/**
 * Sets a username for the current user.
 *
 * @description Makes a POST request to set the username for the authenticated user.
 * The username must be unique and follow the validation rules.
 *
 * @param options - The options containing the username.
 * @param config - Configuration for the API endpoint.
 * @returns {Effect.Effect<void, UsernameError>} An Effect that succeeds or fails.
 *
 * @example
 * const setEffect = setUsername({ username: 'johndoe' }, { baseUrl: 'http://localhost:3000' });
 * await Effect.runPromise(setEffect);
 */
export const setUsername = (
  options: SetUsernameOptions,
  config: UsernameConfig
): Effect.Effect<void, UsernameError> =>
  Effect.gen(function* () {
    const validatedUsername = yield* validateUsername(options.username);
    const url = buildSetUsernameUrl(config);

    const response = yield* Effect.tryPromise({
      try: () =>
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ username: validatedUsername }),
        }),
      catch: (error) => new UsernameError(`Failed to send set username request to ${url}`, error),
    });

    if (!response.ok) {
      const errorText = yield* Effect.tryPromise({
        try: () => response.text(),
        catch: () => new UsernameError('Failed to read error response'),
      });
      return yield* Effect.fail(
        new UsernameError(`Set username failed with status ${response.status}: ${errorText}`)
      );
    }

    return;
  });

/**
 * Checks if a username is available.
 *
 * @description Makes a POST request to check username availability.
 *
 * @param options - The options containing the username to check.
 * @param config - Configuration for the API endpoint.
 * @returns {Effect.Effect<UsernameAvailabilityResponse, UsernameError>} An Effect with the availability result.
 *
 * @example
 * const checkEffect = checkUsernameAvailability(
 *   { username: 'johndoe' },
 *   { baseUrl: 'http://localhost:3000' }
 * );
 * const result = await Effect.runPromise(checkEffect);
 * // => { available: true, username: 'johndoe' }
 */
export const checkUsernameAvailability = (
  options: CheckUsernameOptions,
  config: UsernameConfig
): Effect.Effect<UsernameAvailabilityResponse, UsernameError> =>
  Effect.gen(function* () {
    const validatedUsername = yield* validateUsername(options.username);
    const url = buildCheckUsernameUrl(config);

    const response = yield* Effect.tryPromise({
      try: () =>
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ username: validatedUsername }),
        }),
      catch: (error) => new UsernameError(`Failed to send check username request to ${url}`, error),
    });

    if (!response.ok) {
      const errorText = yield* Effect.tryPromise({
        try: () => response.text(),
        catch: () => new UsernameError('Failed to read error response'),
      });
      return yield* Effect.fail(
        new UsernameError(`Check username failed with status ${response.status}: ${errorText}`)
      );
    }

    const result = yield* Effect.tryPromise({
      try: () => response.json() as Promise<UsernameAvailabilityResponse>,
      catch: (error) => new UsernameError('Failed to parse availability response', error),
    });

    return result;
  });
