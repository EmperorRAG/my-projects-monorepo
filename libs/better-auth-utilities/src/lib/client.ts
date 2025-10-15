/**
 * @file libs/better-auth-utilities/src/lib/client.ts
 * @description Client-side better-auth instance creation with full plugin support.
 */

import { createAuthClient } from 'better-auth/client';
import {
  apiKeyClient,
  twoFactorClient,
  adminClient,
  organizationClient,
  usernameClient,
  magicLinkClient,
  siweClient,
  genericOAuthClient,
  oneTapClient,
  anonymousClient,
  phoneNumberClient,
  emailOTPClient,
  lastLoginMethodClient,
  oneTimeTokenClient,
  multiSessionClient,
} from 'better-auth/client/plugins';
import type { BetterAuthConfig, AvailablePlugins } from './config';

// ============================================================================
// CLIENT PLUGIN FACTORY FUNCTIONS
// ============================================================================

/**
 * Maps plugin names to their client factory functions.
 * Note: Most client plugins don't accept configuration parameters.
 */
const CLIENT_PLUGIN_FACTORIES: Record<
  AvailablePlugins,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (config?: unknown) => any
> = {
  // Core authentication plugins
  username: () => usernameClient(),
  magicLink: () => magicLinkClient(),
  twoFactor: (config) => twoFactorClient(config as Parameters<typeof twoFactorClient>[0]),
  admin: (config) => adminClient(config as Parameters<typeof adminClient>[0]),
  organization: (config) => organizationClient(config as Parameters<typeof organizationClient>[0]),
  passkey: () => {
    throw new Error('Passkey client plugin requires @better-auth/passkey package or correct import path');
  },

  // OAuth/Auth plugins
  oidc: () => {
    throw new Error('OIDC client plugin requires correct import or @better-auth/oidc package');
  },
  siwe: () => siweClient(),
  genericOAuth: () => genericOAuthClient(),
  oneTap: (config) => oneTapClient(config as Parameters<typeof oneTapClient>[0]),

  // Integration plugins (require separate packages)
  stripe: () => {
    throw new Error('Stripe client plugin requires @better-auth/stripe package');
  },
  polar: () => {
    throw new Error('Polar client plugin requires @polar-sh/better-auth package');
  },
  dodopayments: () => {
    throw new Error('Dodo Payments client plugin requires @dodopayments/better-auth package');
  },
  dubAnalytics: () => {
    throw new Error('Dub Analytics client plugin requires @dub/better-auth package');
  },

  // Security plugins
  bearer: () => {
    // Bearer plugin is typically server-only, no client plugin needed
    return null;
  },
  jwt: () => {
    // JWT client is available but typically included automatically
    return null;
  },
  apiKey: () => apiKeyClient(),
  haveIBeenPwned: () => {
    throw new Error('Have I Been Pwned client plugin requires @better-auth/hibp package');
  },

  // Advanced plugins
  multiSession: () => multiSessionClient(),
  anonymous: () => anonymousClient(),
  phoneNumber: () => phoneNumberClient(),
  emailOTP: () => emailOTPClient(),
  deviceAuthorization: () => {
    // Device authorization is typically server-only
    return null;
  },
  lastLoginMethod: () => lastLoginMethodClient(),
  oneTimeToken: () => oneTimeTokenClient(),
};

// ============================================================================
// CLIENT INSTANCE CREATION
// ============================================================================

/**
 * Creates a fully configured better-auth client instance from a BetterAuthConfig.
 *
 * This factory function:
 * - Takes a type-safe configuration object
 * - Initializes all enabled client plugins with their configurations
 * - Sets up base URL, redirect URIs, scopes, and fetch options
 * - Returns a ready-to-use better-auth client instance
 *
 * @template ServerPlugins - Array of plugin names enabled on the server
 * @template ClientPlugins - Array of plugin names enabled on the client
 *
 * @param config - Complete better-auth configuration
 * @returns Configured better-auth client instance
 *
 * @example
 * ```typescript
 * import { createAuthClient } from '@/lib/better-auth-utilities';
 * import { authConfig } from '@/config/auth.config';
 *
 * export const authClient = createAuthClient(authConfig);
 *
 * // Type-safe API usage
 * await authClient.signIn.email({ email, password });
 * await authClient.signOut();
 * const { data: session } = authClient.useSession();
 *
 * // Plugin methods are available based on config
 * await authClient.twoFactor.enable({ password });
 * await authClient.organization.create({ name, slug });
 * ```
 */
export function createBetterAuthClient<
  ServerPlugins extends readonly AvailablePlugins[] = [],
  ClientPlugins extends readonly AvailablePlugins[] = ServerPlugins
>(
  config: BetterAuthConfig<ServerPlugins, ClientPlugins>
): ReturnType<typeof createAuthClient> {
  // Collect enabled client plugins
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const plugins: any[] = [];

  // Add enabled client plugins
  const enabledPlugins = config.enabledClientPlugins || config.enabledServerPlugins || ([] as readonly AvailablePlugins[]);

  for (const pluginName of enabledPlugins) {
    const factory = CLIENT_PLUGIN_FACTORIES[pluginName];
    if (!factory) {
      console.warn(`Unknown client plugin: ${pluginName}`);
      continue;
    }

    try {
      // Get plugin configuration from client.plugins
      const pluginConfig = config.client.plugins?.[pluginName];
      const plugin = factory(pluginConfig);

      // Only add non-null plugins (some server-only plugins return null)
      if (plugin !== null) {
        plugins.push(plugin);
      }
    } catch (error) {
      console.error(`Failed to initialize client plugin ${pluginName}:`, error);
      // Don't throw - allow partial plugin initialization
    }
  }

  return createAuthClient({
    baseURL: config.client.baseURL || config.server.baseURL || process.env.BETTER_AUTH_URL || 'http://localhost:3000',

    // Fetch options
    fetchOptions: {
      onSuccess: config.client.fetchOptions?.onSuccess,
      onError: config.client.fetchOptions?.onError,
      credentials: config.client.fetchOptions?.credentials || 'include',
    },

    // Add all plugins - cast to any to avoid type mismatch between plugin versions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    plugins: plugins as any,
  });
}

/**
 * Type helper to infer the full client type including all plugins.
 *
 * @example
 * ```typescript
 * const authClient = createBetterAuthClient(authConfig);
 * export type AuthClient = InferAuthClient<typeof authClient>;
 * ```
 */
export type InferAuthClient<T extends ReturnType<typeof createAuthClient>> = T;
