/**
 * @module emailing.utils
 * @description Provides core utilities for handling emails in better-auth.
 * These functions are designed using the Effect-TS functional programming paradigm.
 */

// AI-GENERATED FILE - DO NOT EDIT

// @ai-prompt
// Implement a utility function `sendVerificationEmail` using Effect-TS.
// 1.  The function should accept a user object containing their email and a verification token.
// 2.  It should use the `better-auth` emailing functionality to send a verification email.
// 3.  This is a side effect, so the entire operation must be wrapped in an `Effect`.
// 4.  The `Effect` should succeed with `void` if the email is sent successfully.
// 5.  It should fail with an `EmailServiceError` if the email service is down or misconfigured.
// 6.  Follow the JSDoc template for effectful functions.
/**
 * Sends a verification email to a user.
 *
 * @description This function constructs and sends a verification email to the user.
 * The process is managed as an `Effect` to handle the side effect of sending an email
 * and to manage potential failures in the email service.
 *
 * @param user - The user object, containing at least the email address.
 * @param token - The verification token to be included in the email.
 * @returns {Effect.Effect<void, EmailServiceError, EmailService>} An `Effect` that, when run,
 * sends the email. It completes with `void` on success and fails with an `EmailServiceError` on failure.
 * It requires an `EmailService` in its context.
 */
export const sendVerificationEmail = (user: any, token: string) => {
  // AI, implement the function here.
};
