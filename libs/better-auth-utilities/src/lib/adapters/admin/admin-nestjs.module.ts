/**
 * @file libs/better-auth-utilities/src/lib/adapters/admin/admin-nestjs.module.ts
 * @description NestJS module for Admin plugin integration.
 */

import { Module, DynamicModule } from '@nestjs/common';
import type { betterAuth } from 'better-auth';
import { AdminAdapter } from './admin.adapter';
import { AdminService } from './admin-nestjs.service';

export interface AdminModuleOptions {
  auth: ReturnType<typeof betterAuth>;
  debug?: boolean;
  isGlobal?: boolean;
}

export interface AdminModuleAsyncOptions {
  useFactory: (...args: unknown[]) => Promise<AdminModuleOptions> | AdminModuleOptions;
  inject?: unknown[];
  isGlobal?: boolean;
}

@Module({})
export class AdminModule {
  static forRoot(options: AdminModuleOptions): DynamicModule {
    const adapter = new AdminAdapter({
      auth: options.auth,
      debug: options.debug,
    });

    return {
      module: AdminModule,
      global: options.isGlobal ?? false,
      providers: [
        { provide: AdminAdapter, useValue: adapter },
        AdminService,
      ],
      exports: [AdminAdapter, AdminService],
    };
  }

  static forRootAsync(options: AdminModuleAsyncOptions): DynamicModule {
    return {
      module: AdminModule,
      global: options.isGlobal ?? false,
      providers: [
        {
          provide: 'ADMIN_MODULE_OPTIONS',
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        {
          provide: AdminAdapter,
          useFactory: (moduleOptions: AdminModuleOptions) => {
            return new AdminAdapter({
              auth: moduleOptions.auth,
              debug: moduleOptions.debug,
            });
          },
          inject: ['ADMIN_MODULE_OPTIONS'],
        },
        AdminService,
      ],
      exports: [AdminAdapter, AdminService],
    };
  }
}
