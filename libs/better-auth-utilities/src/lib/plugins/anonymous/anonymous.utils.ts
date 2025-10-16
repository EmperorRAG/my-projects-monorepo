/**
 * @module anonymous.utils
 * @description Utilities for the better-auth Anonymous plugin using Effect-TS.
 */

import { Effect } from 'effect';

export class AnonymousAuthError extends Error {
  readonly _tag = 'AnonymousAuthError';
  constructor(message: string, public override readonly cause?: unknown) {
    super(message);
    this.name = 'AnonymousAuthError';
  }
}

export interface AnonymousConfig {
  readonly baseUrl: string;
  readonly signInEndpoint?: string;
  readonly linkAccountEndpoint?: string;
}

export interface AnonymousSession {
  readonly userId: string;
  readonly sessionId: string;
  readonly isAnonymous: boolean;
}

export const buildAnonymousSignInUrl = (config: AnonymousConfig): string =>
  `${config.baseUrl}${config.signInEndpoint || '/api/auth/anonymous/sign-in'}`;

export const buildLinkAccountUrl = (config: AnonymousConfig): string =>
  `${config.baseUrl}${config.linkAccountEndpoint || '/api/auth/anonymous/link-account'}`;

/**
 * Signs in anonymously without credentials.
 *
 * @param config - Configuration for the API endpoint.
 * @returns {Effect.Effect<AnonymousSession, AnonymousAuthError>} Effect with anonymous session.
 *
 * @example
 * const session = await Effect.runPromise(signInAnonymously({ baseUrl: 'http://localhost:3000' }));
 */
export const signInAnonymously = (
  config: AnonymousConfig
): Effect.Effect<AnonymousSession, AnonymousAuthError> =>
  Effect.gen(function* () {
    const url = buildAnonymousSignInUrl(config);
    const response = yield* Effect.tryPromise({
      try: () =>
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        }),
      catch: (error) => new AnonymousAuthError(`Failed to sign in anonymously at ${url}`, error),
    });

    if (!response.ok) {
      const errorText = yield* Effect.tryPromise({
        try: () => response.text(),
        catch: () => new AnonymousAuthError('Failed to read error response'),
      });
      return yield* Effect.fail(
        new AnonymousAuthError(`Anonymous sign-in failed with status ${response.status}: ${errorText}`)
      );
    }

    const session = yield* Effect.tryPromise({
      try: () => response.json() as Promise<AnonymousSession>,
      catch: (error) => new AnonymousAuthError('Failed to parse session response', error),
    });

    return session;
  });

/**
 * Links an anonymous account to a real account.
 *
 * @param email - The email to link to.
 * @param password - The password for the account.
 * @param config - Configuration for the API endpoint.
 * @returns {Effect.Effect<void, AnonymousAuthError>} Effect that succeeds or fails.
 *
 * @example
 * await Effect.runPromise(
 *   linkAnonymousAccount('user@example.com', 'password123', { baseUrl: 'http://localhost:3000' })
 * );
 */
export const linkAnonymousAccount = (
  email: string,
  password: string,
  config: AnonymousConfig
): Effect.Effect<void, AnonymousAuthError> =>
  Effect.gen(function* () {
    if (!email || !password) {
      return yield* Effect.fail(new AnonymousAuthError('Email and password are required'));
    }

    const url = buildLinkAccountUrl(config);
    const response = yield* Effect.tryPromise({
      try: () =>
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email, password }),
        }),
      catch: (error) => new AnonymousAuthError(`Failed to link account at ${url}`, error),
    });

    if (!response.ok) {
      const errorText = yield* Effect.tryPromise({
        try: () => response.text(),
        catch: () => new AnonymousAuthError('Failed to read error response'),
      });
      return yield* Effect.fail(
        new AnonymousAuthError(`Link account failed with status ${response.status}: ${errorText}`)
      );
    }

    return;
  });
