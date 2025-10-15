/**
 * @module account.utils
 * @description Provides core utilities for account management in better-auth.
 * These functions are designed using the Effect-TS functional programming paradigm.
 */

import { Context, Effect, pipe } from 'effect';

// ============================================================================
// Custom Error Classes
// ============================================================================

/**
 * Error thrown when a user is not found in the database.
 */
export class UserNotFoundError extends Error {
  readonly _tag = 'UserNotFoundError';

  constructor(
    message: string,
    public readonly userId?: string,
    public override readonly cause?: unknown
  ) {
    super(message);
    this.name = 'UserNotFoundError';
  }
}

/**
 * Error thrown when a database operation fails.
 */
export class DatabaseError extends Error {
  readonly _tag = 'DatabaseError';

  constructor(message: string, public override readonly cause?: unknown) {
    super(message);
    this.name = 'DatabaseError';
  }
}

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Minimal Prisma Client interface for account operations.
 */
export interface PrismaClient {
  readonly user: {
    readonly findUnique: (args: {
      where: { id: string };
    }) => Promise<User | null>;
    readonly update: (args: {
      where: { id: string };
      data: Partial<User>;
    }) => Promise<User>;
  };
}

/**
 * User model representing a user in the database.
 */
export interface User {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly emailVerified: boolean;
  readonly image?: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly banned?: boolean | null;
  readonly bannedUntil?: Date | null;
  readonly banReason?: string | null;
  readonly banExpires?: Date | null;
}

/**
 * Tag for the PrismaClient using Context.Tag pattern.
 */
export class PrismaClientTag extends Context.Tag('PrismaClient')<
  PrismaClientTag,
  PrismaClient
>() {}

// ============================================================================
// Supporting Utilities
// ============================================================================

/**
 * Validates a user ID.
 *
 * @pure
 * @description Ensures the user ID is a non-empty string.
 *
 * @fp-pattern Pure function returning Effect for validation
 * @composition N/A - Single operation
 *
 * @param userId - The user ID to validate.
 * @returns {Effect.Effect<string, UserNotFoundError>} Effect containing validated ID or error.
 *
 * @example
 * const validatedEffect = validateUserId('user-123');
 * // Effect.runSync(validatedEffect) => 'user-123'
 */
export const validateUserId = (
  userId: string
): Effect.Effect<string, UserNotFoundError> =>
  Effect.try({
    try: () => {
      if (!userId || userId.trim().length === 0) {
        throw new UserNotFoundError('User ID is required and cannot be empty');
      }
      return userId;
    },
    catch: (error) =>
      error instanceof UserNotFoundError
        ? error
        : new UserNotFoundError('Failed to validate user ID', undefined, error),
  });

/**
 * Checks if a user exists in the database.
 *
 * @description Queries the database to verify user existence.
 *
 * @fp-pattern Effectful function with database dependency
 * @composition Uses PrismaClient from Context
 *
 * @param userId - The user ID to check.
 * @returns {Effect.Effect<void, UserNotFoundError | DatabaseError, PrismaClientTag>}
 * Effect that succeeds if user exists or fails with UserNotFoundError.
 *
 * @example
 * const checkEffect = checkUserExists('user-123');
 * const result = await Effect.runPromise(
 *   Effect.provide(checkEffect, PrismaClientTag.of(prisma))
 * );
 */
export const checkUserExists = (
  userId: string
): Effect.Effect<void, UserNotFoundError | DatabaseError, PrismaClientTag> =>
  Effect.gen(function* () {
    const prisma = yield* PrismaClientTag;

    // Query database for user
    const user = yield* Effect.tryPromise({
      try: () => prisma.user.findUnique({ where: { id: userId } }),
      catch: (error) =>
        new DatabaseError(
          `Failed to query user with ID ${userId} from database`,
          error
        ),
    });

    // If user doesn't exist, throw error
    if (!user) {
      return yield* Effect.fail(
        new UserNotFoundError(`User with ID ${userId} not found`, userId)
      );
    }

    return;
  });

// ============================================================================
// Main Utilities
// ============================================================================

/**
 * Locks a user's account by setting their banned status.
 *
 * @description This function updates the user's account in the database to mark it as banned/locked.
 * It sets the `banned` field to `true` and optionally provides a ban reason. The user will be unable
 * to sign in until the account is unlocked. This is an effectful operation that uses Prisma to modify
 * the database state. It uses the Effect Context pattern for dependency injection of PrismaClient.
 *
 * @param userId - The ID of the user whose account is to be locked.
 * @param reason - Optional reason for locking the account. Defaults to 'Account locked by administrator'.
 * @returns {Effect.Effect<User, UserNotFoundError | DatabaseError, PrismaClientTag>} An `Effect` that resolves
 * with the updated `User` object or fails if the user is not found or a database error occurs.
 * Requires a `PrismaClient` instance in its context.
 *
 * @example
 * import { PrismaClient } from '@prisma/client';
 * const prisma = new PrismaClient();
 * const lockEffect = lockAccount('user-123');
 * const lockedUser = await Effect.runPromise(
 *   Effect.provide(lockEffect, PrismaClientTag.of(prisma))
 * );
 * // => { id: 'user-123', email: 'user@example.com', banned: true, ... }
 *
 * @example
 * // With custom reason
 * const lockEffect = lockAccount('user-456', 'Terms of service violation');
 * const lockedUser = await Effect.runPromise(
 *   Effect.provide(lockEffect, PrismaClientTag.of(prisma))
 * );
 *
 * @example
 * // Using with Effect.gen for composition
 * const program = Effect.gen(function* () {
 *   const lockedUser = yield* lockAccount('user-789', 'Suspicious activity');
 *   console.log('Locked user:', lockedUser.email);
 *   return lockedUser;
 * });
 */
export const lockAccount = (
  userId: string,
  reason = 'Account locked by administrator'
): Effect.Effect<User, UserNotFoundError | DatabaseError, PrismaClientTag> =>
  pipe(
    validateUserId(userId),
    Effect.flatMap((validatedId) =>
      Effect.gen(function* () {
        // Check if user exists
        yield* checkUserExists(validatedId);

        // Get PrismaClient from Context
        const prisma = yield* PrismaClientTag;

        // Update user to set banned status
        const updatedUser = yield* Effect.tryPromise({
          try: () =>
            prisma.user.update({
              where: { id: validatedId },
              data: {
                banned: true,
                banReason: reason,
                bannedUntil: null, // Permanent ban (no expiration)
              },
            }),
          catch: (error) => {
            // Check if it's a record not found error
            if (
              error &&
              typeof error === 'object' &&
              'code' in error &&
              error.code === 'P2025'
            ) {
              return new UserNotFoundError(
                `User with ID ${validatedId} not found`,
                validatedId,
                error
              );
            }
            return new DatabaseError(
              `Failed to lock account for user ${validatedId}`,
              error
            );
          },
        });

        return updatedUser;
      })
    )
  );
