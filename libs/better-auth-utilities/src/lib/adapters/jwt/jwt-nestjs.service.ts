/**
 * @file libs/better-auth-utilities/src/lib/adapters/jwt/jwt-nestjs.service.ts
 * @description Injectable NestJS service wrapping JWTAdapter
 */

import { Injectable } from '@nestjs/common';
import type { AdapterContext } from '../base/plugin-adapter.interface';
import { JWTAdapter } from './jwt.adapter';

/**
 * Injectable NestJS service for JWT plugin operations
 */
@Injectable()
export class JWTService {
  constructor(private readonly adapter: JWTAdapter) {}

  /**
   * Retrieves session using JWT token from request headers or cookies
   *
   * @param context - Adapter context with JWT token in headers/cookies
   * @returns Session and user information if token is valid
   */
  async getSession(context: AdapterContext = {}) {
    return this.adapter.getSession(context);
  }

  getAdapter(): JWTAdapter {
    return this.adapter;
  }
}
