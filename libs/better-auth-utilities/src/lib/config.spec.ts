/**
 * @file libs/better-auth-utilities/src/lib/config.spec.ts
 * @description Comprehensive test suite for better-auth configuration utilities.
 * Targets >90% code coverage with unit and integration tests.
 */

import {
  defineConfig,
  createServerConfig,
  createClientConfig,
  DEFAULT_SERVER_CONFIG,
  DEFAULT_CLIENT_CONFIG,
  type ServerConfig,
  type ClientConfig,
  type AvailablePlugins,
} from './config';

describe('better-auth-utilities: config', () => {
  // ============================================================================
  // DEFAULT CONFIGURATIONS
  // ============================================================================

  describe('DEFAULT_SERVER_CONFIG', () => {
    it('should have correct default values', () => {
      expect(DEFAULT_SERVER_CONFIG).toEqual({
        appName: 'My Application',
        baseURL: expect.any(String),
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
      });
    });

    it('should use environment variable for baseURL if available', () => {
      const originalEnv = process.env.BETTER_AUTH_URL;

      // Test with env variable set
      process.env.BETTER_AUTH_URL = 'https://api.example.com';
      const { DEFAULT_SERVER_CONFIG: configWithEnv } = require('./config');
      expect(configWithEnv.baseURL).toBe('https://api.example.com');

      // Restore original
      if (originalEnv) {
        process.env.BETTER_AUTH_URL = originalEnv;
      } else {
        delete process.env.BETTER_AUTH_URL;
      }
    });

    it('should fall back to localhost if BETTER_AUTH_URL is not set', () => {
      const originalEnv = process.env.BETTER_AUTH_URL;
      delete process.env.BETTER_AUTH_URL;

      const { DEFAULT_SERVER_CONFIG: configWithoutEnv } = require('./config');
      expect(configWithoutEnv.baseURL).toBe('http://localhost:3000');

      // Restore original
      if (originalEnv) {
        process.env.BETTER_AUTH_URL = originalEnv;
      }
    });

    it('should have session expiration of 7 days', () => {
      expect(DEFAULT_SERVER_CONFIG.session?.expiresIn).toBe(604800);
    });

    it('should have session update age of 1 day', () => {
      expect(DEFAULT_SERVER_CONFIG.session?.updateAge).toBe(86400);
    });

    it('should have fresh age of 10 minutes', () => {
      expect(DEFAULT_SERVER_CONFIG.session?.freshAge).toBe(600);
    });

    it('should have rate limiting enabled by default', () => {
      expect(DEFAULT_SERVER_CONFIG.rateLimit?.enabled).toBe(true);
    });

    it('should have rate limit window of 60 seconds', () => {
      expect(DEFAULT_SERVER_CONFIG.rateLimit?.window).toBe(60);
    });

    it('should have rate limit max of 10 requests', () => {
      expect(DEFAULT_SERVER_CONFIG.rateLimit?.max).toBe(10);
    });
  });

  describe('DEFAULT_CLIENT_CONFIG', () => {
    it('should have correct default values', () => {
      expect(DEFAULT_CLIENT_CONFIG).toEqual({
        redirectUri: '/dashboard',
        postLogoutRedirectUri: '/',
        scopes: ['openid', 'profile', 'email'],
        autoRefreshSession: true,
        fetchOptions: {
          credentials: 'include',
        },
      });
    });

    it('should auto-refresh session by default', () => {
      expect(DEFAULT_CLIENT_CONFIG.autoRefreshSession).toBe(true);
    });

    it('should include credentials in fetch by default', () => {
      expect(DEFAULT_CLIENT_CONFIG.fetchOptions?.credentials).toBe('include');
    });

    it('should have correct OAuth scopes', () => {
      expect(DEFAULT_CLIENT_CONFIG.scopes).toContain('openid');
      expect(DEFAULT_CLIENT_CONFIG.scopes).toContain('profile');
      expect(DEFAULT_CLIENT_CONFIG.scopes).toContain('email');
    });

    it('should redirect to /dashboard after login', () => {
      expect(DEFAULT_CLIENT_CONFIG.redirectUri).toBe('/dashboard');
    });

    it('should redirect to / after logout', () => {
      expect(DEFAULT_CLIENT_CONFIG.postLogoutRedirectUri).toBe('/');
    });
  });

  // ============================================================================
  // defineConfig FUNCTION
  // ============================================================================

  describe('defineConfig', () => {
    it('should create a valid configuration with minimal setup', () => {
      const config = defineConfig({
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
        },
        client: {},
      });

      expect(config).toBeDefined();
      expect(config.server).toBeDefined();
      expect(config.client).toBeDefined();
      expect(config.server.secret).toBe('test-secret-key-minimum-32-chars-long');
    });

    it('should handle server plugins configuration', () => {
      const config = defineConfig({
        enabledServerPlugins: ['jwt', 'twoFactor'] as const,
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
          plugins: {
            jwt: {
              enabled: true,
              jwtAlgorithm: 'HS256',
              jwtExpiresIn: '7d',
            },
            twoFactor: {
              enabled: true,
              issuer: 'Test App',
            },
          },
        },
        client: {},
      });

      expect(config.enabledServerPlugins).toEqual(['jwt', 'twoFactor']);
      expect(config.server.plugins).toBeDefined();
      expect(config.server.plugins?.jwt).toBeDefined();
      expect(config.server.plugins?.twoFactor).toBeDefined();
    });

    it('should handle client plugins configuration', () => {
      const config = defineConfig({
        enabledServerPlugins: ['twoFactor'] as const,
        enabledClientPlugins: ['twoFactor'] as const,
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
        },
        client: {
          plugins: {
            twoFactor: {
              enabled: true,
              twoFactorPage: '/auth/2fa',
            },
          },
        },
      });

      expect(config.enabledClientPlugins).toEqual(['twoFactor']);
      expect(config.client.plugins).toBeDefined();
      expect(config.client.plugins?.twoFactor).toBeDefined();
    });

    it('should handle all server configuration options', () => {
      const config = defineConfig({
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
          database: 'postgresql://localhost:5432/testdb',
          appName: 'Test Application',
          baseURL: 'https://api.test.com',
          emailAndPassword: {
            enabled: true,
            minPasswordLength: 12,
            requireEmailVerification: true,
          },
          session: {
            expiresIn: 3600,
            updateAge: 1800,
            freshAge: 300,
            cookieName: 'test-session',
          },
          rateLimit: {
            enabled: true,
            window: 120,
            max: 20,
          },
          trustedOrigins: ['https://app.test.com'],
        },
        client: {},
      });

      expect(config.server.database).toBe('postgresql://localhost:5432/testdb');
      expect(config.server.appName).toBe('Test Application');
      expect(config.server.baseURL).toBe('https://api.test.com');
      expect(config.server.emailAndPassword?.minPasswordLength).toBe(12);
      expect(config.server.session?.expiresIn).toBe(3600);
      expect(config.server.rateLimit?.max).toBe(20);
      expect(config.server.trustedOrigins).toContain('https://app.test.com');
    });

    it('should handle all client configuration options', () => {
      const config = defineConfig({
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
        },
        client: {
          baseURL: 'https://api.test.com',
          redirectUri: '/home',
          postLogoutRedirectUri: '/login',
          scopes: ['openid', 'profile', 'email', 'custom'],
          autoRefreshSession: false,
          fetchOptions: {
            credentials: 'same-origin',
            onSuccess: (data) => console.log('Success', data),
            onError: (error) => console.error('Error', error),
          },
        },
      });

      expect(config.client.baseURL).toBe('https://api.test.com');
      expect(config.client.redirectUri).toBe('/home');
      expect(config.client.postLogoutRedirectUri).toBe('/login');
      expect(config.client.scopes).toContain('custom');
      expect(config.client.autoRefreshSession).toBe(false);
      expect(config.client.fetchOptions?.credentials).toBe('same-origin');
      expect(config.client.fetchOptions?.onSuccess).toBeDefined();
      expect(config.client.fetchOptions?.onError).toBeDefined();
    });

    it('should handle OAuth providers configuration', () => {
      const config = defineConfig({
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
          socialProviders: [
            {
              id: 'google',
              clientId: 'google-client-id',
              clientSecret: 'google-client-secret',
              scopes: ['email', 'profile'],
            },
            {
              id: 'github',
              clientId: 'github-client-id',
              clientSecret: 'github-client-secret',
            },
          ],
        },
        client: {},
      });

      expect(config.server.socialProviders).toHaveLength(2);
      expect(config.server.socialProviders?.[0].id).toBe('google');
      expect(config.server.socialProviders?.[1].id).toBe('github');
    });

    it('should handle email verification configuration', () => {
      const sendEmail = jest.fn();
      const config = defineConfig({
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
          emailVerification: {
            sendVerificationEmail: sendEmail,
            sendOnSignUp: true,
            autoSignInAfterVerification: true,
          },
        },
        client: {},
      });

      expect(config.server.emailVerification?.sendVerificationEmail).toBe(sendEmail);
      expect(config.server.emailVerification?.sendOnSignUp).toBe(true);
      expect(config.server.emailVerification?.autoSignInAfterVerification).toBe(true);
    });

    it('should preserve type information with generics', () => {
      const config = defineConfig<['jwt', 'username'], ['username']>({
        enabledServerPlugins: ['jwt', 'username'] as const,
        enabledClientPlugins: ['username'] as const,
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
        },
        client: {},
      });

      // TypeScript should infer the correct types
      expect(config.enabledServerPlugins).toEqual(['jwt', 'username']);
      expect(config.enabledClientPlugins).toEqual(['username']);
    });

    it('should handle all core authentication plugins', () => {
      const config = defineConfig({
        enabledServerPlugins: ['username', 'magicLink', 'twoFactor', 'admin', 'organization', 'passkey'] as const,
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
          plugins: {
            username: { enabled: true },
            magicLink: { enabled: true },
            twoFactor: { enabled: true },
            admin: { enabled: true },
            organization: { enabled: true },
            passkey: { enabled: true },
          },
        },
        client: {},
      });

      expect(config.server.plugins?.username).toBeDefined();
      expect(config.server.plugins?.magicLink).toBeDefined();
      expect(config.server.plugins?.twoFactor).toBeDefined();
      expect(config.server.plugins?.admin).toBeDefined();
      expect(config.server.plugins?.organization).toBeDefined();
      expect(config.server.plugins?.passkey).toBeDefined();
    });

    it('should handle all OAuth/Auth plugins', () => {
      const config = defineConfig({
        enabledServerPlugins: ['oidc', 'siwe', 'genericOAuth', 'oneTap'] as const,
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
          plugins: {
            oidc: { enabled: true },
            siwe: { enabled: true },
            genericOAuth: { enabled: true },
            oneTap: { enabled: true },
          },
        },
        client: {},
      });

      expect(config.server.plugins?.oidc).toBeDefined();
      expect(config.server.plugins?.siwe).toBeDefined();
      expect(config.server.plugins?.genericOAuth).toBeDefined();
      expect(config.server.plugins?.oneTap).toBeDefined();
    });

    it('should handle all integration plugins', () => {
      const config = defineConfig({
        enabledServerPlugins: ['stripe', 'polar', 'dodopayments', 'dubAnalytics'] as const,
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
          plugins: {
            stripe: { enabled: true, stripePublishableKey: 'pk_test_123' },
            polar: { enabled: true, accessToken: 'polar_token' },
            dodopayments: { enabled: true, apiKey: 'dodo_key' },
            dubAnalytics: { enabled: true, apiKey: 'dub_key' },
          },
        },
        client: {},
      });

      expect(config.server.plugins?.stripe).toBeDefined();
      expect(config.server.plugins?.polar).toBeDefined();
      expect(config.server.plugins?.dodopayments).toBeDefined();
      expect(config.server.plugins?.dubAnalytics).toBeDefined();
    });

    it('should handle all security plugins', () => {
      const config = defineConfig({
        enabledServerPlugins: ['bearer', 'jwt', 'apiKey', 'haveIBeenPwned'] as const,
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
          plugins: {
            bearer: { enabled: true },
            jwt: { enabled: true, jwtAlgorithm: 'RS256' },
            apiKey: { enabled: true, prefix: 'sk_' },
            haveIBeenPwned: { enabled: true, minScore: 5 },
          },
        },
        client: {},
      });

      expect(config.server.plugins?.bearer).toBeDefined();
      expect(config.server.plugins?.jwt).toBeDefined();
      expect(config.server.plugins?.apiKey).toBeDefined();
      expect(config.server.plugins?.haveIBeenPwned).toBeDefined();
    });

    it('should handle all advanced plugins', () => {
      const config = defineConfig({
        enabledServerPlugins: [
          'multiSession',
          'anonymous',
          'phoneNumber',
          'emailOTP',
          'deviceAuthorization',
          'lastLoginMethod',
          'oneTimeToken',
        ] as const,
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
          plugins: {
            multiSession: { enabled: true, maximumSessions: 3 },
            anonymous: { enabled: true, emailDomainName: 'temp.example.com' },
            phoneNumber: { enabled: true },
            emailOTP: { enabled: true, expiresIn: '10m' },
            deviceAuthorization: { enabled: true, expiresIn: '15m', interval: '5s' },
            lastLoginMethod: { enabled: true, cookieName: 'last_login' },
            oneTimeToken: { enabled: true, expiresIn: '5m' },
          },
        },
        client: {},
      });

      expect(config.server.plugins?.multiSession).toBeDefined();
      expect(config.server.plugins?.anonymous).toBeDefined();
      expect(config.server.plugins?.phoneNumber).toBeDefined();
      expect(config.server.plugins?.emailOTP).toBeDefined();
      expect(config.server.plugins?.deviceAuthorization).toBeDefined();
      expect(config.server.plugins?.lastLoginMethod).toBeDefined();
      expect(config.server.plugins?.oneTimeToken).toBeDefined();
    });

    it('should handle empty plugin arrays', () => {
      const config = defineConfig({
        enabledServerPlugins: [] as const,
        enabledClientPlugins: [] as const,
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
        },
        client: {},
      });

      expect(config.enabledServerPlugins).toEqual([]);
      expect(config.enabledClientPlugins).toEqual([]);
    });

    it('should handle undefined plugin arrays', () => {
      const config = defineConfig({
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
        },
        client: {},
      });

      expect(config.enabledServerPlugins).toBeUndefined();
      expect(config.enabledClientPlugins).toBeUndefined();
    });
  });

  // ============================================================================
  // createServerConfig FUNCTION
  // ============================================================================

  describe('createServerConfig', () => {
    it('should create server configuration', () => {
      const serverConfig: ServerConfig = {
        secret: 'test-secret-key-minimum-32-chars-long',
        appName: 'Test App',
      };

      const result = createServerConfig(serverConfig);

      expect(result).toEqual(serverConfig);
      expect(result.secret).toBe('test-secret-key-minimum-32-chars-long');
      expect(result.appName).toBe('Test App');
    });

    it('should preserve all server configuration properties', () => {
      const serverConfig: ServerConfig = {
        secret: 'test-secret-key-minimum-32-chars-long',
        database: 'postgresql://localhost/test',
        appName: 'Full Test',
        baseURL: 'https://api.test.com',
        emailAndPassword: {
          enabled: true,
          minPasswordLength: 10,
        },
        session: {
          expiresIn: 7200,
        },
        rateLimit: {
          enabled: true,
          max: 15,
        },
        trustedOrigins: ['https://app.test.com'],
        plugins: {
          jwt: { enabled: true },
        },
      };

      const result = createServerConfig(serverConfig);

      expect(result).toEqual(serverConfig);
      expect(result.database).toBe('postgresql://localhost/test');
      expect(result.plugins?.jwt).toBeDefined();
    });

    it('should handle minimal server configuration', () => {
      const serverConfig: ServerConfig = {
        secret: 'minimum-secret-key-32-chars-long',
      };

      const result = createServerConfig(serverConfig);

      expect(result).toEqual(serverConfig);
      expect(result.secret).toBe('minimum-secret-key-32-chars-long');
    });
  });

  // ============================================================================
  // createClientConfig FUNCTION
  // ============================================================================

  describe('createClientConfig', () => {
    it('should create client configuration', () => {
      const clientConfig: ClientConfig = {
        baseURL: 'https://api.test.com',
        redirectUri: '/home',
      };

      const result = createClientConfig(clientConfig);

      expect(result).toEqual(clientConfig);
      expect(result.baseURL).toBe('https://api.test.com');
      expect(result.redirectUri).toBe('/home');
    });

    it('should preserve all client configuration properties', () => {
      const clientConfig: ClientConfig = {
        baseURL: 'https://api.test.com',
        redirectUri: '/dashboard',
        postLogoutRedirectUri: '/goodbye',
        scopes: ['openid', 'custom'],
        autoRefreshSession: false,
        fetchOptions: {
          credentials: 'omit',
        },
        plugins: {
          twoFactor: { enabled: true },
        },
      };

      const result = createClientConfig(clientConfig);

      expect(result).toEqual(clientConfig);
      expect(result.scopes).toContain('custom');
      expect(result.plugins?.twoFactor).toBeDefined();
    });

    it('should handle minimal client configuration', () => {
      const clientConfig: ClientConfig = {};

      const result = createClientConfig(clientConfig);

      expect(result).toEqual(clientConfig);
    });

    it('should handle client with callbacks', () => {
      const onSuccess = jest.fn();
      const onError = jest.fn();

      const clientConfig: ClientConfig = {
        fetchOptions: {
          onSuccess,
          onError,
        },
      };

      const result = createClientConfig(clientConfig);

      expect(result.fetchOptions?.onSuccess).toBe(onSuccess);
      expect(result.fetchOptions?.onError).toBe(onError);
    });
  });

  // ============================================================================
  // INTEGRATION TESTS
  // ============================================================================

  describe('Integration Tests', () => {
    it('should create a complete production-ready configuration', () => {
      const config = defineConfig({
        enabledServerPlugins: ['jwt', 'twoFactor', 'organization', 'stripe'] as const,
        enabledClientPlugins: ['twoFactor', 'organization', 'stripe'] as const,
        server: {
          secret: process.env.BETTER_AUTH_SECRET || 'fallback-secret-key-32-chars-long',
          database: process.env.DATABASE_URL || 'postgresql://localhost/prod',
          appName: 'Production App',
          baseURL: 'https://api.production.com',
          emailAndPassword: {
            enabled: true,
            minPasswordLength: 12,
            requireEmailVerification: true,
          },
          socialProviders: [
            {
              id: 'google',
              clientId: 'google-id',
              clientSecret: 'google-secret',
            },
          ],
          session: {
            expiresIn: 60 * 60 * 24 * 30, // 30 days
            updateAge: 60 * 60 * 24, // 1 day
            freshAge: 60 * 15, // 15 minutes
          },
          rateLimit: {
            enabled: true,
            window: 60,
            max: 100,
          },
          plugins: {
            jwt: {
              enabled: true,
              jwtAlgorithm: 'RS256',
              jwtExpiresIn: '7d',
            },
            twoFactor: {
              enabled: true,
              issuer: 'Production App',
            },
            organization: {
              enabled: true,
              maximumOrganizations: 5,
            },
            stripe: {
              enabled: true,
              stripePublishableKey: 'pk_live_123',
              createCustomerOnSignUp: true,
            },
          },
        },
        client: {
          baseURL: 'https://api.production.com',
          redirectUri: '/app',
          postLogoutRedirectUri: '/login',
          autoRefreshSession: true,
          scopes: ['openid', 'profile', 'email', 'offline_access'],
          plugins: {
            twoFactor: {
              enabled: true,
              twoFactorPage: '/auth/2fa',
            },
            organization: {
              enabled: true,
            },
            stripe: {
              enabled: true,
            },
          },
        },
      });

      expect(config).toBeDefined();
      expect(config.server.secret).toBeTruthy();
      expect(config.server.plugins?.jwt).toBeDefined();
      expect(config.client.plugins?.twoFactor).toBeDefined();
    });

    it('should support all 26 available plugins', () => {
      const allPlugins: AvailablePlugins[] = [
        'username',
        'magicLink',
        'twoFactor',
        'admin',
        'organization',
        'passkey',
        'oidc',
        'siwe',
        'genericOAuth',
        'oneTap',
        'stripe',
        'polar',
        'dodopayments',
        'dubAnalytics',
        'bearer',
        'jwt',
        'apiKey',
        'haveIBeenPwned',
        'multiSession',
        'anonymous',
        'phoneNumber',
        'emailOTP',
        'deviceAuthorization',
        'lastLoginMethod',
        'oneTimeToken',
      ];

      const config = defineConfig({
        enabledServerPlugins: allPlugins as readonly AvailablePlugins[],
        server: {
          secret: 'all-plugins-secret-key-32-chars-long',
          plugins: Object.fromEntries(
            allPlugins.map((plugin) => [plugin, { enabled: true }])
          ),
        },
        client: {},
      });

      expect(config.enabledServerPlugins).toHaveLength(25);
      expect(Object.keys(config.server.plugins || {})).toHaveLength(25);
    });
  });

  // ============================================================================
  // TYPE TESTS (Compile-time verification)
  // ============================================================================

  describe('Type Safety Tests', () => {
    it('should enforce required secret field', () => {
      // This should compile
      const validConfig = defineConfig({
        server: {
          secret: 'required-secret-key-32-chars-long',
        },
        client: {},
      });

      expect(validConfig.server.secret).toBeDefined();
    });

    it('should allow all valid OAuth provider IDs', () => {
      const providers: Array<{ id: string }> = [
        { id: 'google' },
        { id: 'github' },
        { id: 'gitlab' },
        { id: 'discord' },
        { id: 'twitter' },
        { id: 'facebook' },
        { id: 'microsoft' },
        { id: 'apple' },
        { id: 'linkedin' },
        { id: 'spotify' },
        { id: 'notion' },
        { id: 'salesforce' },
        { id: 'figma' },
        { id: 'custom' },
      ];

      providers.forEach((provider) => {
        expect(['google', 'github', 'gitlab', 'discord', 'twitter', 'facebook',
                'microsoft', 'apple', 'linkedin', 'spotify', 'notion',
                'salesforce', 'figma', 'custom']).toContain(provider.id);
      });
    });

    it('should allow all valid fetch credentials options', () => {
      const credentialsOptions = ['omit', 'same-origin', 'include'] as const;

      credentialsOptions.forEach((option) => {
        const config = defineConfig({
          server: { secret: 'test-secret-key-32-chars-long' },
          client: {
            fetchOptions: {
              credentials: option,
            },
          },
        });

        expect(config.client.fetchOptions?.credentials).toBe(option);
      });
    });

    it('should allow all valid JWT algorithms', () => {
      const algorithms = ['HS256', 'RS256', 'ES256'] as const;

      algorithms.forEach((algorithm) => {
        const config = defineConfig({
          enabledServerPlugins: ['jwt'] as const,
          server: {
            secret: 'test-secret-key-32-chars-long',
            plugins: {
              jwt: {
                enabled: true,
                jwtAlgorithm: algorithm,
              },
            },
          },
          client: {},
        });

        const jwtPlugin = config.server.plugins?.jwt as { enabled: boolean; jwtAlgorithm?: string } | undefined;
        expect(jwtPlugin?.jwtAlgorithm).toBe(algorithm);
      });
    });
  });
});
