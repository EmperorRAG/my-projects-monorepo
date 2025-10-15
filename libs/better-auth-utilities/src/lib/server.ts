/**
 * @file libs/better-auth-utilities/src/lib/server.ts
 * @description Server-side better-auth instance creation with full plugin support.
 */

import { betterAuth } from 'better-auth';
import type { BetterAuthOptions } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import {
  apiKey,
  bearer,
  jwt,
  openAPI,
  twoFactor,
  admin,
  organization,
  username,
  magicLink,
  siwe,
  genericOAuth,
  oneTap,
  anonymous,
  phoneNumber,
  emailOTP,
  deviceAuthorization,
  lastLoginMethod,
  oneTimeToken,
  multiSession,
} from 'better-auth/plugins';
import type { BetterAuthConfig, AvailablePlugins } from './config';

// ============================================================================
// PLUGIN FACTORY FUNCTIONS
// ============================================================================

/**
 * Maps plugin names to their factory functions with configurations.
 * Each plugin returns a different type, so we use `any` for flexibility.
 */
const PLUGIN_FACTORIES: Record<
  AvailablePlugins,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (config?: unknown) => any
> = {
  // Core authentication plugins
  username: (config) => username(config as Parameters<typeof username>[0]),
  magicLink: (config) => magicLink(config as Parameters<typeof magicLink>[0]),
  twoFactor: (config) => twoFactor(config as Parameters<typeof twoFactor>[0]),
  admin: (config) => admin(config as Parameters<typeof admin>[0]),
  organization: (config) => organization(config as Parameters<typeof organization>[0]),
  passkey: () => {
    throw new Error('Passkey plugin requires @better-auth/passkey package or correct import path');
  },

  // OAuth/Auth plugins
  oidc: () => {
    throw new Error('OIDC plugin requires correct import or @better-auth/oidc package');
  },
  siwe: (config) => siwe(config as Parameters<typeof siwe>[0]),
  genericOAuth: (config) => genericOAuth(config as Parameters<typeof genericOAuth>[0]),
  oneTap: (config) => oneTap(config as Parameters<typeof oneTap>[0]),

  // Integration plugins (these would need the actual packages installed)
  stripe: () => {
    throw new Error('Stripe plugin requires @better-auth/stripe package');
  },
  polar: () => {
    throw new Error('Polar plugin requires @polar-sh/better-auth package');
  },
  dodopayments: () => {
    throw new Error('Dodo Payments plugin requires @dodopayments/better-auth package');
  },
  dubAnalytics: () => {
    throw new Error('Dub Analytics plugin requires @dub/better-auth package');
  },

  // Security plugins
  bearer: (config) => bearer(config as Parameters<typeof bearer>[0]),
  jwt: (config) => jwt(config as Parameters<typeof jwt>[0]),
  apiKey: (config) => apiKey(config as Parameters<typeof apiKey>[0]),
  haveIBeenPwned: () => {
    throw new Error('Have I Been Pwned plugin requires @better-auth/hibp package');
  },

  // Advanced plugins
  multiSession: (config) => multiSession(config as Parameters<typeof multiSession>[0]),
  anonymous: (config) => anonymous(config as Parameters<typeof anonymous>[0]),
  phoneNumber: (config) => phoneNumber(config as Parameters<typeof phoneNumber>[0]),
  emailOTP: (config) => emailOTP(config as Parameters<typeof emailOTP>[0]),
  deviceAuthorization: (config) => deviceAuthorization(config as Parameters<typeof deviceAuthorization>[0]),
  lastLoginMethod: (config) => lastLoginMethod(config as Parameters<typeof lastLoginMethod>[0]),
  oneTimeToken: (config) => oneTimeToken(config as Parameters<typeof oneTimeToken>[0]),
};

// ============================================================================
// SERVER INSTANCE CREATION
// ============================================================================

/**
 * Creates a fully configured better-auth server instance from a BetterAuthConfig.
 *
 * This factory function:
 * - Takes a type-safe configuration object
 * - Initializes all enabled plugins with their configurations
 * - Configures the database adapter (Prisma by default)
 * - Sets up OAuth providers, email/password auth, sessions, and rate limiting
 * - Returns a ready-to-use better-auth server instance
 *
 * @template ServerPlugins - Array of plugin names enabled on the server
 * @template ClientPlugins - Array of plugin names enabled on the client
 *
 * @param config - Complete better-auth configuration
 * @param prismaClient - Prisma client instance for database operations
 * @returns Configured better-auth server instance
 *
 * @example
 * ```typescript
 * import { PrismaClient } from '@prisma/client';
 * import { createAuthServer } from '@/lib/better-auth-utilities';
 * import { authConfig } from '@/config/auth.config';
 *
 * const prisma = new PrismaClient();
 *
 * export const auth = createAuthServer(authConfig, prisma);
 *
 * // Type-safe API usage
 * const session = await auth.api.getSession({ headers });
 * const apiKeyResult = await auth.api.createApiKey({ body: { name: 'My Key' } });
 * ```
 */
export function createAuthServer<
  ServerPlugins extends readonly AvailablePlugins[] = [],
  ClientPlugins extends readonly AvailablePlugins[] = ServerPlugins
>(
  config: BetterAuthConfig<ServerPlugins, ClientPlugins>,
  prismaClient: unknown // Type as unknown to avoid Prisma dependency in this file
): ReturnType<typeof betterAuth> {
  // Collect enabled plugins
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const plugins: any[] = [];

  // Always add OpenAPI plugin for documentation
  plugins.push(openAPI());

  // Add enabled server plugins
  const enabledPlugins = config.enabledServerPlugins || ([] as readonly AvailablePlugins[]);

  for (const pluginName of enabledPlugins) {
    const factory = PLUGIN_FACTORIES[pluginName];
    if (!factory) {
      console.warn(`Unknown plugin: ${pluginName}`);
      continue;
    }

    try {
      // Get plugin configuration from server.plugins
      const pluginConfig = config.server.plugins?.[pluginName];
      const plugin = factory(pluginConfig);
      plugins.push(plugin);
    } catch (error) {
      console.error(`Failed to initialize plugin ${pluginName}:`, error);
      // Don't throw - allow partial plugin initialization
    }
  }

  // Build better-auth options
  const authOptions: BetterAuthOptions = {
    appName: config.server.appName || 'My Application',
    baseURL: config.server.baseURL || process.env.BETTER_AUTH_URL || 'http://localhost:3000',
    secret: config.server.secret,

    // Database configuration with Prisma adapter
    database: config.server.database
      ? config.server.database
      : prismaAdapter(prismaClient as never, {
          provider: 'postgresql', // This should be configurable
        }),

    // Email and password configuration
    emailAndPassword: config.server.emailAndPassword ? {
      enabled: config.server.emailAndPassword.enabled ?? true,
      minPasswordLength: config.server.emailAndPassword.minPasswordLength,
      requireEmailVerification: config.server.emailAndPassword.requireEmailVerification,
      sendResetPassword: config.server.emailAndPassword.sendResetPassword,
    } : {
      enabled: true,
      minPasswordLength: 8,
      requireEmailVerification: false,
    },

    // Email verification
    emailVerification: config.server.emailVerification,

    // OAuth social providers - cast to any to handle type mismatch
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socialProviders: (config.server.socialProviders || []) as any,

    // Session configuration
    session: {
      expiresIn: config.server.session?.expiresIn || 60 * 60 * 24 * 7, // 7 days
      updateAge: config.server.session?.updateAge || 60 * 60 * 24, // 1 day
      freshAge: config.server.session?.freshAge || 60 * 10, // 10 minutes
    },

    // Rate limiting
    rateLimit: config.server.rateLimit || {
      enabled: true,
      window: 60,
      max: 10,
    },

    // Trusted origins for CORS
    trustedOrigins: config.server.trustedOrigins || [],

    // Add all plugins
    plugins,
  };

  return betterAuth(authOptions);
}

/**
 * Type helper to infer the full server type including all plugins.
 *
 * @example
 * ```typescript
 * const auth = createAuthServer(authConfig, prisma);
 * export type AuthServer = InferAuthServer<typeof auth>;
 * ```
 */
export type InferAuthServer<T extends ReturnType<typeof betterAuth>> = T;

/**
 * Type helper to infer session type from server instance.
 *
 * @example
 * ```typescript
 * const auth = createAuthServer(authConfig, prisma);
 * export type Session = InferSession<typeof auth>;
 * ```
 */
export type InferSession<T extends ReturnType<typeof betterAuth>> = T['$Infer']['Session'];
