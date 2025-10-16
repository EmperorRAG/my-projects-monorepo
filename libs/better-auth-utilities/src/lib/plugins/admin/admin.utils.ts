/**
 * @module admin.utils
 * @description Provides utilities for interacting with the `better-auth` Admin plugin.
 * These functions are designed using the Effect-TS functional programming paradigm and provide server API
 * functionality for admin operations like banning users, impersonating users, and role management.
 */

import { Effect } from 'effect';

// ============================================================================
// Custom Error Classes
// ============================================================================

/**
 * Error thrown when user ban operation fails.
 */
export class UserBanError extends Error {
  readonly _tag = 'UserBanError';

  constructor(
    message: string,
    public override readonly cause?: unknown
  ) {
    super(message);
    this.name = 'UserBanError';
  }
}

/**
 * Error thrown when user unban operation fails.
 */
export class UserUnbanError extends Error {
  readonly _tag = 'UserUnbanError';

  constructor(
    message: string,
    public override readonly cause?: unknown
  ) {
    super(message);
    this.name = 'UserUnbanError';
  }
}

/**
 * Error thrown when user impersonation fails.
 */
export class ImpersonationError extends Error {
  readonly _tag = 'ImpersonationError';

  constructor(
    message: string,
    public override readonly cause?: unknown
  ) {
    super(message);
    this.name = 'ImpersonationError';
  }
}

/**
 * Error thrown when role assignment fails.
 */
export class RoleAssignmentError extends Error {
  readonly _tag = 'RoleAssignmentError';

  constructor(
    message: string,
    public override readonly cause?: unknown
  ) {
    super(message);
    this.name = 'RoleAssignmentError';
  }
}

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Options for banning a user.
 */
export interface BanUserOptions {
  readonly userId: string;
  readonly reason?: string;
  readonly expiresAt?: string | Date;
}

/**
 * Options for unbanning a user.
 */
export interface UnbanUserOptions {
  readonly userId: string;
}

/**
 * Options for impersonating a user.
 */
export interface ImpersonateUserOptions {
  readonly userId: string;
}

/**
 * Response from impersonating a user.
 */
export interface ImpersonationResponse {
  readonly sessionId: string;
  readonly userId: string;
  readonly impersonatedBy: string;
}

/**
 * Options for assigning a role to a user.
 */
export interface AssignRoleOptions {
  readonly userId: string;
  readonly role: string;
}

/**
 * Options for removing a role from a user.
 */
export interface RemoveRoleOptions {
  readonly userId: string;
  readonly role: string;
}

/**
 * Configuration for admin operations.
 */
export interface AdminConfig {
  readonly baseUrl: string;
  readonly banEndpoint?: string;
  readonly unbanEndpoint?: string;
  readonly impersonateEndpoint?: string;
  readonly assignRoleEndpoint?: string;
  readonly removeRoleEndpoint?: string;
}

/**
 * User object returned from admin operations.
 */
export interface AdminUser {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly banned?: boolean;
  readonly banReason?: string | null;
  readonly bannedUntil?: string | null;
  readonly role?: string;
}

// ============================================================================
// Supporting Utilities
// ============================================================================

/**
 * Builds the URL for the user ban endpoint.
 *
 * @pure
 * @description Constructs the full URL for the better-auth admin ban endpoint.
 *
 * @fp-pattern Pure function
 * @composition N/A - Single operation
 *
 * @param config - Configuration containing the base URL and optional ban endpoint.
 * @returns {string} The complete URL for the ban endpoint.
 *
 * @example
 * const url = buildBanUrl({ baseUrl: 'http://localhost:3000' });
 * // => 'http://localhost:3000/api/auth/admin/ban-user'
 */
export const buildBanUrl = (config: AdminConfig): string => {
  const endpoint = config.banEndpoint || '/api/auth/admin/ban-user';
  return `${config.baseUrl}${endpoint}`;
};

/**
 * Builds the URL for the user unban endpoint.
 *
 * @pure
 * @description Constructs the full URL for the better-auth admin unban endpoint.
 *
 * @fp-pattern Pure function
 * @composition N/A - Single operation
 *
 * @param config - Configuration containing the base URL and optional unban endpoint.
 * @returns {string} The complete URL for the unban endpoint.
 *
 * @example
 * const url = buildUnbanUrl({ baseUrl: 'http://localhost:3000' });
 * // => 'http://localhost:3000/api/auth/admin/unban-user'
 */
export const buildUnbanUrl = (config: AdminConfig): string => {
  const endpoint = config.unbanEndpoint || '/api/auth/admin/unban-user';
  return `${config.baseUrl}${endpoint}`;
};

/**
 * Builds the URL for the user impersonation endpoint.
 *
 * @pure
 * @description Constructs the full URL for the better-auth admin impersonate endpoint.
 *
 * @fp-pattern Pure function
 * @composition N/A - Single operation
 *
 * @param config - Configuration containing the base URL and optional impersonate endpoint.
 * @returns {string} The complete URL for the impersonate endpoint.
 *
 * @example
 * const url = buildImpersonateUrl({ baseUrl: 'http://localhost:3000' });
 * // => 'http://localhost:3000/api/auth/admin/impersonate'
 */
export const buildImpersonateUrl = (config: AdminConfig): string => {
  const endpoint = config.impersonateEndpoint || '/api/auth/admin/impersonate';
  return `${config.baseUrl}${endpoint}`;
};

/**
 * Validates user ID.
 *
 * @pure
 * @description Ensures the user ID is present and valid.
 *
 * @fp-pattern Pure function returning Effect for validation
 * @composition N/A - Single operation
 *
 * @param userId - The user ID to validate.
 * @returns {Effect.Effect<string, UserBanError>} Effect containing validated user ID or error.
 *
 * @example
 * const validatedEffect = validateUserId('user-123');
 * // Effect.runSync(validatedEffect) => 'user-123'
 */
export const validateUserId = (userId: string): Effect.Effect<string, UserBanError> =>
  Effect.try({
    try: () => {
      if (!userId || userId.trim().length === 0) {
        throw new UserBanError('User ID is required');
      }
      return userId;
    },
    catch: (error) =>
      error instanceof UserBanError
        ? error
        : new UserBanError('Failed to validate user ID', error),
  });

// ============================================================================
// Main Utilities
// ============================================================================

/**
 * Bans a user from the system.
 *
 * @description This function uses the better-auth admin plugin to ban a user.
 * It makes a POST request to the `/api/auth/admin/ban-user` endpoint with the user ID,
 * optional reason, and optional expiration date. Banned users cannot sign in.
 *
 * Note: This is a server-only operation that requires admin privileges.
 *
 * @param options - The options including user ID, reason, and optional expiration.
 * @param config - Configuration for the API endpoint, including base URL.
 * @returns {Effect.Effect<AdminUser, UserBanError>} An Effect that resolves with the banned user
 * object or fails with an error.
 *
 * @example
 * const options = { userId: 'user-123', reason: 'Terms of service violation' };
 * const config = { baseUrl: 'http://localhost:3000' };
 * const banEffect = banUser(options, config);
 * const bannedUser = await Effect.runPromise(banEffect);
 * // => { id: 'user-123', email: 'user@example.com', banned: true, banReason: '...' }
 *
 * @example
 * // Ban with expiration date
 * const program = Effect.gen(function* () {
 *   const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
 *   const user = yield* banUser(
 *     { userId: 'user-456', reason: 'Temporary suspension', expiresAt },
 *     config
 *   );
 *   console.log('User banned until:', user.bannedUntil);
 *   return user;
 * });
 */
export const banUser = (
  options: BanUserOptions,
  config: AdminConfig
): Effect.Effect<AdminUser, UserBanError> =>
  Effect.gen(function* () {
    // Validate user ID
    const validatedUserId = yield* validateUserId(options.userId);

    // Build the endpoint URL
    const url = buildBanUrl(config);

    // Prepare request body
    const requestBody: Record<string, unknown> = {
      userId: validatedUserId,
    };

    if (options.reason) {
      requestBody.reason = options.reason;
    }

    if (options.expiresAt) {
      requestBody.expiresAt =
        typeof options.expiresAt === 'string'
          ? options.expiresAt
          : options.expiresAt.toISOString();
    }

    // Make the POST request
    const response = yield* Effect.tryPromise({
      try: () =>
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(requestBody),
        }),
      catch: (error) => new UserBanError(`Failed to send ban request to ${url}`, error),
    });

    // Check response status
    if (!response.ok) {
      const errorText = yield* Effect.tryPromise({
        try: () => response.text(),
        catch: () => new UserBanError('Failed to read error response'),
      });
      return yield* Effect.fail(
        new UserBanError(`Ban user failed with status ${response.status}: ${errorText}`)
      );
    }

    // Parse the response
    const result = yield* Effect.tryPromise({
      try: () => response.json() as Promise<AdminUser>,
      catch: (error) => new UserBanError('Failed to parse ban response', error),
    });

    return result;
  });

/**
 * Unbans a previously banned user.
 *
 * @description This function uses the better-auth admin plugin to unban a user.
 * It makes a POST request to the `/api/auth/admin/unban-user` endpoint with the user ID.
 *
 * Note: This is a server-only operation that requires admin privileges.
 *
 * @param options - The options including the user ID to unban.
 * @param config - Configuration for the API endpoint, including base URL.
 * @returns {Effect.Effect<AdminUser, UserUnbanError>} An Effect that resolves with the unbanned
 * user object or fails with an error.
 *
 * @example
 * const options = { userId: 'user-123' };
 * const config = { baseUrl: 'http://localhost:3000' };
 * const unbanEffect = unbanUser(options, config);
 * const unbannedUser = await Effect.runPromise(unbanEffect);
 * // => { id: 'user-123', email: 'user@example.com', banned: false }
 *
 * @example
 * // Using in an admin workflow
 * const program = Effect.gen(function* () {
 *   const user = yield* unbanUser({ userId: 'user-456' }, config);
 *   console.log('User', user.email, 'has been unbanned');
 *   return user;
 * });
 */
export const unbanUser = (
  options: UnbanUserOptions,
  config: AdminConfig
): Effect.Effect<AdminUser, UserUnbanError> =>
  Effect.gen(function* () {
    // Validate user ID
    const validatedUserId = yield* Effect.mapError(
      validateUserId(options.userId),
      (err) => new UserUnbanError(err.message, err.cause)
    );

    // Build the endpoint URL
    const url = buildUnbanUrl(config);

    // Make the POST request
    const response = yield* Effect.tryPromise({
      try: () =>
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ userId: validatedUserId }),
        }),
      catch: (error) => new UserUnbanError(`Failed to send unban request to ${url}`, error),
    });

    // Check response status
    if (!response.ok) {
      const errorText = yield* Effect.tryPromise({
        try: () => response.text(),
        catch: () => new UserUnbanError('Failed to read error response'),
      });
      return yield* Effect.fail(
        new UserUnbanError(`Unban user failed with status ${response.status}: ${errorText}`)
      );
    }

    // Parse the response
    const result = yield* Effect.tryPromise({
      try: () => response.json() as Promise<AdminUser>,
      catch: (error) => new UserUnbanError('Failed to parse unban response', error),
    });

    return result;
  });

/**
 * Impersonates a user, allowing admins to access the system as that user.
 *
 * @description This function uses the better-auth admin plugin to impersonate a user.
 * It makes a POST request to the `/api/auth/admin/impersonate` endpoint with the user ID.
 * The response includes a new session for the impersonated user.
 *
 * Note: This is a server-only operation that requires admin privileges.
 *
 * @param options - The options including the user ID to impersonate.
 * @param config - Configuration for the API endpoint, including base URL.
 * @returns {Effect.Effect<ImpersonationResponse, ImpersonationError>} An Effect that resolves
 * with the impersonation session details or fails with an error.
 *
 * @example
 * const options = { userId: 'user-123' };
 * const config = { baseUrl: 'http://localhost:3000' };
 * const impersonateEffect = impersonateUser(options, config);
 * const session = await Effect.runPromise(impersonateEffect);
 * // => { sessionId: 'sess-789', userId: 'user-123', impersonatedBy: 'admin-456' }
 *
 * @example
 * // Using for debugging user issues
 * const program = Effect.gen(function* () {
 *   const session = yield* impersonateUser({ userId: 'user-with-issue' }, config);
 *   console.log('Now logged in as user:', session.userId);
 *   console.log('Impersonation session:', session.sessionId);
 *   return session;
 * });
 */
export const impersonateUser = (
  options: ImpersonateUserOptions,
  config: AdminConfig
): Effect.Effect<ImpersonationResponse, ImpersonationError> =>
  Effect.gen(function* () {
    // Validate user ID
    const validatedUserId = yield* Effect.mapError(
      validateUserId(options.userId),
      (err) => new ImpersonationError(err.message, err.cause)
    );

    // Build the endpoint URL
    const url = buildImpersonateUrl(config);

    // Make the POST request
    const response = yield* Effect.tryPromise({
      try: () =>
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ userId: validatedUserId }),
        }),
      catch: (error) =>
        new ImpersonationError(`Failed to send impersonation request to ${url}`, error),
    });

    // Check response status
    if (!response.ok) {
      const errorText = yield* Effect.tryPromise({
        try: () => response.text(),
        catch: () => new ImpersonationError('Failed to read error response'),
      });
      return yield* Effect.fail(
        new ImpersonationError(
          `Impersonate user failed with status ${response.status}: ${errorText}`
        )
      );
    }

    // Parse the response
    const result = yield* Effect.tryPromise({
      try: () => response.json() as Promise<ImpersonationResponse>,
      catch: (error) =>
        new ImpersonationError('Failed to parse impersonation response', error),
    });

    return result;
  });
