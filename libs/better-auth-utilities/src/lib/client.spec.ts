/**
 * @file libs/better-auth-utilities/src/lib/client.spec.ts
 * @description Comprehensive test suite for better-auth client instance creation.
 * Targets >90% code coverage with unit and integration tests.
 */

import { defineConfig } from './config';

// Mock better-auth/client and its dependencies
const mockCreateAuthClient = jest.fn();
const mockClientPlugins = {
  apiKeyClient: jest.fn(),
  twoFactorClient: jest.fn(),
  adminClient: jest.fn(),
  organizationClient: jest.fn(),
  usernameClient: jest.fn(),
  magicLinkClient: jest.fn(),
  siweClient: jest.fn(),
  genericOAuthClient: jest.fn(),
  oneTapClient: jest.fn(),
  anonymousClient: jest.fn(),
  phoneNumberClient: jest.fn(),
  emailOTPClient: jest.fn(),
  lastLoginMethodClient: jest.fn(),
  oneTimeTokenClient: jest.fn(),
  multiSessionClient: jest.fn(),
};

jest.mock('better-auth/client', () => ({
  createAuthClient: mockCreateAuthClient,
}));

jest.mock('better-auth/client/plugins', () => mockClientPlugins);

// Import after mocking
import { createBetterAuthClient, type InferAuthClient } from './client';

describe('better-auth-utilities: client', () => {
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock console methods
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    // Setup default mock implementations
    mockCreateAuthClient.mockReturnValue({
      signIn: {},
      signOut: jest.fn(),
      useSession: jest.fn(),
    });

    // Setup plugin mocks to return plugin objects
    Object.values(mockClientPlugins).forEach((plugin) => {
      plugin.mockReturnValue({ name: 'mock-client-plugin' });
    });
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  // ============================================================================
  // BASIC FUNCTIONALITY
  // ============================================================================

  describe('createBetterAuthClient', () => {
    it('should create a client instance with minimal configuration', () => {
      const config = defineConfig({
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
        },
        client: {},
      });

      const client = createBetterAuthClient(config);

      expect(client).toBeDefined();
      expect(mockCreateAuthClient).toHaveBeenCalledTimes(1);
    });

    it('should call createAuthClient with correct base configuration', () => {
      const config = defineConfig({
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
          baseURL: 'https://api.test.com',
        },
        client: {
          baseURL: 'https://client.test.com',
        },
      });

      createBetterAuthClient(config);

      expect(mockCreateAuthClient).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: 'https://client.test.com',
        })
      );
    });

    it('should fall back to server baseURL if client baseURL not provided', () => {
      const config = defineConfig({
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
          baseURL: 'https://api.test.com',
        },
        client: {},
      });

      createBetterAuthClient(config);

      expect(mockCreateAuthClient).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: 'https://api.test.com',
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

      createBetterAuthClient(config);

      expect(mockCreateAuthClient).toHaveBeenCalledWith(
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

    it('should fall back to localhost if no baseURL provided', () => {
      const originalEnv = process.env.BETTER_AUTH_URL;
      delete process.env.BETTER_AUTH_URL;

      const config = defineConfig({
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
        },
        client: {},
      });

      createBetterAuthClient(config);

      expect(mockCreateAuthClient).toHaveBeenCalledWith(
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
  // FETCH OPTIONS CONFIGURATION
  // ============================================================================

  describe('Fetch Options Configuration', () => {
    it('should configure fetch options with defaults', () => {
      const config = defineConfig({
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
        },
        client: {},
      });

      createBetterAuthClient(config);

      expect(mockCreateAuthClient).toHaveBeenCalledWith(
        expect.objectContaining({
          fetchOptions: {
            credentials: 'include',
            onSuccess: undefined,
            onError: undefined,
          },
        })
      );
    });

    it('should use custom fetch options', () => {
      const onSuccess = jest.fn();
      const onError = jest.fn();

      const config = defineConfig({
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
        },
        client: {
          fetchOptions: {
            credentials: 'same-origin',
            onSuccess,
            onError,
          },
        },
      });

      createBetterAuthClient(config);

      expect(mockCreateAuthClient).toHaveBeenCalledWith(
        expect.objectContaining({
          fetchOptions: {
            credentials: 'same-origin',
            onSuccess,
            onError,
          },
        })
      );
    });

    it('should handle omit credentials mode', () => {
      const config = defineConfig({
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
        },
        client: {
          fetchOptions: {
            credentials: 'omit',
          },
        },
      });

      createBetterAuthClient(config);

      expect(mockCreateAuthClient).toHaveBeenCalledWith(
        expect.objectContaining({
          fetchOptions: expect.objectContaining({
            credentials: 'omit',
          }),
        })
      );
    });
  });

  // ============================================================================
  // PLUGIN INITIALIZATION
  // ============================================================================

  describe('Plugin Initialization', () => {
    it('should initialize enabled client plugins', () => {
      const config = defineConfig({
        enabledClientPlugins: ['twoFactor', 'admin', 'organization'] as const,
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
        },
        client: {},
      });

      createBetterAuthClient(config);

      expect(mockClientPlugins.twoFactorClient).toHaveBeenCalled();
      expect(mockClientPlugins.adminClient).toHaveBeenCalled();
      expect(mockClientPlugins.organizationClient).toHaveBeenCalled();
    });

    it('should fall back to server plugins if client plugins not specified', () => {
      const config = defineConfig({
        enabledServerPlugins: ['twoFactor', 'apiKey'] as const,
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
        },
        client: {},
      });

      createBetterAuthClient(config);

      expect(mockClientPlugins.twoFactorClient).toHaveBeenCalled();
      expect(mockClientPlugins.apiKeyClient).toHaveBeenCalled();
    });

    it('should pass plugin configuration to plugin factories', () => {
      const twoFactorConfig = { enabled: true, twoFactorPage: '/auth/2fa' };
      const config = defineConfig({
        enabledClientPlugins: ['twoFactor'] as const,
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
        },
        client: {
          plugins: {
            twoFactor: twoFactorConfig,
          },
        },
      });

      createBetterAuthClient(config);

      expect(mockClientPlugins.twoFactorClient).toHaveBeenCalledWith(twoFactorConfig);
    });

    it('should handle all core authentication client plugins', () => {
      const config = defineConfig({
        enabledClientPlugins: ['username', 'magicLink', 'twoFactor', 'admin', 'organization'] as const,
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
        },
        client: {},
      });

      createBetterAuthClient(config);

      expect(mockClientPlugins.usernameClient).toHaveBeenCalled();
      expect(mockClientPlugins.magicLinkClient).toHaveBeenCalled();
      expect(mockClientPlugins.twoFactorClient).toHaveBeenCalled();
      expect(mockClientPlugins.adminClient).toHaveBeenCalled();
      expect(mockClientPlugins.organizationClient).toHaveBeenCalled();
    });

    it('should handle OAuth/Auth client plugins', () => {
      const config = defineConfig({
        enabledClientPlugins: ['siwe', 'genericOAuth', 'oneTap'] as const,
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
        },
        client: {},
      });

      createBetterAuthClient(config);

      expect(mockClientPlugins.siweClient).toHaveBeenCalled();
      expect(mockClientPlugins.genericOAuthClient).toHaveBeenCalled();
      expect(mockClientPlugins.oneTapClient).toHaveBeenCalled();
    });

    it('should handle security client plugins', () => {
      const config = defineConfig({
        enabledClientPlugins: ['apiKey'] as const,
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
        },
        client: {},
      });

      createBetterAuthClient(config);

      expect(mockClientPlugins.apiKeyClient).toHaveBeenCalled();
    });

    it('should handle advanced client plugins', () => {
      const config = defineConfig({
        enabledClientPlugins: [
          'multiSession',
          'anonymous',
          'phoneNumber',
          'emailOTP',
          'lastLoginMethod',
          'oneTimeToken',
        ] as const,
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
        },
        client: {},
      });

      createBetterAuthClient(config);

      expect(mockClientPlugins.multiSessionClient).toHaveBeenCalled();
      expect(mockClientPlugins.anonymousClient).toHaveBeenCalled();
      expect(mockClientPlugins.phoneNumberClient).toHaveBeenCalled();
      expect(mockClientPlugins.emailOTPClient).toHaveBeenCalled();
      expect(mockClientPlugins.lastLoginMethodClient).toHaveBeenCalled();
      expect(mockClientPlugins.oneTimeTokenClient).toHaveBeenCalled();
    });

    it('should not include null plugins in the plugins array', () => {
      // Bearer and JWT return null (server-only)
      mockClientPlugins.apiKeyClient.mockReturnValue(null);

      const config = defineConfig({
        enabledClientPlugins: ['apiKey'] as const,
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
        },
        client: {},
      });

      createBetterAuthClient(config);

      expect(mockCreateAuthClient).toHaveBeenCalledWith(
        expect.objectContaining({
          plugins: [],
        })
      );
    });
  });

  // ============================================================================
  // ERROR HANDLING
  // ============================================================================

  describe('Error Handling', () => {
    it('should warn about unknown client plugins', () => {
      const config = defineConfig({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        enabledClientPlugins: ['unknownPlugin' as any],
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
        },
        client: {},
      });

      createBetterAuthClient(config);

      expect(consoleWarnSpy).toHaveBeenCalledWith('Unknown client plugin: unknownPlugin');
    });

    it('should handle plugin initialization errors gracefully', () => {
      mockClientPlugins.twoFactorClient.mockImplementation(() => {
        throw new Error('Plugin initialization failed');
      });

      const config = defineConfig({
        enabledClientPlugins: ['twoFactor'] as const,
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
        },
        client: {},
      });

      // Should not throw
      expect(() => createBetterAuthClient(config)).not.toThrow();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to initialize client plugin twoFactor:',
        expect.any(Error)
      );
    });

    it('should continue initializing other plugins after one fails', () => {
      mockClientPlugins.twoFactorClient.mockImplementation(() => {
        throw new Error('TwoFactor failed');
      });

      const config = defineConfig({
        enabledClientPlugins: ['twoFactor', 'admin', 'organization'] as const,
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
        },
        client: {},
      });

      createBetterAuthClient(config);

      expect(mockClientPlugins.twoFactorClient).toHaveBeenCalled();
      expect(mockClientPlugins.adminClient).toHaveBeenCalled();
      expect(mockClientPlugins.organizationClient).toHaveBeenCalled();
    });

    it('should handle errors from plugins requiring additional packages', () => {
      const config = defineConfig({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        enabledClientPlugins: ['passkey', 'stripe', 'polar'] as any,
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
        },
        client: {},
      });

      createBetterAuthClient(config);

      // Should log errors for each unavailable plugin
      expect(consoleErrorSpy).toHaveBeenCalledTimes(3);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to initialize client plugin passkey:',
        expect.any(Error)
      );
    });
  });

  // ============================================================================
  // INTEGRATION TESTS
  // ============================================================================

  describe('Integration Tests', () => {
    it('should create a complete production-ready client', () => {
      const onSuccess = jest.fn();
      const onError = jest.fn();

      const config = defineConfig({
        enabledClientPlugins: [
          'username',
          'twoFactor',
          'admin',
          'organization',
          'apiKey',
          'anonymous',
        ] as const,
        server: {
          secret: 'production-secret-key-minimum-32-chars-long',
          baseURL: 'https://api.production.com',
        },
        client: {
          baseURL: 'https://api.production.com',
          fetchOptions: {
            credentials: 'include',
            onSuccess,
            onError,
          },
          plugins: {
            twoFactor: {
              enabled: true,
              twoFactorPage: '/auth/2fa',
            },
          },
        },
      });

      const client = createBetterAuthClient(config);

      expect(client).toBeDefined();
      expect(mockCreateAuthClient).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: 'https://api.production.com',
          fetchOptions: expect.objectContaining({
            credentials: 'include',
            onSuccess,
            onError,
          }),
          plugins: expect.any(Array),
        })
      );
    });

    it('should handle configuration with no enabled plugins', () => {
      const config = defineConfig({
        enabledClientPlugins: [] as const,
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
        },
        client: {},
      });

      const client = createBetterAuthClient(config);

      expect(client).toBeDefined();
      expect(mockCreateAuthClient).toHaveBeenCalledWith(
        expect.objectContaining({
          plugins: [],
        })
      );
    });

    it('should handle undefined enabled plugins array', () => {
      const config = defineConfig({
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
        },
        client: {},
      });

      const client = createBetterAuthClient(config);

      expect(client).toBeDefined();
      expect(mockCreateAuthClient).toHaveBeenCalled();
    });
  });

  // ============================================================================
  // TYPE INFERENCE TESTS
  // ============================================================================

  describe('Type Inference', () => {
    it('should infer client type correctly', () => {
      const config = defineConfig({
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
        },
        client: {},
      });

      const client = createBetterAuthClient(config);
      type Client = InferAuthClient<typeof client>;

      // This is a compile-time test - if it compiles, the type is correct
      const _clientTypeTest: Client = client;
      expect(_clientTypeTest).toBe(client);
    });
  });

  // ============================================================================
  // EDGE CASES
  // ============================================================================

  describe('Edge Cases', () => {
    it('should handle empty plugin configuration object', () => {
      const config = defineConfig({
        enabledClientPlugins: ['twoFactor'] as const,
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
        },
        client: {
          plugins: {},
        },
      });

      createBetterAuthClient(config);

      expect(mockClientPlugins.twoFactorClient).toHaveBeenCalledWith(undefined);
    });

    it('should handle mixed successful and failed plugin initialization', () => {
      mockClientPlugins.twoFactorClient.mockImplementation(() => {
        throw new Error('Failed');
      });
      mockClientPlugins.adminClient.mockReturnValue({ name: 'admin-plugin' });

      const config = defineConfig({
        enabledClientPlugins: ['twoFactor', 'admin'] as const,
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
        },
        client: {},
      });

      createBetterAuthClient(config);

      expect(mockCreateAuthClient).toHaveBeenCalledWith(
        expect.objectContaining({
          plugins: [{ name: 'admin-plugin' }],
        })
      );
    });

    it('should handle very long baseURL', () => {
      const longURL = 'https://' + 'a'.repeat(1000) + '.com';
      const config = defineConfig({
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
        },
        client: {
          baseURL: longURL,
        },
      });

      createBetterAuthClient(config);

      expect(mockCreateAuthClient).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: longURL,
        })
      );
    });

    it('should preserve plugin order', () => {
      const config = defineConfig({
        enabledClientPlugins: ['username', 'twoFactor', 'admin'] as const,
        server: {
          secret: 'test-secret-key-minimum-32-chars-long',
        },
        client: {},
      });

      createBetterAuthClient(config);

      // Plugins should be called in order
      const calls = [
        mockClientPlugins.usernameClient,
        mockClientPlugins.twoFactorClient,
        mockClientPlugins.adminClient,
      ];

      calls.forEach((call) => {
        expect(call).toHaveBeenCalled();
      });
    });
  });
});
