/**
 * @file libs/better-auth-utilities/src/lib/plugins/username/username.utils.spec.ts
 * @description Comprehensive test suite for username plugin utilities.
 */

import { Effect } from 'effect';
import {
  setUsername,
  checkUsernameAvailability,
  buildSetUsernameUrl,
  buildCheckUsernameUrl,
  validateUsername,
  UsernameError,
  type UsernameConfig,
} from './username.utils';

global.fetch = jest.fn();

describe('username.utils', () => {
  const mockConfig: UsernameConfig = {
    baseUrl: 'http://localhost:3000',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('buildSetUsernameUrl', () => {
    it('should build set username URL with default endpoint', () => {
      expect(buildSetUsernameUrl(mockConfig)).toBe('http://localhost:3000/api/auth/username/set');
    });

    it('should build set username URL with custom endpoint', () => {
      expect(buildSetUsernameUrl({ ...mockConfig, setEndpoint: '/custom/set' })).toBe(
        'http://localhost:3000/custom/set'
      );
    });
  });

  describe('buildCheckUsernameUrl', () => {
    it('should build check username URL with default endpoint', () => {
      expect(buildCheckUsernameUrl(mockConfig)).toBe(
        'http://localhost:3000/api/auth/username/check'
      );
    });
  });

  describe('validateUsername', () => {
    it('should validate correct username', async () => {
      const result = await Effect.runPromise(validateUsername('johndoe'));
      expect(result).toBe('johndoe');
    });

    it('should accept username with underscores', async () => {
      const result = await Effect.runPromise(validateUsername('john_doe'));
      expect(result).toBe('john_doe');
    });

    it('should accept username with hyphens', async () => {
      const result = await Effect.runPromise(validateUsername('john-doe'));
      expect(result).toBe('john-doe');
    });

    it('should accept username with numbers', async () => {
      const result = await Effect.runPromise(validateUsername('john123'));
      expect(result).toBe('john123');
    });

    it('should fail for empty username', async () => {
      await expect(Effect.runPromise(validateUsername(''))).rejects.toThrow(UsernameError);
      await expect(Effect.runPromise(validateUsername(''))).rejects.toThrow(
        'Username is required'
      );
    });

    it('should fail for username too short', async () => {
      await expect(Effect.runPromise(validateUsername('ab'))).rejects.toThrow(
        'Username must be between 3 and 30 characters'
      );
    });

    it('should fail for username too long', async () => {
      const longUsername = 'a'.repeat(31);
      await expect(Effect.runPromise(validateUsername(longUsername))).rejects.toThrow(
        'Username must be between 3 and 30 characters'
      );
    });

    it('should fail for username with spaces', async () => {
      await expect(Effect.runPromise(validateUsername('john doe'))).rejects.toThrow(
        'Username can only contain letters, numbers, hyphens, and underscores'
      );
    });

    it('should fail for username with special characters', async () => {
      await expect(Effect.runPromise(validateUsername('john@doe'))).rejects.toThrow(
        'Username can only contain letters, numbers, hyphens, and underscores'
      );
    });
  });

  describe('setUsername', () => {
    it('should successfully set username', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
      });

      await Effect.runPromise(setUsername({ username: 'johndoe' }, mockConfig));

      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/api/auth/username/set', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: 'johndoe' }),
      });
    });

    it('should handle username already taken error', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 409,
        text: async () => 'Username already taken',
      });

      await expect(
        Effect.runPromise(setUsername({ username: 'existing' }, mockConfig))
      ).rejects.toThrow(UsernameError);
      await expect(
        Effect.runPromise(setUsername({ username: 'existing' }, mockConfig))
      ).rejects.toThrow('Set username failed with status 409');
    });

    it('should validate username before request', async () => {
      await expect(Effect.runPromise(setUsername({ username: 'ab' }, mockConfig))).rejects.toThrow(
        UsernameError
      );
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe('checkUsernameAvailability', () => {
    it('should return available when username is not taken', async () => {
      const mockResponse = {
        available: true,
        username: 'johndoe',
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await Effect.runPromise(
        checkUsernameAvailability({ username: 'johndoe' }, mockConfig)
      );

      expect(result).toEqual(mockResponse);
      expect(result.available).toBe(true);
    });

    it('should return unavailable when username is taken', async () => {
      const mockResponse = {
        available: false,
        username: 'taken',
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await Effect.runPromise(
        checkUsernameAvailability({ username: 'taken' }, mockConfig)
      );

      expect(result.available).toBe(false);
    });

    it('should handle server errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
        text: async () => 'Internal server error',
      });

      await expect(
        Effect.runPromise(checkUsernameAvailability({ username: 'test' }, mockConfig))
      ).rejects.toThrow(UsernameError);
    });
  });

  describe('Integration: Username workflow', () => {
    it('should check availability then set username', async () => {
      // Step 1: Check availability
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ available: true, username: 'newuser' }),
      });

      const availability = await Effect.runPromise(
        checkUsernameAvailability({ username: 'newuser' }, mockConfig)
      );
      expect(availability.available).toBe(true);

      // Step 2: Set username
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
      });

      await Effect.runPromise(setUsername({ username: 'newuser' }, mockConfig));

      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });
});
