/**
 * @module users.utils
 * @description Provides core utilities for user management in better-auth.
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
 * Error thrown when attempting to create a user that already exists.
 */
export class UserExistsError extends Error {
  readonly _tag = 'UserExistsError';

  constructor(
    message: string,
    public readonly email?: string,
    public override readonly cause?: unknown
  ) {
    super(message);
    this.name = 'UserExistsError';
  }
}

/**
 * Error thrown when a database operation fails.
 */
export class DatabaseError extends Error {
  readonly _tag = 'DatabaseError';

  constructor(
    message: string,
    public override readonly cause?: unknown
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Minimal Prisma Client interface for user operations.
 */
export interface PrismaClient {
  readonly user: {
    readonly findUnique: (args: { where: { id: string } }) => Promise<User | null>;
    readonly findFirst: (args: { where: { email: string } }) => Promise<User | null>;
    readonly create: (args: { data: CreateUserData }) => Promise<User>;
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
  readonly bannedUntil?: Date | null;
  readonly banned?: boolean | null;
  readonly banReason?: string | null;
  readonly banExpires?: Date | null;
}

/**
 * Data required to create a new user.
 */
export interface CreateUserData {
  readonly email: string;
  readonly name: string;
  readonly emailVerified?: boolean;
  readonly image?: string | null;
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
 * Validates user creation data.
 *
 * @pure
 * @description Ensures required fields (email, name) are present and valid.
 *
 * @fp-pattern Pure function returning Effect for validation
 * @composition N/A - Single operation
 *
 * @param userData - The user data to validate.
 * @returns {Effect.Effect<CreateUserData, UserExistsError>} Effect containing validated data or error.
 *
 * @example
 * const data = { email: 'user@example.com', name: 'John Doe' };
 * const validatedEffect = validateUserData(data);
 * // Effect.runSync(validatedEffect) => { email: 'user@example.com', name: 'John Doe' }
 */
export const validateUserData = (
  userData: CreateUserData
): Effect.Effect<CreateUserData, UserExistsError> =>
  Effect.try({
    try: () => {
      if (!userData.email || userData.email.trim().length === 0) {
        throw new UserExistsError('Email is required and cannot be empty');
      }
      if (!userData.name || userData.name.trim().length === 0) {
        throw new UserExistsError('Name is required and cannot be empty');
      }
      // Basic email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        throw new UserExistsError('Invalid email format', userData.email);
      }
      return userData;
    },
    catch: (error) =>
      error instanceof UserExistsError
        ? error
        : new UserExistsError('Failed to validate user data', undefined, error),
  });

/**
 * Checks if a user with the given email already exists.
 *
 * @description Queries the database to check for email uniqueness.
 *
 * @fp-pattern Effectful function with database dependency
 * @composition Uses PrismaClient from Context
 *
 * @param email - The email to check.
 * @returns {Effect.Effect<void, UserExistsError | DatabaseError, PrismaClientTag>}
 * Effect that succeeds if email is unique or fails if email exists or database error occurs.
 *
 * @example
 * const checkEffect = checkEmailUniqueness('user@example.com');
 * const result = await Effect.runPromise(
 *   Effect.provide(checkEffect, PrismaClientTag.of(prisma))
 * );
 */
export const checkEmailUniqueness = (
  email: string
): Effect.Effect<void, UserExistsError | DatabaseError, PrismaClientTag> =>
  Effect.gen(function* () {
    const prisma = yield* PrismaClientTag;

    // Query database for existing user
    const existingUser = yield* Effect.tryPromise({
      try: () => prisma.user.findFirst({ where: { email } }),
      catch: (error) =>
        new DatabaseError('Failed to check email uniqueness in database', error),
    });

    // If user exists, throw error
    if (existingUser) {
      return yield* Effect.fail(
        new UserExistsError(`User with email ${email} already exists`, email)
      );
    }

    return;
  });

// ============================================================================
// Main Utilities
// ============================================================================

/**
 * Finds a user by their ID.
 *
 * @description This function queries the database for a user with the given ID using Prisma.
 * The entire operation is wrapped in an `Effect` to handle potential failures like the user not being found
 * or a database connection issue. It uses the Effect Context pattern for dependency injection of PrismaClient.
 *
 * @param userId - The ID of the user to find.
 * @returns {Effect.Effect<User, UserNotFoundError | DatabaseError, PrismaClientTag>} An `Effect` that resolves
 * with the `User` object on success or fails with a `UserNotFoundError` or `DatabaseError`. It requires a `PrismaClient`
 * instance in its context.
 *
 * @example
 * import { PrismaClient } from '@prisma/client';
 * const prisma = new PrismaClient();
 * const userEffect = findUserById('user-123');
 * const user = await Effect.runPromise(
 *   Effect.provide(userEffect, PrismaClientTag.of(prisma))
 * );
 * // => { id: 'user-123', email: 'user@example.com', ... }
 *
 * @example
 * // Using with Effect.gen for composition
 * const program = Effect.gen(function* () {
 *   const user = yield* findUserById('user-456');
 *   console.log('Found user:', user.email);
 *   return user;
 * });
 */
export const findUserById = (
  userId: string
): Effect.Effect<User, UserNotFoundError | DatabaseError, PrismaClientTag> =>
  pipe(
    validateUserId(userId),
    Effect.flatMap((validatedId) =>
      Effect.gen(function* () {
        // Get PrismaClient from Context
        const prisma = yield* PrismaClientTag;

        // Query database for user
        const user = yield* Effect.tryPromise({
          try: () => prisma.user.findUnique({ where: { id: validatedId } }),
          catch: (error) =>
            new DatabaseError(
              `Failed to query user with ID ${validatedId} from database`,
              error
            ),
        });

        // Check if user was found
        if (!user) {
          return yield* Effect.fail(
            new UserNotFoundError(
              `User with ID ${validatedId} not found`,
              validatedId
            )
          );
        }

        return user;
      })
    )
  );

/**
 * Creates a new user in the database.
 *
 * @description This function uses Prisma to create a new user with the provided data.
 * It returns an `Effect` that encapsulates the creation process, handling potential errors
 * such as a user with the same email already existing or database connection issues.
 * The function uses the Effect Context pattern for dependency injection of PrismaClient.
 *
 * @param userData - The data for the new user (email, name, optional image and emailVerified).
 * @returns {Effect.Effect<User, UserExistsError | DatabaseError, PrismaClientTag>} An `Effect` that resolves
 * with the newly created `User` object or fails with a `UserExistsError` or `DatabaseError`.
 *
 * @example
 * import { PrismaClient } from '@prisma/client';
 * const prisma = new PrismaClient();
 * const userData = { email: 'newuser@example.com', name: 'Jane Doe' };
 * const createEffect = createUser(userData);
 * const newUser = await Effect.runPromise(
 *   Effect.provide(createEffect, PrismaClientTag.of(prisma))
 * );
 * // => { id: 'user-789', email: 'newuser@example.com', name: 'Jane Doe', ... }
 *
 * @example
 * // Using with Effect.gen for composition
 * const program = Effect.gen(function* () {
 *   const newUser = yield* createUser({
 *     email: 'admin@example.com',
 *     name: 'Admin User',
 *     emailVerified: true
 *   });
 *   console.log('Created user:', newUser.id);
 *   return newUser;
 * });
 */
export const createUser = (
  userData: CreateUserData
): Effect.Effect<User, UserExistsError | DatabaseError, PrismaClientTag> =>
  pipe(
    validateUserData(userData),
    Effect.flatMap((validatedData) =>
      Effect.gen(function* () {
        // Check if user with email already exists
        yield* checkEmailUniqueness(validatedData.email);

        // Get PrismaClient from Context
        const prisma = yield* PrismaClientTag;

        // Create the user in the database
        const newUser = yield* Effect.tryPromise({
          try: () => prisma.user.create({ data: validatedData }),
          catch: (error) => {
            // Check if it's a unique constraint violation
            if (
              error &&
              typeof error === 'object' &&
              'code' in error &&
              error.code === 'P2002'
            ) {
              return new UserExistsError(
                `User with email ${validatedData.email} already exists`,
                validatedData.email,
                error
              );
            }
            return new DatabaseError(
              'Failed to create user in database',
              error
            );
          },
        });

        return newUser;
      })
    )
  );
