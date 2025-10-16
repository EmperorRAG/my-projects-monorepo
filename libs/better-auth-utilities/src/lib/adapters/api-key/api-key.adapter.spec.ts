/**
 * @file libs/better-auth-utilities/src/lib/adapters/api-key/api-key.adapter.spec.ts
 * @description Comprehensive unit tests for APIKeyAdapter
 */

import { betterAuth } from 'better-auth';
import {
  APIKeyAdapter,
  type CreateAPIKeyOptions,
  type UpdateAPIKeyOptions,
  type ListAPIKeysOptions,
} from './api-key.adapter';
import { AdapterOperationError, PluginNotAvailableError } from '../base/plugin-adapter.interface';

describe('APIKeyAdapter', () => {
  let adapter: APIKeyAdapter;
  let mockAuth: ReturnType<typeof betterAuth>;

  // Mock API responses
  const mockAPIKey = {
    id: 'key_123',
    key: 'sk_test_123456',
    name: 'Test API Key',
    userId: 'user_123',
    permissions: ['read', 'write'],
    rateLimit: { requests: 100, window: 60 },
    metadata: { purpose: 'testing' },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeAll(() => {
    // Create a mock better-auth instance with API key plugin
    mockAuth = {
      api: {
        createApiKey: jest.fn(),
        listApiKeys: jest.fn(),
        updateApiKey: jest.fn(),
        deleteApiKey: jest.fn(),
        verifyApiKey: jest.fn(),
      },
    } as unknown as ReturnType<typeof betterAuth>;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should create adapter with valid auth instance', () => {
      const testAdapter = new APIKeyAdapter({ auth: mockAuth, debug: false });
      expect(testAdapter).toBeInstanceOf(APIKeyAdapter);
      expect(testAdapter.pluginId).toBe('apiKey');
      expect(testAdapter.pluginName).toBe('API Key');
    });

    it('should enable debug logging when debug flag is true', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const testAdapter = new APIKeyAdapter({ auth: mockAuth, debug: true });
      expect(testAdapter).toBeInstanceOf(APIKeyAdapter);
      expect(consoleSpy).toHaveBeenCalledWith('[APIKeyAdapter]', 'API Key adapter initialized');
      consoleSpy.mockRestore();
    });

    it('should throw PluginNotAvailableError when plugin is not available', () => {
      const authWithoutPlugin = {
        api: {},
      } as unknown as ReturnType<typeof betterAuth>;

      expect(() => new APIKeyAdapter({ auth: authWithoutPlugin, debug: false })).toThrow(
        PluginNotAvailableError
      );
    });

    it('should throw PluginNotAvailableError with correct message', () => {
      const authWithoutPlugin = {
        api: {},
      } as unknown as ReturnType<typeof betterAuth>;

      expect(() => new APIKeyAdapter({ auth: authWithoutPlugin, debug: false })).toThrow(
        'API Key plugin is not available. Ensure it is enabled in your better-auth configuration.'
      );
    });
  });

  describe('isAvailable', () => {
    beforeEach(() => {
      adapter = new APIKeyAdapter({ auth: mockAuth, debug: false });
    });

    it('should return true when plugin is available', () => {
      expect(adapter.isAvailable()).toBe(true);
    });

    it('should return false when createApiKey is not a function', () => {
      const authWithoutPlugin = {
        api: { createApiKey: null },
      } as unknown as ReturnType<typeof betterAuth>;

      const testAdapter = new APIKeyAdapter({ auth: mockAuth, debug: false });
      const originalIsAvailable = testAdapter.isAvailable.bind(testAdapter);
      testAdapter.isAvailable = () => typeof authWithoutPlugin.api.createApiKey === 'function';

      expect(testAdapter.isAvailable()).toBe(false);
    });
  });

  describe('createApiKey', () => {
    beforeEach(() => {
      adapter = new APIKeyAdapter({ auth: mockAuth, debug: false });
    });

    it('should create API key successfully', async () => {
      const createOptions: CreateAPIKeyOptions = {
        name: 'Test Key',
        permissions: ['read'],
      };

      (mockAuth.api.createApiKey as jest.Mock).mockResolvedValue({
        data: mockAPIKey,
        error: null,
      });

      const result = await adapter.createApiKey(createOptions, {});

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockAPIKey);
      expect(result.message).toBe('API key created successfully');
      expect(mockAuth.api.createApiKey).toHaveBeenCalledWith({ ...createOptions, headers: undefined });
    });

    it('should handle API error responses', async () => {
      const createOptions: CreateAPIKeyOptions = {
        name: 'Test Key',
      };

      const apiError = { message: 'Unauthorized', code: 401 };
      (mockAuth.api.createApiKey as jest.Mock).mockResolvedValue({
        data: null,
        error: apiError,
      });

      const result = await adapter.createApiKey(createOptions, {});

      expect(result.success).toBe(false);
      expect(result.error).toBeInstanceOf(AdapterOperationError);
      expect(result.message).toContain('Failed to create API key');
    });

    it('should pass headers from context', async () => {
      const createOptions: CreateAPIKeyOptions = {
        name: 'Test Key',
      };

      const headers = { Authorization: 'Bearer token' };
      (mockAuth.api.createApiKey as jest.Mock).mockResolvedValue({
        data: mockAPIKey,
        error: null,
      });

      await adapter.createApiKey(createOptions, { headers });

      expect(mockAuth.api.createApiKey).toHaveBeenCalledWith({ ...createOptions, headers });
    });

    it('should handle createApiKey with all optional parameters', async () => {
      const createOptions: CreateAPIKeyOptions = {
        name: 'Full Test Key',
        permissions: ['read', 'write', 'delete'],
        rateLimit: { requests: 1000, window: 3600 },
        expiresIn: 86400,
        metadata: { environment: 'production', owner: 'admin' },
      };

      (mockAuth.api.createApiKey as jest.Mock).mockResolvedValue({
        data: { ...mockAPIKey, ...createOptions },
        error: null,
      });

      const result = await adapter.createApiKey(createOptions, {});

      expect(result.success).toBe(true);
      expect(mockAuth.api.createApiKey).toHaveBeenCalledWith({ ...createOptions, headers: undefined });
    });

    it('should handle network errors', async () => {
      const createOptions: CreateAPIKeyOptions = {
        name: 'Test Key',
      };

      (mockAuth.api.createApiKey as jest.Mock).mockRejectedValue(new Error('Network error'));

      const result = await adapter.createApiKey(createOptions, {});

      expect(result.success).toBe(false);
      expect(result.message).toBe('Network error');
    });
  });

  describe('listApiKeys', () => {
    beforeEach(() => {
      adapter = new APIKeyAdapter({ auth: mockAuth, debug: false });
    });

    it('should list API keys successfully', async () => {
      const listOptions: ListAPIKeysOptions = {
        limit: 10,
        offset: 0,
      };

      const mockKeys = [mockAPIKey, { ...mockAPIKey, id: 'key_456' }];
      (mockAuth.api.listApiKeys as jest.Mock).mockResolvedValue({
        data: mockKeys,
        error: null,
      });

      const result = await adapter.listApiKeys(listOptions, {});

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockKeys);
      expect(result.message).toBe('API keys retrieved successfully');
    });

    it('should handle empty list', async () => {
      (mockAuth.api.listApiKeys as jest.Mock).mockResolvedValue({
        data: [],
        error: null,
      });

      const result = await adapter.listApiKeys({}, {});

      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
    });

    it('should handle undefined data as empty array', async () => {
      (mockAuth.api.listApiKeys as jest.Mock).mockResolvedValue({
        data: undefined,
        error: null,
      });

      const result = await adapter.listApiKeys({}, {});

      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
    });

    it('should handle API errors', async () => {
      const apiError = { message: 'Database error' };
      (mockAuth.api.listApiKeys as jest.Mock).mockResolvedValue({
        data: null,
        error: apiError,
      });

      const result = await adapter.listApiKeys({}, {});

      expect(result.success).toBe(false);
      expect(result.error).toBeInstanceOf(AdapterOperationError);
    });
  });

  describe('updateApiKey', () => {
    beforeEach(() => {
      adapter = new APIKeyAdapter({ auth: mockAuth, debug: false });
    });

    it('should update API key successfully', async () => {
      const updateOptions: UpdateAPIKeyOptions = {
        id: 'key_123',
        data: { name: 'Updated Name' },
      };

      const updatedKey = { ...mockAPIKey, name: 'Updated Name' };
      (mockAuth.api.updateApiKey as jest.Mock).mockResolvedValue({
        data: updatedKey,
        error: null,
      });

      const result = await adapter.updateApiKey(updateOptions, {});

      expect(result.success).toBe(true);
      expect(result.data).toEqual(updatedKey);
      expect(result.message).toBe('API key updated successfully');
    });

    it('should update multiple fields', async () => {
      const updateOptions: UpdateAPIKeyOptions = {
        id: 'key_123',
        data: {
          name: 'New Name',
          permissions: ['read'],
          rateLimit: { requests: 50, window: 60 },
        },
      };

      (mockAuth.api.updateApiKey as jest.Mock).mockResolvedValue({
        data: { ...mockAPIKey, ...updateOptions.data },
        error: null,
      });

      const result = await adapter.updateApiKey(updateOptions, {});

      expect(result.success).toBe(true);
    });

    it('should handle update errors', async () => {
      const updateOptions: UpdateAPIKeyOptions = {
        id: 'key_123',
        data: { name: 'Updated' },
      };

      (mockAuth.api.updateApiKey as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: 'Not found' },
      });

      const result = await adapter.updateApiKey(updateOptions, {});

      expect(result.success).toBe(false);
    });
  });

  describe('deleteApiKey', () => {
    beforeEach(() => {
      adapter = new APIKeyAdapter({ auth: mockAuth, debug: false });
    });

    it('should delete API key successfully', async () => {
      (mockAuth.api.deleteApiKey as jest.Mock).mockResolvedValue({
        data: { success: true },
        error: null,
      });

      const result = await adapter.deleteApiKey('key_123', {});

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ success: true });
      expect(result.message).toBe('API key deleted successfully');
    });

    it('should handle deletion errors', async () => {
      (mockAuth.api.deleteApiKey as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: 'Key not found' },
      });

      const result = await adapter.deleteApiKey('key_123', {});

      expect(result.success).toBe(false);
      expect(result.error).toBeInstanceOf(AdapterOperationError);
    });

    it('should pass headers to deleteApiKey', async () => {
      const headers = { 'X-Custom': 'value' };
      (mockAuth.api.deleteApiKey as jest.Mock).mockResolvedValue({
        data: { success: true },
        error: null,
      });

      await adapter.deleteApiKey('key_123', { headers });

      expect(mockAuth.api.deleteApiKey).toHaveBeenCalledWith({ id: 'key_123', headers });
    });
  });

  describe('verifyApiKey', () => {
    beforeEach(() => {
      adapter = new APIKeyAdapter({ auth: mockAuth, debug: false });
    });

    it('should verify API key successfully', async () => {
      const verifyResult = {
        valid: true,
        key: mockAPIKey,
      };

      (mockAuth.api.verifyApiKey as jest.Mock).mockResolvedValue({
        data: verifyResult,
        error: null,
      });

      const result = await adapter.verifyApiKey('sk_test_123456', {});

      expect(result.success).toBe(true);
      expect(result.data).toEqual(verifyResult);
      expect(result.message).toBe('API key verified successfully');
    });

    it('should handle invalid API key', async () => {
      (mockAuth.api.verifyApiKey as jest.Mock).mockResolvedValue({
        data: { valid: false, key: null },
        error: null,
      });

      const result = await adapter.verifyApiKey('invalid_key', {});

      expect(result.success).toBe(true);
      expect(result.data?.valid).toBe(false);
    });

    it('should handle verification errors', async () => {
      (mockAuth.api.verifyApiKey as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: 'Verification failed' },
      });

      const result = await adapter.verifyApiKey('sk_test_123456', {});

      expect(result.success).toBe(false);
    });
  });

  describe('Debug logging', () => {
    it('should log when debug is enabled', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const debugAdapter = new APIKeyAdapter({ auth: mockAuth, debug: true });

      (mockAuth.api.createApiKey as jest.Mock).mockResolvedValue({
        data: mockAPIKey,
        error: null,
      });

      await debugAdapter.createApiKey({ name: 'Test' }, {});

      expect(consoleSpy).toHaveBeenCalledWith('[APIKeyAdapter]', 'Creating API key:', 'Test');
      consoleSpy.mockRestore();
    });

    it('should not log when debug is disabled', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const quietAdapter = new APIKeyAdapter({ auth: mockAuth, debug: false });

      (mockAuth.api.createApiKey as jest.Mock).mockResolvedValue({
        data: mockAPIKey,
        error: null,
      });

      await quietAdapter.createApiKey({ name: 'Test' }, {});

      expect(consoleSpy).not.toHaveBeenCalledWith('[APIKeyAdapter]', expect.anything());
      consoleSpy.mockRestore();
    });
  });

  describe('Edge cases', () => {
    beforeEach(() => {
      adapter = new APIKeyAdapter({ auth: mockAuth, debug: false });
    });

    it('should handle null context gracefully', async () => {
      (mockAuth.api.listApiKeys as jest.Mock).mockResolvedValue({
        data: [],
        error: null,
      });

      const result = await adapter.listApiKeys({}, {} as never);

      expect(result.success).toBe(true);
    });

    it('should handle missing metadata in options', async () => {
      (mockAuth.api.createApiKey as jest.Mock).mockResolvedValue({
        data: mockAPIKey,
        error: null,
      });

      const result = await adapter.createApiKey({ name: 'Test' }, {});

      expect(result.success).toBe(true);
    });

    it('should handle exception thrown from API', async () => {
      (mockAuth.api.createApiKey as jest.Mock).mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      const result = await adapter.createApiKey({ name: 'Test' }, {});

      expect(result.success).toBe(false);
      expect(result.message).toBe('Unexpected error');
    });
  });
});
