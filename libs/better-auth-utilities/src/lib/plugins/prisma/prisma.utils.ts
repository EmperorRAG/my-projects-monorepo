/**
 * @module prisma.utils
 * @description Provides utilities for interacting with the `better-auth` Prisma plugin.
 * These functions are designed using the Effect-TS functional programming paradigm.
 */

import { Effect } from 'effect';
import { prismaAdapter } from 'better-auth/adapters/prisma';

/**
 * Type representing a Prisma Client instance.
 * This is a minimal type definition to avoid direct dependency on @prisma/client.
 */
export interface PrismaClientLike {
  readonly $connect: () => Promise<void>;
  readonly $disconnect: () => Promise<void>;
  [key: string]: unknown;
}

/**
 * Error type for Prisma adapter initialization failures.
 */
export class PrismaAdapterError {
  readonly _tag = 'PrismaAdapterError';
  constructor(
    readonly message: string,
    readonly cause?: unknown
  ) {}
}

/**
 * Supported database providers for the Prisma adapter.
 * Based on better-auth's supported database providers.
 */
export type DatabaseProvider =
  | 'postgresql'
  | 'mysql'
  | 'sqlite'
  | 'mongodb'
  | 'cockroachdb'
  | 'sqlserver';

/**
 * Configuration options for the Prisma adapter.
 */
export interface PrismaAdapterConfig {
  readonly provider: DatabaseProvider;
  readonly usePlural?: boolean;
}

/**
 * The return type of the prismaAdapter function from better-auth.
 */
export type PrismaAdapter = ReturnType<typeof prismaAdapter>;

/**
 * Validates the PrismaClient instance.
 *
 * @pure
 * @description Checks if the provided value is a valid PrismaClient instance.
 *
 * @param prisma - The value to validate as a PrismaClient instance.
 * @returns {Effect.Effect<PrismaClientLike, PrismaAdapterError, never>} An Effect that succeeds with the PrismaClient or fails with PrismaAdapterError.
 *
 * @example
 * const prisma = new PrismaClient();
 * const result = Effect.runSync(validatePrismaClient(prisma));
 * // => PrismaClient instance
 */
export const validatePrismaClient = (
  prisma: unknown
): Effect.Effect<PrismaClientLike, PrismaAdapterError, never> =>
  Effect.try({
    try: () => {
      if (!prisma || typeof prisma !== 'object') {
        throw new PrismaAdapterError('PrismaClient instance is required');
      }
      // Basic check to ensure it has PrismaClient-like properties
      if (!('$connect' in prisma && '$disconnect' in prisma)) {
        throw new PrismaAdapterError(
          'Provided object does not appear to be a valid PrismaClient instance'
        );
      }
      return prisma as PrismaClientLike;
    },
    catch: (error) =>
      error instanceof PrismaAdapterError
        ? error
        : new PrismaAdapterError('Failed to validate PrismaClient', error),
  });

/**
 * Validates the database provider.
 *
 * @pure
 * @description Checks if the provided database provider is supported.
 *
 * @param provider - The database provider to validate.
 * @returns {Effect.Effect<DatabaseProvider, PrismaAdapterError, never>} An Effect that succeeds with the provider or fails with PrismaAdapterError.
 *
 * @example
 * const result = Effect.runSync(validateDatabaseProvider('postgresql'));
 * // => 'postgresql'
 */
export const validateDatabaseProvider = (
  provider: string
): Effect.Effect<DatabaseProvider, PrismaAdapterError, never> => {
  const validProviders: DatabaseProvider[] = [
    'postgresql',
    'mysql',
    'sqlite',
    'mongodb',
    'cockroachdb',
    'sqlserver',
  ];

  return Effect.try({
    try: () => {
      if (!validProviders.includes(provider as DatabaseProvider)) {
        throw new PrismaAdapterError(
          `Invalid database provider: ${provider}. Must be one of: ${validProviders.join(', ')}`
        );
      }
      return provider as DatabaseProvider;
    },
    catch: (error) =>
      error instanceof PrismaAdapterError
        ? error
        : new PrismaAdapterError('Failed to validate database provider', error),
  });
};

/**
 * Creates the Prisma adapter configuration object.
 *
 * @pure
 * @description Constructs the configuration object for the better-auth Prisma adapter.
 *
 * @param provider - The validated database provider.
 * @param usePlural - Optional flag to use plural table names (default: false).
 * @returns {PrismaAdapterConfig} The adapter configuration object.
 *
 * @example
 * const config = buildAdapterConfig('postgresql', true);
 * // => { provider: 'postgresql', usePlural: true }
 */
export const buildAdapterConfig = (
  provider: DatabaseProvider,
  usePlural = false
): PrismaAdapterConfig => ({
  provider,
  usePlural,
});

/**
 * Initializes the better-auth Prisma adapter.
 *
 * @pure
 * @description This function takes a `PrismaClient` instance and configures the `better-auth`
 * Prisma adapter with it. It validates the inputs, builds the configuration, and returns an
 * `Effect` that provides the configured adapter.
 *
 * @fp-pattern Higher-order function with validation and dependency injection
 * @composition Composes validatePrismaClient, validateDatabaseProvider, and prismaAdapter
 *   - `pipe(validatePrismaClient, Effect.flatMap(validateProvider), Effect.map(createAdapter))`
 *
 * @param prisma - An instance of `PrismaClient`.
 * @param config - Configuration options for the adapter.
 * @returns {Effect.Effect<PrismaAdapter, PrismaAdapterError, never>} An `Effect` that resolves with the configured Prisma adapter.
 *
 * @example
 * import { PrismaClient } from '@prisma/client';
 * const prisma = new PrismaClient();
 * const adapterEffect = initializePrismaAdapter(prisma, { provider: 'postgresql' });
 * const adapter = Effect.runSync(adapterEffect);
 * // => Configured Prisma adapter for better-auth
 */
export const initializePrismaAdapter = (
  prisma: unknown,
  config: { provider: string; usePlural?: boolean }
): Effect.Effect<PrismaAdapter, PrismaAdapterError, never> =>
  Effect.gen(function* () {
    // Validate the PrismaClient instance
    const validatedPrisma = yield* validatePrismaClient(prisma);

    // Validate the database provider
    const validatedProvider = yield* validateDatabaseProvider(config.provider);

    // Build the adapter configuration
    const adapterConfig = buildAdapterConfig(
      validatedProvider,
      config.usePlural
    );

    // Create and return the Prisma adapter
    return yield* Effect.try({
      try: () => prismaAdapter(validatedPrisma, adapterConfig),
      catch: (error) =>
        new PrismaAdapterError('Failed to initialize Prisma adapter', error),
    });
  });
