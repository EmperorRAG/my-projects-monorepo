import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { S2SAuthGuard } from './s2s-auth.guard';
import { BetterAuthService } from './better-auth.service';
import { validToken, invalidToken } from '../../test/fixtures/email';

describe('S2SAuthGuard', () => {
	let guard: S2SAuthGuard;
	let betterAuthService: BetterAuthService;

	beforeEach(() => {
		betterAuthService = new BetterAuthService();
		guard = new S2SAuthGuard(betterAuthService);
	});

	const createMockExecutionContext = (
		authHeader?: string,
	): ExecutionContext => {
		return {
			switchToHttp: () => ({
				getRequest: () => ({
					headers: {
						authorization: authHeader,
					},
				}),
			}),
		} as ExecutionContext;
	};

	describe('canActivate', () => {
		it('should return true for valid bearer token', () => {
			const context = createMockExecutionContext(`Bearer ${validToken}`);
			const result = guard.canActivate(context);
			expect(result).toBe(true);
		});

		it('should throw UnauthorizedException when authorization header is missing', () => {
			const context = createMockExecutionContext();
			expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
			expect(() => guard.canActivate(context)).toThrow(
				'Missing or invalid authorization header',
			);
		});

		it('should throw UnauthorizedException when authorization header does not start with Bearer', () => {
			const context = createMockExecutionContext(`Basic ${validToken}`);
			expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
			expect(() => guard.canActivate(context)).toThrow(
				'Missing or invalid authorization header',
			);
		});

		it('should throw UnauthorizedException for invalid token', () => {
			const context = createMockExecutionContext(`Bearer ${invalidToken}`);
			expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
			expect(() => guard.canActivate(context)).toThrow('Invalid token');
		});

		it('should throw UnauthorizedException for empty bearer token', () => {
			const context = createMockExecutionContext('Bearer ');
			expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
			expect(() => guard.canActivate(context)).toThrow('Invalid token');
		});

		it('should throw UnauthorizedException for malformed authorization header', () => {
			const context = createMockExecutionContext('InvalidFormat');
			expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
			expect(() => guard.canActivate(context)).toThrow(
				'Missing or invalid authorization header',
			);
		});
	});
});
