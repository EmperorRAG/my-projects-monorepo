/**
 * @module multi-session.utils
 * @description Utilities for the better-auth Multi-Session plugin using Effect-TS.
 */

import { Effect } from 'effect';

export class MultiSessionError extends Error {
  readonly _tag = 'MultiSessionError';
  constructor(message: string, public override readonly cause?: unknown) {
    super(message);
    this.name = 'MultiSessionError';
  }
}

export interface MultiSessionConfig {
  readonly baseUrl: string;
  readonly listEndpoint?: string;
  readonly revokeEndpoint?: string;
}

export interface Session {
  readonly id: string;
  readonly userId: string;
  readonly deviceName?: string;
  readonly createdAt: string;
  readonly lastActiveAt: string;
}

export const buildListSessionsUrl = (config: MultiSessionConfig): string =>
  `${config.baseUrl}${config.listEndpoint || '/api/auth/sessions'}`;

export const buildRevokeSessionUrl = (config: MultiSessionConfig): string =>
  `${config.baseUrl}${config.revokeEndpoint || '/api/auth/sessions/revoke'}`;

/**
 * Lists all active sessions for the current user.
 *
 * @param config - Configuration for the API endpoint.
 * @returns {Effect.Effect<readonly Session[], MultiSessionError>} Effect with sessions list.
 *
 * @example
 * const sessions = await Effect.runPromise(listSessions({ baseUrl: 'http://localhost:3000' }));
 */
export const listSessions = (
  config: MultiSessionConfig
): Effect.Effect<readonly Session[], MultiSessionError> =>
  Effect.gen(function* () {
    const url = buildListSessionsUrl(config);
    const response = yield* Effect.tryPromise({
      try: () => fetch(url, { method: 'GET', credentials: 'include' }),
      catch: (error) => new MultiSessionError(`Failed to fetch sessions from ${url}`, error),
    });

    if (!response.ok) {
      const errorText = yield* Effect.tryPromise({
        try: () => response.text(),
        catch: () => new MultiSessionError('Failed to read error response'),
      });
      return yield* Effect.fail(
        new MultiSessionError(`List sessions failed with status ${response.status}: ${errorText}`)
      );
    }

    const sessions = yield* Effect.tryPromise({
      try: () => response.json() as Promise<readonly Session[]>,
      catch: (error) => new MultiSessionError('Failed to parse sessions response', error),
    });

    return sessions;
  });

/**
 * Revokes a specific session.
 *
 * @param sessionId - The ID of the session to revoke.
 * @param config - Configuration for the API endpoint.
 * @returns {Effect.Effect<void, MultiSessionError>} Effect that succeeds or fails.
 *
 * @example
 * await Effect.runPromise(revokeSession('sess-123', { baseUrl: 'http://localhost:3000' }));
 */
export const revokeSession = (
  sessionId: string,
  config: MultiSessionConfig
): Effect.Effect<void, MultiSessionError> =>
  Effect.gen(function* () {
    if (!sessionId || sessionId.trim().length === 0) {
      return yield* Effect.fail(new MultiSessionError('Session ID is required'));
    }

    const url = buildRevokeSessionUrl(config);
    const response = yield* Effect.tryPromise({
      try: () =>
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ sessionId }),
        }),
      catch: (error) => new MultiSessionError(`Failed to revoke session at ${url}`, error),
    });

    if (!response.ok) {
      const errorText = yield* Effect.tryPromise({
        try: () => response.text(),
        catch: () => new MultiSessionError('Failed to read error response'),
      });
      return yield* Effect.fail(
        new MultiSessionError(`Revoke session failed with status ${response.status}: ${errorText}`)
      );
    }

    return;
  });
