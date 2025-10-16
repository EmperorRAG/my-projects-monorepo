/**
 * @file libs/better-auth-utilities/src/lib/adapters/username/username-nestjs.service.ts
 * @description Injectable NestJS service wrapping UsernameAdapter
 */

import { Injectable } from '@nestjs/common';
import type { AdapterContext } from '../base/plugin-adapter.interface';
import {
  UsernameAdapter,
  type SignInUsernameOptions,
  type SignUpEmailOptions,
  type IsUsernameAvailableOptions,
  type UpdateUserOptions,
} from './username.adapter';

/**
 * Injectable NestJS service for Username plugin operations
 */
@Injectable()
export class UsernameService {
  constructor(private readonly adapter: UsernameAdapter) {}

  async signInUsername(options: SignInUsernameOptions, context: AdapterContext = {}) {
    return this.adapter.signInUsername(options, context);
  }

  async signUpEmail(options: SignUpEmailOptions, context: AdapterContext = {}) {
    return this.adapter.signUpEmail(options, context);
  }

  async isUsernameAvailable(options: IsUsernameAvailableOptions, context: AdapterContext = {}) {
    return this.adapter.isUsernameAvailable(options, context);
  }

  async updateUser(options: UpdateUserOptions, context: AdapterContext = {}) {
    return this.adapter.updateUser(options, context);
  }

  getAdapter(): UsernameAdapter {
    return this.adapter;
  }
}
