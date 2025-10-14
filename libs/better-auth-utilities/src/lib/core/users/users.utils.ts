/**
 * @module users.utils
 * @description Provides core utilities for user management in better-auth.
 * These functions are designed using the Effect-TS functional programming paradigm.
 */

// AI-GENERATED FILE - DO NOT EDIT

// @ai-prompt
// Implement a utility function `findUserById` using Effect-TS and the Prisma adapter.
// 1.  The function should accept a user ID as a string.
// 2.  It should use the `better-auth` Prisma adapter to find the user in the database.
// 3.  The operation should be wrapped in an `Effect`.
// 4.  If the user is found, the `Effect` should succeed with the `User` object.
// 5.  If the user is not found, the `Effect` should fail with a `UserNotFoundError`.
// 6.  If there is a database error, the `Effect` should fail with a `DatabaseError`.
// 7.  Use `pipe` for any composition.
// 8.  Follow the JSDoc template for effectful functions.
/**
 * Finds a user by their ID.
 *
 * @description This function queries the database for a user with the given ID using the Prisma adapter.
 * The entire operation is wrapped in an `Effect` to handle potential failures like the user not being found
 * or a database connection issue.
 *
 * @param userId - The ID of the user to find.
 * @returns {Effect.Effect<User, UserNotFoundError | DatabaseError, PrismaClient>} An `Effect` that resolves
 * with the `User` object on success or fails with a `UserNotFoundError` or `DatabaseError`. It requires a `PrismaClient`
 * instance in its context.
 */
export const findUserById = (userId: string) => {
  // AI, implement the function here.
};

// @ai-prompt
// Implement a utility function `createUser` using Effect-TS and the Prisma adapter.
// 1.  The function should accept user creation data (e.g., email, password hash).
// 2.  It should use the `better-auth` Prisma adapter to create a new user.
// 3.  The operation should be wrapped in an `Effect`.
// 4.  If the user is created successfully, the `Effect` should succeed with the new `User` object.
// 5.  If a user with the same email already exists, it should fail with a `UserExistsError`.
// 6.  Follow the JSDoc template for effectful functions.
/**
 * Creates a new user in the database.
 *
 * @description This function uses the Prisma adapter to create a new user with the provided data.
 * It returns an `Effect` that encapsulates the creation process, handling potential errors
 * such as a user with the same email already existing.
 *
 * @param userData - The data for the new user.
 * @returns {Effect.Effect<User, UserExistsError | DatabaseError, PrismaClient>} An `Effect` that resolves
 * with the newly created `User` object or fails with a `UserExistsError` or `DatabaseError`.
 */
export const createUser = (userData: any) => {
  // AI, implement the function here.
};
