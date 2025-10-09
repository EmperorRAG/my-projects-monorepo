import { Injectable } from '@nestjs/common';

@Injectable()
export class BetterAuthService {
  /**
   * Mock token validation.
   * In a real scenario, this would validate a JWT.
   * For now, it just checks if the token is 'valid-token'.
   */
  validateToken(token: string): boolean {
    return token === 'valid-token';
  }
}
