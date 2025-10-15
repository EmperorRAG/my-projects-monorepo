/**
 * @file libs/better-auth-utilities/src/lib/plugins/two-factor/two-factor.utils.spec.ts
 * @description Comprehensive test suite for two-factor authentication utilities.
 * Targets >90% code coverage with unit tests.
 */

import { Effect } from 'effect';
import {
  enableTwoFactor,
  disableTwoFactor,
  verifyTwoFactorCode,
  buildEnableUrl,
  buildDisableUrl,
  buildVerifyUrl,
  validateEnableOptions,
  validateVerificationCode,
  TwoFactorEnableError,
  TwoFactorDisableError,
  TwoFactorVerificationError,
  type TwoFactorConfig,
  type EnableTwoFactorOptions,
  type VerifyTwoFactorCodeOptions,
} from './two-factor.utils';

// Mock global fetch
global.fetch = jest.fn();

describe('two-factor.utils', () => {
  const mockConfig: TwoFactorConfig = {
    baseUrl: 'http://localhost:3000',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============================================================================
  // URL Building Functions
  // ============================================================================

  describe('buildEnableUrl', () => {
    it('should build enable URL with default endpoint', () => {
      const url = buildEnableUrl(mockConfig);
      expect(url).toBe('http://localhost:3000/api/auth/two-factor/enable');
    });

    it('should build enable URL with custom endpoint', () => {
      const url = buildEnableUrl({
        ...mockConfig,
        enableEndpoint: '/custom/enable',
      });
      expect(url).toBe('http://localhost:3000/custom/enable');
    });
  });

  describe('buildDisableUrl', () => {
    it('should build disable URL with default endpoint', () => {
      const url = buildDisableUrl(mockConfig);
      expect(url).toBe('http://localhost:3000/api/auth/two-factor/disable');
    });

    it('should build disable URL with custom endpoint', () => {
      const url = buildDisableUrl({
        ...mockConfig,
        disableEndpoint: '/custom/disable',
      });
      expect(url).toBe('http://localhost:3000/custom/disable');
    });
  });

  describe('buildVerifyUrl', () => {
    it('should build verify URL with default endpoint', () => {
      const url = buildVerifyUrl(mockConfig);
      expect(url).toBe('http://localhost:3000/api/auth/two-factor/verify');
    });

    it('should build verify URL with custom endpoint', () => {
      const url = buildVerifyUrl({
        ...mockConfig,
        verifyEndpoint: '/custom/verify',
      });
      expect(url).toBe('http://localhost:3000/custom/verify');
    });
  });

  // ============================================================================
  // Validation Functions
  // ============================================================================

  describe('validateEnableOptions', () => {
    it('should validate correct enable options', async () => {
      const options: EnableTwoFactorOptions = { password: 'validPassword123' };
      const result = await Effect.runPromise(validateEnableOptions(options));
      expect(result).toEqual(options);
    });

    it('should fail for empty password', async () => {
      const options: EnableTwoFactorOptions = { password: '' };
      await expect(Effect.runPromise(validateEnableOptions(options))).rejects.toThrow(
        TwoFactorEnableError
      );
    });

    it('should fail for whitespace-only password', async () => {
      const options: EnableTwoFactorOptions = { password: '   ' };
      await expect(Effect.runPromise(validateEnableOptions(options))).rejects.toThrow(
        TwoFactorEnableError
      );
    });

    it('should include error message about password requirement', async () => {
      const options: EnableTwoFactorOptions = { password: '' };
      await expect(Effect.runPromise(validateEnableOptions(options))).rejects.toThrow(
        'Password is required'
      );
    });
  });

  describe('validateVerificationCode', () => {
    it('should validate correct 6-digit code', async () => {
      const result = await Effect.runPromise(validateVerificationCode('123456'));
      expect(result).toBe('123456');
    });

    it('should fail for empty code', async () => {
      await expect(Effect.runPromise(validateVerificationCode(''))).rejects.toThrow(
        TwoFactorVerificationError
      );
    });

    it('should fail for code with less than 6 digits', async () => {
      await expect(Effect.runPromise(validateVerificationCode('12345'))).rejects.toThrow(
        'Verification code must be 6 digits'
      );
    });

    it('should fail for code with more than 6 digits', async () => {
      await expect(Effect.runPromise(validateVerificationCode('1234567'))).rejects.toThrow(
        'Verification code must be 6 digits'
      );
    });

    it('should fail for non-numeric code', async () => {
      await expect(Effect.runPromise(validateVerificationCode('12345a'))).rejects.toThrow(
        'Verification code must be 6 digits'
      );
    });
  });

  // ============================================================================
  // Enable Two-Factor
  // ============================================================================

  describe('enableTwoFactor', () => {
    it('should successfully enable two-factor authentication', async () => {
      const mockResponse = {
        secret: 'JBSWY3DPEHPK3PXP',
        qrCode: 'data:image/png;base64,iVBORw0KGgo...',
        backupCodes: ['code1', 'code2', 'code3'],
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const options: EnableTwoFactorOptions = { password: 'testPassword123' };
      const result = await Effect.runPromise(enableTwoFactor(options, mockConfig));

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/auth/two-factor/enable',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ password: 'testPassword123' }),
        }
      );
    });

    it('should handle server error responses', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 401,
        text: async () => 'Invalid password',
      });

      const options: EnableTwoFactorOptions = { password: 'wrongPassword' };
      await expect(Effect.runPromise(enableTwoFactor(options, mockConfig))).rejects.toThrow(
        TwoFactorEnableError
      );
      await expect(Effect.runPromise(enableTwoFactor(options, mockConfig))).rejects.toThrow(
        'Enable two-factor failed with status 401'
      );
    });

    it('should handle network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const options: EnableTwoFactorOptions = { password: 'testPassword123' };
      await expect(Effect.runPromise(enableTwoFactor(options, mockConfig))).rejects.toThrow(
        TwoFactorEnableError
      );
    });

    it('should validate options before making request', async () => {
      const options: EnableTwoFactorOptions = { password: '' };
      await expect(Effect.runPromise(enableTwoFactor(options, mockConfig))).rejects.toThrow(
        TwoFactorEnableError
      );
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  // ============================================================================
  // Disable Two-Factor
  // ============================================================================

  describe('disableTwoFactor', () => {
    it('should successfully disable two-factor authentication', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
      });

      const options: EnableTwoFactorOptions = { password: 'testPassword123' };
      await Effect.runPromise(disableTwoFactor(options, mockConfig));

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/auth/two-factor/disable',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ password: 'testPassword123' }),
        }
      );
    });

    it('should handle server error responses', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 403,
        text: async () => 'Forbidden',
      });

      const options: EnableTwoFactorOptions = { password: 'testPassword123' };
      await expect(Effect.runPromise(disableTwoFactor(options, mockConfig))).rejects.toThrow(
        TwoFactorDisableError
      );
      await expect(Effect.runPromise(disableTwoFactor(options, mockConfig))).rejects.toThrow(
        'Disable two-factor failed with status 403'
      );
    });

    it('should handle network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Connection refused'));

      const options: EnableTwoFactorOptions = { password: 'testPassword123' };
      await expect(Effect.runPromise(disableTwoFactor(options, mockConfig))).rejects.toThrow(
        TwoFactorDisableError
      );
    });
  });

  // ============================================================================
  // Verify Two-Factor Code
  // ============================================================================

  describe('verifyTwoFactorCode', () => {
    it('should successfully verify two-factor code', async () => {
      const mockResponse = {
        verified: true,
        session: {
          userId: 'user-123',
          sessionId: 'sess-456',
        },
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const options: VerifyTwoFactorCodeOptions = { code: '123456' };
      const result = await Effect.runPromise(verifyTwoFactorCode(options, mockConfig));

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/auth/two-factor/verify',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ code: '123456' }),
        }
      );
    });

    it('should handle invalid code responses', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 400,
        text: async () => 'Invalid code',
      });

      const options: VerifyTwoFactorCodeOptions = { code: '000000' };
      await expect(Effect.runPromise(verifyTwoFactorCode(options, mockConfig))).rejects.toThrow(
        TwoFactorVerificationError
      );
      await expect(Effect.runPromise(verifyTwoFactorCode(options, mockConfig))).rejects.toThrow(
        'Verify two-factor failed with status 400'
      );
    });

    it('should validate code format before making request', async () => {
      const options: VerifyTwoFactorCodeOptions = { code: '12345' };
      await expect(Effect.runPromise(verifyTwoFactorCode(options, mockConfig))).rejects.toThrow(
        TwoFactorVerificationError
      );
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should handle network errors during verification', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Timeout'));

      const options: VerifyTwoFactorCodeOptions = { code: '123456' };
      await expect(Effect.runPromise(verifyTwoFactorCode(options, mockConfig))).rejects.toThrow(
        TwoFactorVerificationError
      );
    });
  });

  // ============================================================================
  // Integration Tests
  // ============================================================================

  describe('Integration: Full two-factor flow', () => {
    it('should complete enable -> verify workflow', async () => {
      // Step 1: Enable 2FA
      const enableResponse = {
        secret: 'JBSWY3DPEHPK3PXP',
        qrCode: 'data:image/png;base64,iVBORw0KGgo...',
        backupCodes: ['code1', 'code2', 'code3'],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => enableResponse,
      });

      const enableResult = await Effect.runPromise(
        enableTwoFactor({ password: 'testPassword' }, mockConfig)
      );

      expect(enableResult.secret).toBeTruthy();
      expect(enableResult.backupCodes).toHaveLength(3);

      // Step 2: Verify with code
      const verifyResponse = {
        verified: true,
        session: { userId: 'user-123', sessionId: 'sess-456' },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => verifyResponse,
      });

      const verifyResult = await Effect.runPromise(
        verifyTwoFactorCode({ code: '123456' }, mockConfig)
      );

      expect(verifyResult.verified).toBe(true);
      expect(verifyResult.session?.userId).toBe('user-123');
    });
  });
});
