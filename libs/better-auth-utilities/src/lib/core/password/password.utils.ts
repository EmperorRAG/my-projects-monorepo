/**
 * @module password.utils
 * @description Provides core utilities for password management in better-auth.
 * These functions are designed using the Effect-TS functional programming paradigm.
 */

import { Effect } from 'effect';
import {
  hashPassword as betterAuthHashPassword,
  verifyPassword as betterAuthVerifyPassword,
} from 'better-auth/crypto';

// ============================================================================
// Types and Interfaces
// ============================================================================

/**
 * Options for password verification.
 */
export interface VerifyPasswordOptions {
  hash: string;
  password: string;
}

// ============================================================================
// Error Classes
// ============================================================================

/**
 * Error thrown when password hashing fails.
 */
export class PasswordHashError extends Error {
  readonly _tag = 'PasswordHashError';
  constructor(message: string, public override readonly cause?: unknown) {
    super(message);
    this.name = 'PasswordHashError';
  }
}

/**
 * Error thrown when password verification fails.
 */
export class PasswordVerificationError extends Error {
  readonly _tag = 'PasswordVerificationError';
  constructor(message: string, public override readonly cause?: unknown) {
    super(message);
    this.name = 'PasswordVerificationError';
  }
}

// ============================================================================
// Main Functions
// ============================================================================

/**
 * Hashes a plain-text password.
 *
 * @description This function takes a plain-text password and returns a hashed version using the
 * scrypt algorithm from `better-auth`. The computation is wrapped in `Effect.tryPromise` since
 * hashing is an asynchronous operation.
 *
 * @fp-pattern Effect-based async computation with error handling
 *
 * @param password - The plain-text password to hash.
 * @returns {Effect.Effect<string, PasswordHashError, never>} An `Effect` that asynchronously
 * computes and returns the hashed password, or fails with a `PasswordHashError`.
 *
 * @example
 * ```typescript
 * import { Effect } from 'effect';
 * import { hashPassword } from './password.utils';
 *
 * const program = hashPassword('mySecurePassword123');
 * const hash = await Effect.runPromise(program);
 * // => "a1b2c3d4e5f6:0123456789abcdef..."
 * ```
 */
export const hashPassword = (password: string): Effect.Effect<string, PasswordHashError, never> =>
  Effect.tryPromise({
    try: () => betterAuthHashPassword(password),
    catch: (error) =>
      new PasswordHashError(
        'Failed to hash password',
        error
      ),
  });

/**
 * Verifies a plain-text password against a hash.
 *
 * @description This function compares a plain-text password with a stored hash to check for a match.
 * The comparison uses constant-time comparison to prevent timing attacks. The computation is wrapped
 * in `Effect.tryPromise` since verification is an asynchronous operation.
 *
 * @fp-pattern Effect-based async computation with error handling
 *
 * @param password - The plain-text password.
 * @param hash - The password hash to compare against.
 * @returns {Effect.Effect<boolean, PasswordVerificationError, never>} An `Effect` that asynchronously
 * returns `true` if the password is valid, and `false` otherwise, or fails with a `PasswordVerificationError`.
 *
 * @example
 * ```typescript
 * import { Effect } from 'effect';
 * import { verifyPassword } from './password.utils';
 *
 * const hash = "a1b2c3d4e5f6:0123456789abcdef...";
 * const program = verifyPassword('mySecurePassword123', hash);
 * const isValid = await Effect.runPromise(program);
 * // => true
 * ```
 */
export const verifyPassword = (
  password: string,
  hash: string
): Effect.Effect<boolean, PasswordVerificationError, never> =>
  Effect.tryPromise({
    try: () => betterAuthVerifyPassword({ hash, password }),
    catch: (error) =>
      new PasswordVerificationError(
        'Failed to verify password',
        error
      ),
  });
