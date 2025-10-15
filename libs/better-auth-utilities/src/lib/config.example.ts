/**
 * @file libs/better-auth-utilities/src/lib/config.example.ts
 * @description Example usage of the defineConfig function with various plugin configurations.
 * This file demonstrates the type-safe, plugin-based configuration system.
 */

import { defineConfig } from './config';

// ============================================================================
// EXAMPLE 1: Basic Configuration with Common Plugins
// ============================================================================

/**
 * A basic auth configuration with commonly used plugins.
 * This example shows:
 * - Two-factor authentication
 * - Organization/team management
 * - JWT tokens
 * - Username authentication
 */
export const basicAuthConfig = defineConfig({
  enabledServerPlugins: ['twoFactor', 'organization', 'jwt', 'username'] as const,
  enabledClientPlugins: ['twoFactor', 'organization', 'username'] as const,

  server: {
    // Required: Secret for signing tokens (loaded from environment)
    secret: process.env.BETTER_AUTH_SECRET || 'REPLACE_ME_IN_PRODUCTION',

    // Optional: Database connection
    database: process.env.DATABASE_URL,

    // Optional: Override defaults
    appName: 'My Awesome App',
    baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',

    // Plugin-specific configurations
    plugins: {
      // TypeScript only allows properties for enabled plugins!
      twoFactor: {
        enabled: true,
        issuer: 'My Awesome App',
        twoFactorPage: '/auth/two-factor',
      },
      organization: {
        enabled: true,
        allowMemberToLeave: true,
        maximumOrganizations: 10,
      },
      jwt: {
        enabled: true,
        jwtAlgorithm: 'HS256',
        jwtExpiresIn: '7d',
      },
      username: {
        enabled: true,
        requireUniqueUsername: true,
        minLength: 3,
        maxLength: 20,
      },
      // TypeScript error if you try to configure a plugin that's not enabled:
      // passkey: { enabled: true }, // ❌ Error: Property 'passkey' does not exist
    },
  },

  client: {
    baseURL: 'http://localhost:3000',
    redirectUri: '/dashboard',
    postLogoutRedirectUri: '/login',

    plugins: {
      twoFactor: {
        enabled: true,
        twoFactorPage: '/auth/two-factor',
      },
      organization: {
        enabled: true,
      },
      username: {
        enabled: true,
      },
    },
  },
});

// ============================================================================
// EXAMPLE 2: Advanced Configuration with Payment Integration
// ============================================================================

/**
 * An advanced configuration with Stripe payment integration.
 * This example shows:
 * - Stripe subscription management
 * - Admin panel
 * - Passkey (WebAuthn) authentication
 * - Magic link authentication
 */
export const advancedAuthConfig = defineConfig({
  enabledServerPlugins: ['stripe', 'admin', 'passkey', 'magicLink', 'organization'] as const,
  enabledClientPlugins: ['stripe', 'admin', 'passkey', 'magicLink', 'organization'] as const,

  server: {
    secret: process.env.BETTER_AUTH_SECRET || 'REPLACE_ME_IN_PRODUCTION',
    database: process.env.DATABASE_URL,
    appName: 'SaaS Platform',
    baseURL: process.env.BETTER_AUTH_URL || 'https://api.myapp.com',

    // Email configuration
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 12,
      requireEmailVerification: true,
      sendResetPassword: async ({ user, url, token }) => {
        // Implementation for sending password reset emails
        console.log('Send password reset to', user, url, token);
      },
    },

    emailVerification: {
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      sendVerificationEmail: async ({ user, url, token }) => {
        // Implementation for sending verification emails
        console.log('Send verification to', user, url, token);
      },
    },

    // OAuth providers
    socialProviders: [
      {
        id: 'google',
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      },
      {
        id: 'github',
        clientId: process.env.GITHUB_CLIENT_ID || '',
        clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      },
    ],

    // Session configuration
    session: {
      expiresIn: 60 * 60 * 24 * 30, // 30 days
      updateAge: 60 * 60 * 24, // 1 day
      freshAge: 60 * 10, // 10 minutes
    },

    // Plugin configurations
    plugins: {
      stripe: {
        enabled: true,
        stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
        createCustomerOnSignUp: true,
      },
      admin: {
        enabled: true,
        isAdmin: async (user: { role?: string; email: string }) => {
          return user.role === 'admin' || user.email.endsWith('@mycompany.com');
        },
      },
      passkey: {
        enabled: true,
        rpID: 'myapp.com',
        rpName: 'My SaaS App',
      },
      magicLink: {
        enabled: true,
        expiresIn: '15m',
        sendMagicLink: async ({ email, token, url }: { email: string; token: string; url: string }) => {
          console.log('Send magic link to', email, url, token);
        },
      },
      organization: {
        enabled: true,
        allowMemberToLeave: true,
        maximumOrganizations: 5,
      },
    },
  },

  client: {
    baseURL: 'https://api.myapp.com',
    redirectUri: '/app/dashboard',
    postLogoutRedirectUri: '/login',
    autoRefreshSession: true,
    scopes: ['openid', 'profile', 'email', 'offline_access'],

    fetchOptions: {
      credentials: 'include',
      onError: (error) => {
        console.error('Auth error:', error);
      },
      onSuccess: (data) => {
        console.log('Auth success:', data);
      },
    },

    plugins: {
      stripe: {
        enabled: true,
      },
      admin: {
        enabled: true,
      },
      passkey: {
        enabled: true,
      },
      magicLink: {
        enabled: true,
      },
      organization: {
        enabled: true,
      },
    },
  },
});

// ============================================================================
// EXAMPLE 3: Security-Focused Configuration
// ============================================================================

/**
 * A security-focused configuration with comprehensive protection.
 * This example shows:
 * - API key authentication
 * - JWT tokens
 * - Bearer token support
 * - Password security checks (Have I Been Pwned)
 * - Multi-session management
 */
export const securityAuthConfig = defineConfig({
  enabledServerPlugins: [
    'apiKey',
    'jwt',
    'bearer',
    'haveIBeenPwned',
    'multiSession',
    'twoFactor',
    'deviceAuthorization',
  ] as const,
  enabledClientPlugins: [
    'apiKey',
    'bearer',
    'multiSession',
    'twoFactor',
    'deviceAuthorization',
  ] as const,

  server: {
    secret: process.env.BETTER_AUTH_SECRET || 'REPLACE_ME_IN_PRODUCTION',
    database: process.env.DATABASE_URL,
    appName: 'Secure App',

    // Strict session configuration
    session: {
      expiresIn: 60 * 60 * 2, // 2 hours
      updateAge: 60 * 30, // 30 minutes
      freshAge: 60 * 5, // 5 minutes (require re-auth for sensitive ops)
    },

    // Aggressive rate limiting
    rateLimit: {
      enabled: true,
      window: 60, // 1 minute
      max: 5, // 5 requests per minute
    },

    plugins: {
      apiKey: {
        enabled: true,
        prefix: 'sk_', // Secret key prefix
      },
      jwt: {
        enabled: true,
        jwtAlgorithm: 'RS256', // More secure than HS256
        jwtExpiresIn: '1h',
      },
      bearer: {
        enabled: true,
      },
      haveIBeenPwned: {
        enabled: true,
        minScore: 3, // Reject commonly breached passwords
      },
      multiSession: {
        enabled: true,
        maximumSessions: 3, // Limit concurrent sessions
      },
      twoFactor: {
        enabled: true,
        issuer: 'Secure App',
      },
      deviceAuthorization: {
        enabled: true,
        expiresIn: '10m',
        interval: '5s',
      },
    },
  },

  client: {
    plugins: {
      apiKey: {
        enabled: true,
      },
      bearer: {
        enabled: true,
      },
      multiSession: {
        enabled: true,
      },
      twoFactor: {
        enabled: true,
        twoFactorPage: '/auth/2fa',
      },
      deviceAuthorization: {
        enabled: true,
      },
    },
  },
});

// ============================================================================
// EXAMPLE 4: Mobile/Anonymous Configuration
// ============================================================================

/**
 * Configuration optimized for mobile apps and anonymous users.
 * This example shows:
 * - Anonymous authentication
 * - Phone number authentication
 * - Email OTP
 * - One-time tokens
 */
export const mobileAuthConfig = defineConfig({
  enabledServerPlugins: [
    'anonymous',
    'phoneNumber',
    'emailOTP',
    'oneTimeToken',
    'lastLoginMethod',
  ] as const,
  enabledClientPlugins: [
    'anonymous',
    'phoneNumber',
    'emailOTP',
    'oneTimeToken',
    'lastLoginMethod',
  ] as const,

  server: {
    secret: process.env.BETTER_AUTH_SECRET || 'REPLACE_ME_IN_PRODUCTION',
    database: process.env.DATABASE_URL,
    appName: 'Mobile App',

    plugins: {
      anonymous: {
        enabled: true,
        emailDomainName: 'temp.myapp.com',
      },
      phoneNumber: {
        enabled: true,
        sendOTP: async ({ phoneNumber, code }: { phoneNumber: string; code: string }) => {
          console.log(`Send OTP ${code} to ${phoneNumber}`);
          // Implementation for sending SMS
        },
      },
      emailOTP: {
        enabled: true,
        expiresIn: '10m',
        sendOTP: async ({ email, code }: { email: string; code: string }) => {
          console.log(`Send OTP ${code} to ${email}`);
          // Implementation for sending email OTP
        },
      },
      oneTimeToken: {
        enabled: true,
        expiresIn: '5m',
      },
      lastLoginMethod: {
        enabled: true,
        cookieName: 'myapp_last_login',
      },
    },
  },

  client: {
    baseURL: 'https://api.mobile.myapp.com',

    plugins: {
      anonymous: {
        enabled: true,
      },
      phoneNumber: {
        enabled: true,
      },
      emailOTP: {
        enabled: true,
      },
      oneTimeToken: {
        enabled: true,
      },
      lastLoginMethod: {
        enabled: true,
      },
    },
  },
});

// ============================================================================
// TYPE SAFETY DEMONSTRATION
// ============================================================================

/**
 * This demonstrates the type safety of the configuration system.
 * Uncomment lines to see TypeScript errors.
 */
export const typeSafetyDemo = defineConfig({
  enabledServerPlugins: ['jwt', 'username'] as const,
  enabledClientPlugins: ['username'] as const,

  server: {
    secret: process.env.BETTER_AUTH_SECRET || 'REPLACE_ME_IN_PRODUCTION',

    plugins: {
      // ✅ CORRECT: jwt is in enabledServerPlugins
      jwt: {
        enabled: true,
        jwtExpiresIn: '7d',
      },

      // ✅ CORRECT: username is in enabledServerPlugins
      username: {
        enabled: true,
      },

      // ❌ ERROR: stripe is NOT in enabledServerPlugins
      // Uncomment to see TypeScript error:
      // stripe: {
      //   enabled: true,
      // },
    },
  },

  client: {
    plugins: {
      // ✅ CORRECT: username is in enabledClientPlugins
      username: {
        enabled: true,
      },

      // ❌ ERROR: jwt is NOT in enabledClientPlugins (only in server)
      // Uncomment to see TypeScript error:
      // jwt: {
      //   enabled: true,
      // },
    },
  },
});
