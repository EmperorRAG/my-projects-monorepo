/**
 * @file libs/better-auth-utilities/src/lib/server.spec.ts
 * @description Comprehensive test suite for better-auth server instance creation.
 * Targets >90% code coverage with unit and integration tests.
 */

import { defineConfig } from './config';

// Mock better-auth and its dependencies
const mockBetterAuth = jest.fn();
const mockPrismaAdapter = jest.fn();
const mockPlugins = {
  apiKey: jest.fn(),
  bearer: jest.fn(),
  jwt: jest.fn(),
  openAPI: jest.fn(),
  twoFactor: jest.fn(),
  admin: jest.fn(),
  organization: jest.fn(),
  username: jest.fn(),
  magicLink: jest.fn(),
  siwe: jest.fn(),
  genericOAuth: jest.fn(),
  oneTap: jest.fn(),
  anonymous: jest.fn(),
  phoneNumber: jest.fn(),
  emailOTP: jest.fn(),
  deviceAuthorization: jest.fn(),
  lastLoginMethod: jest.fn(),
  oneTimeToken: jest.fn(),
  multiSession: jest.fn(),
};

jest.mock('better-auth', () => ({
  betterAuth: mockBetterAuth,
}));

jest.mock('better-auth/adapters/prisma', () => ({
  prismaAdapter: mockPrismaAdapter,
}));

jest.mock('better-auth/plugins', () => mockPlugins);

// Import after mocking
import { createAuthServer, type InferAuthServer, type InferSession } from './server';

describe('better-auth-utilities: server', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockPrismaClient: any;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Create mock Prisma client
    mockPrismaClient = {
      $connect: jest.fn(),
      $disconnect: jest.fn(),
    };

    // Mock console methods
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    // Setup default mock implementations
    mockBetterAuth.mockReturnValue({
      api: {},
      $Infer: { Session: {} },
    });

    mockPrismaAdapter.mockReturnValue('prisma-adapter');

    // Setup plugin mocks to return plugin objects
    Object.values(mockPlugins).forEach((plugin) => {
      plugin.mockReturnValue({ name: 'mock-plugin' });
    });
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  // ============================================================================
  // BASIC FUNCTIONALITY
  // ============================================================================

  describe('createAuthServer', () => {
    it('should create a server instance with minimal configuration', () => {
      const config = defineConfig({
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
        },
        client: {},
      });

      const server = createAuthServer(config, mockPrismaClient);

      expect(server).toBeDefined();
      expect(mockBetterAuth).toHaveBeenCalledTimes(1);
    });

    it('should call betterAuth with correct base configuration', () => {
      const config = defineConfig({
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
          appName: 'Test App',
          baseURL: 'https://api.test.com',
        },
        client: {},
      });

      createAuthServer(config, mockPrismaClient);

      expect(mockBetterAuth).toHaveBeenCalledWith(
        expect.objectContaining({
          appName: 'Test App',
          baseURL: 'https://api.test.com',
          secret: 'test-secret-key-minimum-32-chars-long',
        })
      );
    });

    it('should use environment variable for baseURL if not provided', () => {
      const originalEnv = process.env.BETTER_AUTH_URL;
      process.env.BETTER_AUTH_URL = 'https://env.example.com';

      const config = defineConfig({
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
        },
        client: {},
      });

      createAuthServer(config, mockPrismaClient);

      expect(mockBetterAuth).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: 'https://env.example.com',
        })
      );

      // Restore
      if (originalEnv) {
        process.env.BETTER_AUTH_URL = originalEnv;
      } else {
        delete process.env.BETTER_AUTH_URL;
      }
    });

    it('should fall back to localhost if baseURL not provided', () => {
      const originalEnv = process.env.BETTER_AUTH_URL;
      delete process.env.BETTER_AUTH_URL;

      const config = defineConfig({
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
        },
        client: {},
      });

      createAuthServer(config, mockPrismaClient);

      expect(mockBetterAuth).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: 'http://localhost:3000',
        })
      );

      // Restore
      if (originalEnv) {
        process.env.BETTER_AUTH_URL = originalEnv;
      }
    });
  });

  // ============================================================================
  // DATABASE CONFIGURATION
  // ============================================================================

  describe('Database Configuration', () => {
    it('should use Prisma adapter with provided client', () => {
      const config = defineConfig({
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
        },
        client: {},
      });

      createAuthServer(config, mockPrismaClient);

      expect(mockPrismaAdapter).toHaveBeenCalledWith(mockPrismaClient, {
        provider: 'postgresql',
      });
    });

    it('should use custom database configuration if provided', () => {
      const customDatabase = 'custom-db-connection';
      const config = defineConfig({
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
          database: customDatabase,
        },
        client: {},
      });

      createAuthServer(config, mockPrismaClient);

      expect(mockBetterAuth).toHaveBeenCalledWith(
        expect.objectContaining({
          database: customDatabase,
        })
      );
      expect(mockPrismaAdapter).not.toHaveBeenCalled();
    });
  });

  // ============================================================================
  // EMAIL AND PASSWORD CONFIGURATION
  // ============================================================================

  describe('Email and Password Configuration', () => {
    it('should configure email/password with defaults', () => {
      const config = defineConfig({
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
        },
        client: {},
      });

      createAuthServer(config, mockPrismaClient);

      expect(mockBetterAuth).toHaveBeenCalledWith(
        expect.objectContaining({
          emailAndPassword: {
            enabled: true,
            minPasswordLength: 8,
            requireEmailVerification: false,
          },
        })
      );
    });

    it('should use custom email/password configuration', () => {
      const config = defineConfig({
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
          emailAndPassword: {
            enabled: true,
            minPasswordLength: 12,
            requireEmailVerification: true,
          },
        },
        client: {},
      });

      createAuthServer(config, mockPrismaClient);

      expect(mockBetterAuth).toHaveBeenCalledWith(
        expect.objectContaining({
          emailAndPassword: {
            enabled: true,
            minPasswordLength: 12,
            requireEmailVerification: true,
          },
        })
      );
    });

    it('should handle disabled email/password authentication', () => {
      const config = defineConfig({
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
          emailAndPassword: {
            enabled: false,
          },
        },
        client: {},
      });

      createAuthServer(config, mockPrismaClient);

      expect(mockBetterAuth).toHaveBeenCalledWith(
        expect.objectContaining({
          emailAndPassword: expect.objectContaining({
            enabled: false,
          }),
        })
      );
    });
  });

  // ============================================================================
  // SESSION CONFIGURATION
  // ============================================================================

  describe('Session Configuration', () => {
    it('should configure session with defaults', () => {
      const config = defineConfig({
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
        },
        client: {},
      });

      createAuthServer(config, mockPrismaClient);

      expect(mockBetterAuth).toHaveBeenCalledWith(
        expect.objectContaining({
          session: {
            expiresIn: 60 * 60 * 24 * 7, // 7 days
            updateAge: 60 * 60 * 24, // 1 day
            freshAge: 60 * 10, // 10 minutes
          },
        })
      );
    });

    it('should use custom session configuration', () => {
      const config = defineConfig({
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
          session: {
            expiresIn: 3600,
            updateAge: 1800,
            freshAge: 300,
          },
        },
        client: {},
      });

      createAuthServer(config, mockPrismaClient);

      expect(mockBetterAuth).toHaveBeenCalledWith(
        expect.objectContaining({
          session: {
            expiresIn: 3600,
            updateAge: 1800,
            freshAge: 300,
          },
        })
      );
    });
  });

  // ============================================================================
  // RATE LIMITING CONFIGURATION
  // ============================================================================

  describe('Rate Limiting Configuration', () => {
    it('should configure rate limiting with defaults', () => {
      const config = defineConfig({
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
        },
        client: {},
      });

      createAuthServer(config, mockPrismaClient);

      expect(mockBetterAuth).toHaveBeenCalledWith(
        expect.objectContaining({
          rateLimit: {
            enabled: true,
            window: 60,
            max: 10,
          },
        })
      );
    });

    it('should use custom rate limiting configuration', () => {
      const config = defineConfig({
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
          rateLimit: {
            enabled: true,
            window: 120,
            max: 20,
          },
        },
        client: {},
      });

      createAuthServer(config, mockPrismaClient);

      expect(mockBetterAuth).toHaveBeenCalledWith(
        expect.objectContaining({
          rateLimit: {
            enabled: true,
            window: 120,
            max: 20,
          },
        })
      );
    });
  });

  // ============================================================================
  // PLUGIN INITIALIZATION
  // ============================================================================

  describe('Plugin Initialization', () => {
    it('should always initialize OpenAPI plugin', () => {
      const config = defineConfig({
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
        },
        client: {},
      });

      createAuthServer(config, mockPrismaClient);

      expect(mockPlugins.openAPI).toHaveBeenCalled();
    });

    it('should initialize enabled server plugins', () => {
      const config = defineConfig({
        enabledServerPlugins: ['jwt', 'twoFactor', 'apiKey'] as const,
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
          plugins: {
            jwt: { enabled: true },
            twoFactor: { enabled: true },
            apiKey: { enabled: true },
          },
        },
        client: {},
      });

      createAuthServer(config, mockPrismaClient);

      expect(mockPlugins.jwt).toHaveBeenCalled();
      expect(mockPlugins.twoFactor).toHaveBeenCalled();
      expect(mockPlugins.apiKey).toHaveBeenCalled();
    });

    it('should pass plugin configuration to plugin factories', () => {
      const jwtConfig = { enabled: true, jwtAlgorithm: 'HS256' as const };
      const config = defineConfig({
        enabledServerPlugins: ['jwt'] as const,
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
          plugins: {
            jwt: jwtConfig,
          },
        },
        client: {},
      });

      createAuthServer(config, mockPrismaClient);

      expect(mockPlugins.jwt).toHaveBeenCalledWith(jwtConfig);
    });

    it('should handle all core authentication plugins', () => {
      const config = defineConfig({
        enabledServerPlugins: ['username', 'magicLink', 'twoFactor', 'admin', 'organization'] as const,
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
        },
        client: {},
      });

      createAuthServer(config, mockPrismaClient);

      expect(mockPlugins.username).toHaveBeenCalled();
      expect(mockPlugins.magicLink).toHaveBeenCalled();
      expect(mockPlugins.twoFactor).toHaveBeenCalled();
      expect(mockPlugins.admin).toHaveBeenCalled();
      expect(mockPlugins.organization).toHaveBeenCalled();
    });

    it('should handle OAuth/Auth plugins', () => {
      const config = defineConfig({
        enabledServerPlugins: ['siwe', 'genericOAuth', 'oneTap'] as const,
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
        },
        client: {},
      });

      createAuthServer(config, mockPrismaClient);

      expect(mockPlugins.siwe).toHaveBeenCalled();
      expect(mockPlugins.genericOAuth).toHaveBeenCalled();
      expect(mockPlugins.oneTap).toHaveBeenCalled();
    });

    it('should handle security plugins', () => {
      const config = defineConfig({
        enabledServerPlugins: ['bearer', 'jwt', 'apiKey'] as const,
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
        },
        client: {},
      });

      createAuthServer(config, mockPrismaClient);

      expect(mockPlugins.bearer).toHaveBeenCalled();
      expect(mockPlugins.jwt).toHaveBeenCalled();
      expect(mockPlugins.apiKey).toHaveBeenCalled();
    });

    it('should handle advanced plugins', () => {
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
        },
        client: {},
      });

      createAuthServer(config, mockPrismaClient);

      expect(mockPlugins.multiSession).toHaveBeenCalled();
      expect(mockPlugins.anonymous).toHaveBeenCalled();
      expect(mockPlugins.phoneNumber).toHaveBeenCalled();
      expect(mockPlugins.emailOTP).toHaveBeenCalled();
      expect(mockPlugins.deviceAuthorization).toHaveBeenCalled();
      expect(mockPlugins.lastLoginMethod).toHaveBeenCalled();
      expect(mockPlugins.oneTimeToken).toHaveBeenCalled();
    });
  });

  // ============================================================================
  // ERROR HANDLING
  // ============================================================================

  describe('Error Handling', () => {
    it('should warn about unknown plugins', () => {
      const config = defineConfig({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        enabledServerPlugins: ['unknownPlugin' as any],
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
        },
        client: {},
      });

      createAuthServer(config, mockPrismaClient);

      expect(consoleWarnSpy).toHaveBeenCalledWith('Unknown plugin: unknownPlugin');
    });

    it('should handle plugin initialization errors gracefully', () => {
      mockPlugins.jwt.mockImplementation(() => {
        throw new Error('Plugin initialization failed');
      });

      const config = defineConfig({
        enabledServerPlugins: ['jwt'] as const,
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
        },
        client: {},
      });

      // Should not throw
      expect(() => createAuthServer(config, mockPrismaClient)).not.toThrow();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to initialize plugin jwt:',
        expect.any(Error)
      );
    });

    it('should continue initializing other plugins after one fails', () => {
      mockPlugins.jwt.mockImplementation(() => {
        throw new Error('JWT failed');
      });

      const config = defineConfig({
        enabledServerPlugins: ['jwt', 'twoFactor', 'apiKey'] as const,
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
        },
        client: {},
      });

      createAuthServer(config, mockPrismaClient);

      expect(mockPlugins.jwt).toHaveBeenCalled();
      expect(mockPlugins.twoFactor).toHaveBeenCalled();
      expect(mockPlugins.apiKey).toHaveBeenCalled();
    });
  });

  // ============================================================================
  // OAUTH PROVIDERS
  // ============================================================================

  describe('OAuth Providers', () => {
    it('should configure social providers', () => {
      const config = defineConfig({
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
          socialProviders: [
            {
              id: 'github' as const,
              clientId: 'github-client-id',
              clientSecret: 'github-client-secret',
            },
            {
              id: 'google' as const,
              clientId: 'google-client-id',
              clientSecret: 'google-client-secret',
            },
          ],
        },
        client: {},
      });

      createAuthServer(config, mockPrismaClient);

      expect(mockBetterAuth).toHaveBeenCalledWith(
        expect.objectContaining({
          socialProviders: expect.arrayContaining([
            expect.objectContaining({ id: 'github' }),
            expect.objectContaining({ id: 'google' }),
          ]),
        })
      );
    });

    it('should handle empty social providers array', () => {
      const config = defineConfig({
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
          socialProviders: [],
        },
        client: {},
      });

      createAuthServer(config, mockPrismaClient);

      expect(mockBetterAuth).toHaveBeenCalledWith(
        expect.objectContaining({
          socialProviders: [],
        })
      );
    });
  });

  // ============================================================================
  // TRUSTED ORIGINS
  // ============================================================================

  describe('Trusted Origins', () => {
    it('should configure trusted origins', () => {
      const config = defineConfig({
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
          trustedOrigins: ['https://app.example.com', 'https://admin.example.com'],
        },
        client: {},
      });

      createAuthServer(config, mockPrismaClient);

      expect(mockBetterAuth).toHaveBeenCalledWith(
        expect.objectContaining({
          trustedOrigins: ['https://app.example.com', 'https://admin.example.com'],
        })
      );
    });

    it('should handle empty trusted origins array', () => {
      const config = defineConfig({
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
          trustedOrigins: [],
        },
        client: {},
      });

      createAuthServer(config, mockPrismaClient);

      expect(mockBetterAuth).toHaveBeenCalledWith(
        expect.objectContaining({
          trustedOrigins: [],
        })
      );
    });
  });

  // ============================================================================
  // INTEGRATION TESTS
  // ============================================================================

  describe('Integration Tests', () => {
    it('should create a complete production-ready server', () => {
      const config = defineConfig({
        enabledServerPlugins: [
          'username',
          'twoFactor',
          'admin',
          'organization',
          'apiKey',
          'bearer',
          'jwt',
        ] as const,
        server: {
          secret: 'production-secret-key-minimum-32-chars-long',
          appName: 'Production App',
          baseURL: 'https://api.production.com',
          emailAndPassword: {
            enabled: true,
            minPasswordLength: 12,
            requireEmailVerification: true,
          },
          socialProviders: [
            {
              id: 'github' as const,
              clientId: 'github-id',
              clientSecret: 'github-secret',
            },
          ],
          session: {
            expiresIn: 60 * 60 * 24 * 30, // 30 days
            updateAge: 60 * 60 * 24 * 7, // 7 days
            freshAge: 60 * 15, // 15 minutes
          },
          rateLimit: {
            enabled: true,
            window: 60,
            max: 100,
          },
          trustedOrigins: ['https://app.production.com'],
          plugins: {
            twoFactor: {
              issuer: 'Production App',
            },
            admin: {
              defaultRole: 'user',
              roles: ['user', 'admin', 'superadmin'],
            },
          },
        },
        client: {},
      });

      const server = createAuthServer(config, mockPrismaClient);

      expect(server).toBeDefined();
      expect(mockBetterAuth).toHaveBeenCalledWith(
        expect.objectContaining({
          appName: 'Production App',
          baseURL: 'https://api.production.com',
          secret: 'production-secret-key-minimum-32-chars-long',
          plugins: expect.arrayContaining([
            expect.objectContaining({ name: 'mock-plugin' }),
          ]),
        })
      );
    });

    it('should handle configuration with no enabled plugins', () => {
      const config = defineConfig({
        enabledServerPlugins: [] as const,
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
        },
        client: {},
      });

      const server = createAuthServer(config, mockPrismaClient);

      expect(server).toBeDefined();
      // Should still have OpenAPI plugin
      expect(mockPlugins.openAPI).toHaveBeenCalled();
    });
  });

  // ============================================================================
  // TYPE INFERENCE TESTS
  // ============================================================================

  describe('Type Inference', () => {
    it('should infer server type correctly', () => {
      const config = defineConfig({
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
        },
        client: {},
      });

      const server = createAuthServer(config, mockPrismaClient);
      type Server = InferAuthServer<typeof server>;

      // This is a compile-time test - if it compiles, the type is correct
      const _serverTypeTest: Server = server;
      expect(_serverTypeTest).toBe(server);
    });

    it('should infer session type correctly', () => {
      const config = defineConfig({
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
        },
        client: {},
      });

      const server = createAuthServer(config, mockPrismaClient);
      type Session = InferSession<typeof server>;

      // This is a compile-time test
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const _sessionTypeTest: Session = {} as any;
      expect(_sessionTypeTest).toBeDefined();
      // Use server to avoid unused variable error
      expect(server).toBeDefined();
    });
  });
});
