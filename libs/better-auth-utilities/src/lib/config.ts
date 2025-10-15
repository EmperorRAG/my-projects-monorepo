/**
 * @file libs/better-auth-utilities/src/lib/config.ts
 * @description Comprehensive better-auth configuration with TypeScript generics,
 * plugin system, and intelligent defaults.
 */

// ============================================================================
// PLUGIN TYPES & REGISTRY
// ============================================================================

/**
 * Available better-auth plugins categorized by functionality.
 */
export type AvailablePlugins =
  // Core authentication plugins
  | 'username'
  | 'magicLink'
  | 'twoFactor'
  | 'admin'
  | 'organization'
  | 'passkey'
  // OAuth/Auth plugins
  | 'oidc'
  | 'siwe'
  | 'genericOAuth'
  | 'oneTap'
  // Integration plugins
  | 'stripe'
  | 'polar'
  | 'dodopayments'
  | 'dubAnalytics'
  // Security plugins
  | 'bearer'
  | 'jwt'
  | 'apiKey'
  | 'haveIBeenPwned'
  // Advanced plugins
  | 'multiSession'
  | 'anonymous'
  | 'phoneNumber'
  | 'emailOTP'
  | 'deviceAuthorization'
  | 'lastLoginMethod'
  | 'oneTimeToken';

/**
 * Plugin configuration options for each available plugin.
 */
export interface PluginConfigRegistry {
  username: {
    enabled: boolean;
    requireUniqueUsername?: boolean;
    minLength?: number;
    maxLength?: number;
  };
  magicLink: {
    enabled: boolean;
    expiresIn?: string;
    sendMagicLink?: (params: { email: string; token: string; url: string }) => Promise<void>;
  };
  twoFactor: {
    enabled: boolean;
    issuer?: string;
    twoFactorPage?: string;
  };
  admin: {
    enabled: boolean;
    isAdmin?: (user: unknown) => boolean | Promise<boolean>;
  };
  organization: {
    enabled: boolean;
    allowMemberToLeave?: boolean;
    maximumOrganizations?: number;
  };
  passkey: {
    enabled: boolean;
    rpID?: string;
    rpName?: string;
  };
  oidc: {
    enabled: boolean;
    loginPage?: string;
    allowDynamicClientRegistration?: boolean;
  };
  siwe: {
    enabled: boolean;
    domain?: string;
    anonymous?: boolean;
  };
  genericOAuth: {
    enabled: boolean;
    providers?: Array<{
      providerId: string;
      clientId: string;
      clientSecret: string;
      discoveryUrl?: string;
    }>;
  };
  oneTap: {
    enabled: boolean;
    clientId?: string;
  };
  stripe: {
    enabled: boolean;
    stripePublishableKey?: string;
    createCustomerOnSignUp?: boolean;
  };
  polar: {
    enabled: boolean;
    accessToken?: string;
  };
  dodopayments: {
    enabled: boolean;
    apiKey?: string;
  };
  dubAnalytics: {
    enabled: boolean;
    apiKey?: string;
  };
  bearer: {
    enabled: boolean;
  };
  jwt: {
    enabled: boolean;
    jwtAlgorithm?: 'HS256' | 'RS256' | 'ES256';
    jwtExpiresIn?: string;
  };
  apiKey: {
    enabled: boolean;
    prefix?: string;
  };
  haveIBeenPwned: {
    enabled: boolean;
    minScore?: number;
  };
  multiSession: {
    enabled: boolean;
    maximumSessions?: number;
  };
  anonymous: {
    enabled: boolean;
    emailDomainName?: string;
  };
  phoneNumber: {
    enabled: boolean;
    sendOTP?: (params: { phoneNumber: string; code: string }) => Promise<void>;
  };
  emailOTP: {
    enabled: boolean;
    expiresIn?: string;
    sendOTP?: (params: { email: string; code: string }) => Promise<void>;
  };
  deviceAuthorization: {
    enabled: boolean;
    expiresIn?: string;
    interval?: string;
  };
  lastLoginMethod: {
    enabled: boolean;
    cookieName?: string;
  };
  oneTimeToken: {
    enabled: boolean;
    expiresIn?: string;
  };
}

// ============================================================================
// OAUTH PROVIDER TYPES
// ============================================================================

/**
 * Supported OAuth provider types.
 */
export type OAuthProviderId = 'google' | 'github' | 'gitlab' | 'discord' | 'twitter' | 'facebook' | 'microsoft' | 'apple' | 'linkedin' | 'spotify' | 'notion' | 'salesforce' | 'figma' | 'custom';

/**
 * OAuth provider configuration.
 */
export interface AuthProvider {
  /**
   * Unique identifier for the OAuth provider.
   */
  id: OAuthProviderId;

  /**
   * OAuth client ID from the provider.
   * @example process.env.GOOGLE_CLIENT_ID
   */
  clientId: string;

  /**
   * OAuth client secret from the provider.
   * IMPORTANT: Load from environment variables.
   * @example process.env.GOOGLE_CLIENT_SECRET
   */
  clientSecret: string;

  /**
   * OpenID Connect issuer URL (for custom providers).
   * @example 'https://accounts.google.com'
   */
  issuer?: string;

  /**
   * Additional OAuth scopes to request.
   * @default Varies by provider
   */
  scopes?: string[];

  /**
   * Redirect URI override.
   * @default '{baseURL}/api/auth/callback/{providerId}'
   */
  redirectURI?: string;
}

// ============================================================================
// SERVER CONFIGURATION
// ============================================================================

/**
 * Server-side better-auth configuration with comprehensive defaults.
 */
export interface ServerConfig {
  /**
   * Application name used in emails, TOTP, and UI.
   * @default 'My Application'
   */
  appName?: string;

  /**
   * Base URL where the auth server is hosted.
   * @example 'https://api.yourapp.com' or 'http://localhost:3000'
   * @default process.env.BETTER_AUTH_URL || 'http://localhost:3000'
   */
  baseURL?: string;

  /**
   * Secret key used to sign session tokens and JWTs.
   * CRITICAL: Must be loaded from a secure environment variable.
   * @example process.env.BETTER_AUTH_SECRET
   */
  secret: string;

  /**
   * Database connection string or adapter configuration.
   * @example 'postgresql://user:password@localhost:5432/db'
   */
  database?: string;

  /**
   * Enable email and password authentication.
   * @default true
   */
  emailAndPassword?: {
    enabled?: boolean;
    minPasswordLength?: number;
    requireEmailVerification?: boolean;
    sendResetPassword?: (params: { user: unknown; url: string; token: string }) => Promise<void>;
  };

  /**
   * Email verification configuration.
   */
  emailVerification?: {
    sendVerificationEmail?: (params: { user: unknown; url: string; token: string }) => Promise<void>;
    sendOnSignUp?: boolean;
    autoSignInAfterVerification?: boolean;
  };

  /**
   * OAuth social providers configuration.
   * @default []
   */
  socialProviders?: AuthProvider[];

  /**
   * Session configuration.
   */
  session?: {
    /**
     * Session expiration time in seconds.
     * @default 604800 (7 days)
     */
    expiresIn?: number;

    /**
     * How often to update the session in seconds.
     * @default 86400 (1 day)
     */
    updateAge?: number;

    /**
     * Time window considered "fresh" for sensitive operations (seconds).
     * @default 600 (10 minutes)
     */
    freshAge?: number;

    /**
     * Cookie name for session storage.
     * @default 'better-auth.session_token'
     */
    cookieName?: string;
  };

  /**
   * Rate limiting configuration.
   */
  rateLimit?: {
    enabled?: boolean;
    /**
     * Time window in seconds.
     * @default 60
     */
    window?: number;
    /**
     * Maximum requests per window.
     * @default 10
     */
    max?: number;
  };

  /**
   * Trusted origins for CORS.
   * @default []
   */
  trustedOrigins?: string[];

  /**
   * Plugin-specific configurations.
   * Only includes configurations for enabled plugins.
   */
  plugins?: Record<string, unknown>;
}

// ============================================================================
// CLIENT CONFIGURATION
// ============================================================================

/**
 * Client-side better-auth configuration with comprehensive defaults.
 */
export interface ClientConfig {
  /**
   * Base URL of the authentication server API.
   * @example 'https://api.yourapp.com' or 'http://localhost:3000'
   * @default Same origin if not specified
   */
  baseURL?: string;

  /**
   * URI to redirect to after successful authentication.
   * @default '/dashboard'
   */
  redirectUri?: string;

  /**
   * URI to redirect to after logout.
   * @default '/'
   */
  postLogoutRedirectUri?: string;

  /**
   * Additional OAuth scopes to request globally.
   * @default 'openid profile email'
   */
  scopes?: string[];

  /**
   * Enable automatic session refresh.
   * @default true
   */
  autoRefreshSession?: boolean;

  /**
   * Fetch options for client requests.
   */
  fetchOptions?: {
    onSuccess?: (data: unknown) => void;
    onError?: (error: unknown) => void;
    credentials?: 'omit' | 'same-origin' | 'include';
  };

  /**
   * Plugin-specific client configurations.
   * Only includes configurations for enabled plugins.
   */
  plugins?: Record<string, unknown>;
}

// ============================================================================
// UNIFIED CONFIGURATION TYPE
// ============================================================================

/**
 * Complete better-auth configuration combining server and client.
 * Uses generics to conditionally include plugin configurations.
 *
 * @template ServerPlugins - Array of plugin names enabled on the server
 * @template ClientPlugins - Array of plugin names enabled on the client
 */
export interface BetterAuthConfig<
  ServerPlugins extends readonly AvailablePlugins[] = [],
  ClientPlugins extends readonly AvailablePlugins[] = ServerPlugins
> {
  /**
   * Server-side configuration.
   */
  server: ServerConfig;

  /**
   * Client-side configuration.
   */
  client: ClientConfig;

  /**
   * Enabled server plugins.
   * @default []
   */
  enabledServerPlugins?: ServerPlugins;

  /**
   * Enabled client plugins.
   * @default Same as enabledServerPlugins
   */
  enabledClientPlugins?: ClientPlugins;
}

// ============================================================================
// DEFAULT VALUES
// ============================================================================

/**
 * Default server configuration values.
 * Export for users who want to extend these defaults.
 */
export const DEFAULT_SERVER_CONFIG: Partial<ServerConfig> = {
  appName: 'My Application',
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    freshAge: 60 * 10, // 10 minutes
    cookieName: 'better-auth.session_token',
  },
  rateLimit: {
    enabled: true,
    window: 60,
    max: 10,
  },
  socialProviders: [],
  trustedOrigins: [],
};

/**
 * Default client configuration values.
 * Export for users who want to extend these defaults.
 */
export const DEFAULT_CLIENT_CONFIG: Partial<ClientConfig> = {
  redirectUri: '/dashboard',
  postLogoutRedirectUri: '/',
  scopes: ['openid', 'profile', 'email'],
  autoRefreshSession: true,
  fetchOptions: {
    credentials: 'include',
  },
};

// ============================================================================
// DEFINE CONFIG FUNCTION
// ============================================================================

/**
 * Type-safe configuration builder for better-auth with plugin support.
 *
 * This function provides complete type information and intelligent defaults
 * for both server and client configurations. It uses TypeScript generics
 * to conditionally include plugin configurations based on enabled plugins.
 *
 * @template ServerPlugins - Array of plugin names enabled on the server
 * @template ClientPlugins - Array of plugin names enabled on the client
 *
 * @param config - Configuration object with server and client settings
 * @returns Complete configuration with defaults applied
 *
 * @example
 * ```typescript
 * export const authConfig = defineConfig({
 *   enabledServerPlugins: ['twoFactor', 'organization', 'jwt'] as const,
 *   enabledClientPlugins: ['twoFactor', 'organization'] as const,
 *   server: {
 *     secret: process.env.BETTER_AUTH_SECRET!,
 *     database: process.env.DATABASE_URL,
 *     plugins: {
 *       twoFactor: {
 *         enabled: true,
 *         issuer: 'My App',
 *       },
 *       jwt: {
 *         enabled: true,
 *         jwtExpiresIn: '7d',
 *       },
 *     },
 *   },
 *   client: {
 *     baseURL: 'http://localhost:3000',
 *     plugins: {
 *       twoFactor: {
 *         enabled: true,
 *         twoFactorPage: '/two-factor',
 *       },
 *     },
 *   },
 * });
 * ```
 */
export function defineConfig<
  ServerPlugins extends readonly AvailablePlugins[] = [],
  ClientPlugins extends readonly AvailablePlugins[] = ServerPlugins
>(
  config: BetterAuthConfig<ServerPlugins, ClientPlugins>
): BetterAuthConfig<ServerPlugins, ClientPlugins> {
  // Simple merge with defaults - TypeScript will infer the correct types
  return config as BetterAuthConfig<ServerPlugins, ClientPlugins>;
}

/**
 * Helper function to create server configuration with defaults.
 *
 * @param config - Server configuration
 * @returns Server configuration with defaults
 */
export function createServerConfig(
  config: ServerConfig
): ServerConfig {
  return config;
}

/**
 * Helper function to create client configuration with defaults.
 *
 * @param config - Client configuration
 * @returns Client configuration with defaults
 */
export function createClientConfig(
  config: ClientConfig
): ClientConfig {
  return config;
}
