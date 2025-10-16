/**
 * @file libs/better-auth-utilities/src/lib/adapters/bearer/bearer-nestjs.service.ts
 * @description Injectable NestJS service wrapping BearerAdapter
 */

import { Injectable } from '@nestjs/common';
import type { AdapterContext } from '../base/plugin-adapter.interface';
import { BearerAdapter } from './bearer.adapter';

/**
 * Injectable NestJS service for Bearer plugin operations
 */
@Injectable()
export class BearerService {
  constructor(private readonly adapter: BearerAdapter) {}

  /**
   * Retrieves session using bearer token from request headers
   *
   * @param context - Adapter context with Authorization header
   * @returns Session and user information if token is valid
   */
  async getSession(context: AdapterContext = {}) {
    return this.adapter.getSession(context);
  }

  getAdapter(): BearerAdapter {
    return this.adapter;
  }
}
