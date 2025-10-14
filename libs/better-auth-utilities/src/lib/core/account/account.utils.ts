/**
 * @module account.utils
 * @description Provides core utilities for account management in better-auth.
 * These functions are designed using the Effect-TS functional programming paradigm.
 */

// AI-GENERATED FILE - DO NOT EDIT

// @ai-prompt
// Implement a utility function `lockAccount` using Effect-TS.
// 1.  The function should accept a user ID.
// 2.  It should use the `better-auth` API to mark the user's account as locked.
// 3.  This is an effectful operation that modifies the user's state in the database via the Prisma adapter.
// 4.  The `Effect` should succeed with the updated `User` object.
// 5.  It should fail with a `UserNotFoundError` if the user doesn't exist or a `DatabaseError` for other DB issues.
// 6.  Follow the JSDoc template for effectful functions.
/**
 * Locks a user's account.
 *
 * @description This function updates the user's account status to 'locked' in the database.
 * It is an effectful operation managed by `Effect` to handle database interactions and potential errors.
 *
 * @param userId - The ID of the user whose account is to be locked.
 * @returns {Effect.Effect<User, UserNotFoundError | DatabaseError, PrismaClient>} An `Effect` that resolves
 * with the updated `User` object or fails if the user is not found or a database error occurs.
 */
export const lockAccount = (userId: string) => {
  // AI, implement the function here.
};
