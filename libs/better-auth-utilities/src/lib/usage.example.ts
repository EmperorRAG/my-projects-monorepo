/**
 * @file libs/better-auth-utilities/src/lib/usage.example.ts
 * @description Complete usage examples for better-auth-utilities
 *
 * This file demonstrates the complete workflow:
 * 1. Configuration creation with defineConfig
 * 2. Server instance creation with createAuthServer
 * 3. Client instance creation with createBetterAuthClient
 * 4. Type inference for full type safety
 *
 * Note: This is an example/documentation file. Some code is commented
 * to avoid compilation errors when @prisma/client isn't configured.
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  defineConfig,
  createAuthServer,
  createBetterAuthClient,
  type InferAuthServer,
  type InferSession,
  type InferAuthClient,
} from './better-auth-utilities';

// ============================================================================
// STEP 1: Define Configuration
// ============================================================================

/**
 * Create a type-safe configuration with all desired plugins.
 * The configuration includes server settings, client settings, and plugin configs.
 */
export const exampleAuthConfig = defineConfig({
  // Server plugins to enable
  enabledServerPlugins: [
    'username',
    'twoFactor',
    'admin',
    'organization',
    'magicLink',
    'apiKey',
    'bearer',
    'jwt',
    'anonymous',
    'phoneNumber',
    'emailOTP',
    'multiSession',
  ] as const,

  // Client plugins (defaults to same as server plugins if not specified)
  enabledClientPlugins: [
    'username',
    'twoFactor',
    'admin',
    'organization',
    'magicLink',
    'apiKey',
    'anonymous',
    'phoneNumber',
    'emailOTP',
    'multiSession',
  ] as const,

  // Server configuration
  server: {
    // Required secret for signing sessions
    secret: process.env.BETTER_AUTH_SECRET || 'your-secret-key-min-32-chars-long',

    // Base URL for the auth server
    baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',

    // Email/Password authentication
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      minPasswordLength: 8,
    },

    // OAuth providers
    socialProviders: [
      {
        id: 'github' as const,
        clientId: process.env.GITHUB_CLIENT_ID || '',
        clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      },
      {
        id: 'google' as const,
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      },
    ],

    // Session configuration
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // 1 day
    },

    // Rate limiting
    rateLimit: {
      enabled: true,
      window: 60,
      max: 100,
    },

    // Trusted origins
    trustedOrigins: [
      'http://localhost:3000',
      'http://localhost:4200',
    ],

    // Plugin-specific configurations
    plugins: {
      twoFactor: {
        issuer: 'My App',
      },
      admin: {
        defaultRole: 'user',
        roles: ['user', 'admin', 'superadmin'],
      },
      organization: {
        allowUserToCreateOrganization: true,
        organizationLimit: 10,
      },
      apiKey: {
        apiKeyLength: 32,
        permissions: ['read', 'write', 'delete'],
      },
    },
  },

  // Client configuration
  client: {
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:3000',

    fetchOptions: {
      credentials: 'include',
      onError: (error: any) => {
        console.error('Auth client error:', error);
      },
      onSuccess: (response: any) => {
        console.log('Auth client success:', response);
      },
    },

    // Plugin configurations (most client plugins don't need config)
    plugins: {},
  },
});

// ============================================================================
// STEP 2: Create Server Instance (Server-side only)
// ============================================================================

/**
 * Example of creating the server instance.
 *
 * In real usage:
 * ```typescript
 * import { PrismaClient } from '@prisma/client';
 * import { createAuthServer } from '@my-projects-monorepo/better-auth-utilities';
 * import { authConfig } from './auth.config';
 *
 * const prisma = new PrismaClient();
 * export const auth = createAuthServer(authConfig, prisma);
 * export type Auth = InferAuthServer<typeof auth>;
 * export type Session = InferSession<typeof auth>;
 * ```
 */

// ============================================================================
// STEP 3: Create Client Instance (Client-side)
// ============================================================================

/**
 * Create the better-auth client instance.
 * This can be used in the browser, React components, etc.
 */
export const exampleAuthClient: ReturnType<typeof createBetterAuthClient> = createBetterAuthClient(exampleAuthConfig);

/**
 * Infer the client type for type-safe client usage
 */
export type ExampleAuthClient = InferAuthClient<typeof exampleAuthClient>;

// ============================================================================
// STEP 4: Using the Client API
// ============================================================================

/**
 * Example: Basic authentication flows
 */
export async function clientAuthExamples() {
  // Sign in with email/password
  await exampleAuthClient.signIn.email({
    email: 'user@example.com',
    password: 'securepassword123',
  });

  // Sign in with OAuth
  await exampleAuthClient.signIn.social({
    provider: 'google',
    callbackURL: '/dashboard',
  });

  // Sign out
  await exampleAuthClient.signOut();

  // Sign up
  await exampleAuthClient.signUp.email({
    email: 'user@example.com',
    password: 'securepassword123',
    name: 'John Doe',
  });
}

/**
 * Example: React hook usage
 *
 * In a React component:
 * ```tsx
 * import { authClient } from '@/lib/auth';
 *
 * function MyComponent() {
 *   const { data: session, isPending, error } = authClient.useSession();
 *
 *   if (isPending) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   if (!session) return <div>Not authenticated</div>;
 *
 *   return <div>Hello, {session.user.name}!</div>;
 * }
 * ```
 */

/**
 * Example: Type-safe session access
 */
export function useTypedSession(session: InferSession<any> | null) {
  if (!session) {
    console.log('No active session');
    return;
  }

  // Fully typed session object
  console.log('User ID:', session.user.id);
  console.log('User email:', session.user.email);
  console.log('User name:', session.user.name);
  console.log('Session ID:', session.session.id);
  console.log('Expires at:', session.session.expiresAt);
}

/**
 * Plugin Support Matrix
 *
 * Server Plugins:
 * ✅ username - Username-based authentication
 * ✅ twoFactor - Two-factor authentication (TOTP)
 * ✅ admin - Role-based access control
 * ✅ organization - Multi-tenancy/organization support
 * ✅ magicLink - Passwordless email login
 * ✅ siwe - Sign-In with Ethereum
 * ✅ genericOAuth - Custom OAuth providers
 * ✅ oneTap - Google One Tap sign-in
 * ✅ anonymous - Anonymous sessions
 * ✅ phoneNumber - Phone number authentication
 * ✅ emailOTP - Email-based OTP
 * ✅ deviceAuthorization - OAuth device authorization flow
 * ✅ lastLoginMethod - Track last login method
 * ✅ oneTimeToken - One-time use tokens
 * ✅ multiSession - Multiple concurrent sessions
 * ✅ apiKey - API key authentication
 * ✅ bearer - Bearer token authentication
 * ✅ jwt - JWT token management
 * ⚠️  passkey - Requires @better-auth/passkey package
 * ⚠️  oidc - Requires correct import or package
 * ⚠️  stripe - Requires @better-auth/stripe package
 * ⚠️  polar - Requires @polar-sh/better-auth package
 * ⚠️  dodopayments - Requires @dodopayments/better-auth package
 * ⚠️  dubAnalytics - Requires @dub/better-auth package
 * ⚠️  haveIBeenPwned - Requires @better-auth/hibp package
 *
 * Client Plugins:
 * All working server plugins have corresponding client plugins.
 * Client plugins enable type-safe client-side API methods.
 */
