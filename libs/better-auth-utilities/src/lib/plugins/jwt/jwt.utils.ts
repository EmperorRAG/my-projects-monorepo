/**
 * @module jwt.utils
 * @description Provides utilities for interacting with the `better-auth` JWT plugin.
 * These functions are designed using the Effect-TS functional programming paradigm.
 */

// AI-GENERATED FILE - DO NOT EDIT

// @ai-prompt
// Implement a utility function `generateJwt` using Effect-TS.
// 1.  The function should accept a user session object.
// 2.  It should use the `better-auth` JWT plugin's API to generate a new JWT.
// 3.  This is an effectful operation.
// 4.  The `Effect` should succeed with the JWT string.
// 5.  It should fail with a `JwtGenerationError`.
// 6.  Follow the JSDoc template for effectful functions.
/**
 * Generates a JSON Web Token (JWT) for a given user session.
 *
 * @description This function uses the `better-auth` JWT plugin to create a token.
 * The process is wrapped in an `Effect` to handle potential errors during token generation.
 *
 * @param session - The user session object to be encoded in the JWT.
 * @returns {Effect.Effect<string, JwtGenerationError, JwtService>} An `Effect` that resolves with the
 * JWT string or fails with a `JwtGenerationError`. Requires a `JwtService` in its context.
 */
export const generateJwt = (session: any) => {
  // AI, implement the function here.
};

// @ai-prompt
// Implement a utility function `verifyJwt` using Effect-TS.
// 1.  The function should accept a JWT string.
// 2.  It should use the `better-auth` JWT plugin's API to verify the token.
// 3.  This is an effectful operation.
// 4.  The `Effect` should succeed with the decoded payload (session object).
// 5.  It should fail with a `JwtValidationError` if the token is invalid or expired.
// 6.  Follow the JSDoc template for effectful functions.
/**
 * Verifies a JSON Web Token (JWT).
 *
 * @description This function validates a JWT string using the `better-auth` JWT plugin.
 * It returns an `Effect` that resolves with the decoded session payload if the token is valid,
 * or fails with a `JwtValidationError` if it is not.
 *
 * @param token - The JWT string to verify.
 * @returns {Effect.Effect<Session, JwtValidationError, JwtService>} An `Effect` that resolves with the
 * decoded session or fails with a validation error. Requires a `JwtService` in its context.
 */
export const verifyJwt = (token: string) => {
  // AI, implement the function here.
};
