import { BetterAuthService } from './better-auth.service';
import { validToken, invalidToken } from '../../test/fixtures/email';

describe('BetterAuthService', () => {
	let service: BetterAuthService;

	beforeEach(() => {
		service = new BetterAuthService();
	});

	describe('validateToken', () => {
		it('should return true for valid token', () => {
			const result = service.validateToken(validToken);
			expect(result).toBe(true);
		});

		it('should return false for invalid token', () => {
			const result = service.validateToken(invalidToken);
			expect(result).toBe(false);
		});

		it('should return false for empty token', () => {
			const result = service.validateToken('');
			expect(result).toBe(false);
		});

		it('should return false for token with whitespace', () => {
			const result = service.validateToken('  invalid  ');
			expect(result).toBe(false);
		});
	});
});
