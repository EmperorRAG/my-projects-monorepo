/**
 * @file libs/better-auth-utilities/src/lib/adapters/username/username-nestjs.module.ts
 * @description NestJS dynamic module for Username plugin adapter
 */

import { DynamicModule, Module, Provider } from '@nestjs/common';
import type { betterAuth } from 'better-auth';
import { UsernameAdapter } from './username.adapter';
import { UsernameService } from './username-nestjs.service';

export interface UsernameModuleOptions {
  auth: ReturnType<typeof betterAuth>;
  debug?: boolean;
  isGlobal?: boolean;
}

export interface UsernameModuleAsyncOptions {
  useFactory: (...args: never[]) => Promise<UsernameModuleOptions> | UsernameModuleOptions;
  inject?: never[];
  isGlobal?: boolean;
}

@Module({})
export class UsernameModule {
  static forRoot(options: UsernameModuleOptions): DynamicModule {
    const adapterProvider: Provider = {
      provide: UsernameAdapter,
      useFactory: () => new UsernameAdapter({ auth: options.auth, debug: options.debug }),
    };

    const serviceProvider: Provider = {
      provide: UsernameService,
      useFactory: (adapter: UsernameAdapter) => new UsernameService(adapter),
      inject: [UsernameAdapter],
    };

    return {
      module: UsernameModule,
      global: options.isGlobal,
      providers: [adapterProvider, serviceProvider],
      exports: [UsernameAdapter, UsernameService],
    };
  }

  static forRootAsync(options: UsernameModuleAsyncOptions): DynamicModule {
    const adapterProvider: Provider = {
      provide: UsernameAdapter,
      useFactory: async (...args: never[]) => {
        const config = await options.useFactory(...args);
        return new UsernameAdapter({ auth: config.auth, debug: config.debug });
      },
      inject: options.inject || [],
    };

    const serviceProvider: Provider = {
      provide: UsernameService,
      useFactory: (adapter: UsernameAdapter) => new UsernameService(adapter),
      inject: [UsernameAdapter],
    };

    return {
      module: UsernameModule,
      global: options.isGlobal,
      providers: [adapterProvider, serviceProvider],
      exports: [UsernameAdapter, UsernameService],
    };
  }
}
