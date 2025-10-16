/**
 * @file libs/better-auth-utilities/src/lib/plugins/admin/admin.utils.spec.ts
 * @description Comprehensive test suite for admin plugin utilities.
 * Targets >90% code coverage with unit tests.
 */

import { Effect } from 'effect';
import {
  banUser,
  unbanUser,
  impersonateUser,
  buildBanUrl,
  buildUnbanUrl,
  buildImpersonateUrl,
  validateUserId,
  UserBanError,
  UserUnbanError,
  ImpersonationError,
  type AdminConfig,
  type BanUserOptions,
  type UnbanUserOptions,
  type ImpersonateUserOptions,
} from './admin.utils';

global.fetch = jest.fn();

describe('admin.utils', () => {
  const mockConfig: AdminConfig = {
    baseUrl: 'http://localhost:3000',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============================================================================
  // URL Building Functions
  // ============================================================================

  describe('buildBanUrl', () => {
    it('should build ban URL with default endpoint', () => {
      expect(buildBanUrl(mockConfig)).toBe('http://localhost:3000/api/auth/admin/ban-user');
    });

    it('should build ban URL with custom endpoint', () => {
      expect(buildBanUrl({ ...mockConfig, banEndpoint: '/custom/ban' })).toBe(
        'http://localhost:3000/custom/ban'
      );
    });
  });

  describe('buildUnbanUrl', () => {
    it('should build unban URL with default endpoint', () => {
      expect(buildUnbanUrl(mockConfig)).toBe('http://localhost:3000/api/auth/admin/unban-user');
    });

    it('should build unban URL with custom endpoint', () => {
      expect(buildUnbanUrl({ ...mockConfig, unbanEndpoint: '/custom/unban' })).toBe(
        'http://localhost:3000/custom/unban'
      );
    });
  });

  describe('buildImpersonateUrl', () => {
    it('should build impersonate URL with default endpoint', () => {
      expect(buildImpersonateUrl(mockConfig)).toBe(
        'http://localhost:3000/api/auth/admin/impersonate'
      );
    });

    it('should build impersonate URL with custom endpoint', () => {
      expect(buildImpersonateUrl({ ...mockConfig, impersonateEndpoint: '/custom/impersonate' })).toBe(
        'http://localhost:3000/custom/impersonate'
      );
    });
  });

  // ============================================================================
  // Validation Functions
  // ============================================================================

  describe('validateUserId', () => {
    it('should validate correct user ID', async () => {
      const result = await Effect.runPromise(validateUserId('user-123'));
      expect(result).toBe('user-123');
    });

    it('should fail for empty user ID', async () => {
      await expect(Effect.runPromise(validateUserId(''))).rejects.toThrow(UserBanError);
      await expect(Effect.runPromise(validateUserId(''))).rejects.toThrow('User ID is required');
    });

    it('should fail for whitespace-only user ID', async () => {
      await expect(Effect.runPromise(validateUserId('   '))).rejects.toThrow(UserBanError);
    });
  });

  // ============================================================================
  // Ban User
  // ============================================================================

  describe('banUser', () => {
    it('should successfully ban a user', async () => {
      const mockResponse = {
        id: 'user-123',
        email: 'user@example.com',
        name: 'Test User',
        banned: true,
        banReason: 'Terms violation',
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const options: BanUserOptions = {
        userId: 'user-123',
        reason: 'Terms violation',
      };

      const result = await Effect.runPromise(banUser(options, mockConfig));

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/api/auth/admin/ban-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId: 'user-123', reason: 'Terms violation' }),
      });
    });

    it('should ban user with expiration date', async () => {
      const expiresAt = new Date('2025-01-01');
      const mockResponse = {
        id: 'user-123',
        email: 'user@example.com',
        name: 'Test User',
        banned: true,
        bannedUntil: expiresAt.toISOString(),
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const options: BanUserOptions = {
        userId: 'user-123',
        expiresAt,
      };

      await Effect.runPromise(banUser(options, mockConfig));

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining(expiresAt.toISOString()),
        })
      );
    });

    it('should handle server error responses', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 403,
        text: async () => 'Insufficient permissions',
      });

      const options: BanUserOptions = { userId: 'user-123' };
      await expect(Effect.runPromise(banUser(options, mockConfig))).rejects.toThrow(UserBanError);
      await expect(Effect.runPromise(banUser(options, mockConfig))).rejects.toThrow(
        'Ban user failed with status 403'
      );
    });

    it('should validate user ID before request', async () => {
      const options: BanUserOptions = { userId: '' };
      await expect(Effect.runPromise(banUser(options, mockConfig))).rejects.toThrow(UserBanError);
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  // ============================================================================
  // Unban User
  // ============================================================================

  describe('unbanUser', () => {
    it('should successfully unban a user', async () => {
      const mockResponse = {
        id: 'user-123',
        email: 'user@example.com',
        name: 'Test User',
        banned: false,
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const options: UnbanUserOptions = { userId: 'user-123' };
      const result = await Effect.runPromise(unbanUser(options, mockConfig));

      expect(result).toEqual(mockResponse);
      expect(result.banned).toBe(false);
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/auth/admin/unban-user',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ userId: 'user-123' }),
        }
      );
    });

    it('should handle server error responses', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
        text: async () => 'User not found',
      });

      const options: UnbanUserOptions = { userId: 'nonexistent' };
      await expect(Effect.runPromise(unbanUser(options, mockConfig))).rejects.toThrow(
        UserUnbanError
      );
    });

    it('should validate user ID before request', async () => {
      const options: UnbanUserOptions = { userId: '' };
      await expect(Effect.runPromise(unbanUser(options, mockConfig))).rejects.toThrow(
        UserUnbanError
      );
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  // ============================================================================
  // Impersonate User
  // ============================================================================

  describe('impersonateUser', () => {
    it('should successfully impersonate a user', async () => {
      const mockResponse = {
        sessionId: 'sess-789',
        userId: 'user-123',
        impersonatedBy: 'admin-456',
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const options: ImpersonateUserOptions = { userId: 'user-123' };
      const result = await Effect.runPromise(impersonateUser(options, mockConfig));

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/auth/admin/impersonate',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ userId: 'user-123' }),
        }
      );
    });

    it('should handle impersonation errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 403,
        text: async () => 'Cannot impersonate admin users',
      });

      const options: ImpersonateUserOptions = { userId: 'admin-789' };
      await expect(Effect.runPromise(impersonateUser(options, mockConfig))).rejects.toThrow(
        ImpersonationError
      );
      await expect(Effect.runPromise(impersonateUser(options, mockConfig))).rejects.toThrow(
        'Impersonate user failed with status 403'
      );
    });

    it('should validate user ID before request', async () => {
      const options: ImpersonateUserOptions = { userId: '   ' };
      await expect(Effect.runPromise(impersonateUser(options, mockConfig))).rejects.toThrow(
        ImpersonationError
      );
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should handle network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const options: ImpersonateUserOptions = { userId: 'user-123' };
      await expect(Effect.runPromise(impersonateUser(options, mockConfig))).rejects.toThrow(
        ImpersonationError
      );
    });
  });

  // ============================================================================
  // Integration Tests
  // ============================================================================

  describe('Integration: Admin workflow', () => {
    it('should complete ban -> unban workflow', async () => {
      // Step 1: Ban user
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'user-123',
          banned: true,
          banReason: 'Spam',
        }),
      });

      const banResult = await Effect.runPromise(
        banUser({ userId: 'user-123', reason: 'Spam' }, mockConfig)
      );
      expect(banResult.banned).toBe(true);

      // Step 2: Unban user
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'user-123',
          banned: false,
        }),
      });

      const unbanResult = await Effect.runPromise(unbanUser({ userId: 'user-123' }, mockConfig));
      expect(unbanResult.banned).toBe(false);
    });

    it('should handle impersonation session management', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          sessionId: 'impersonate-sess-123',
          userId: 'user-456',
          impersonatedBy: 'admin-789',
        }),
      });

      const session = await Effect.runPromise(
        impersonateUser({ userId: 'user-456' }, mockConfig)
      );

      expect(session.userId).toBe('user-456');
      expect(session.impersonatedBy).toBe('admin-789');
      expect(session.sessionId).toContain('impersonate');
    });
  });
});
