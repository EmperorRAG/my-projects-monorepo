/**
 * @file libs/better-auth-utilities/src/lib/adapters/bearer/bearer-nestjs.module.ts
 * @description NestJS dynamic module for Bearer plugin adapter
 */

import { DynamicModule, Module, Provider } from '@nestjs/common';
import type { betterAuth } from 'better-auth';
import { BearerAdapter } from './bearer.adapter';
import { BearerService } from './bearer-nestjs.service';

export interface BearerModuleOptions {
  auth: ReturnType<typeof betterAuth>;
  debug?: boolean;
  isGlobal?: boolean;
}

export interface BearerModuleAsyncOptions {
  useFactory: (...args: never[]) => Promise<BearerModuleOptions> | BearerModuleOptions;
  inject?: never[];
  isGlobal?: boolean;
}

@Module({})
export class BearerModule {
  static forRoot(options: BearerModuleOptions): DynamicModule {
    const adapterProvider: Provider = {
      provide: BearerAdapter,
      useFactory: () => new BearerAdapter({ auth: options.auth, debug: options.debug }),
    };

    const serviceProvider: Provider = {
      provide: BearerService,
      useFactory: (adapter: BearerAdapter) => new BearerService(adapter),
      inject: [BearerAdapter],
    };

    return {
      module: BearerModule,
      global: options.isGlobal,
      providers: [adapterProvider, serviceProvider],
      exports: [BearerAdapter, BearerService],
    };
  }

  static forRootAsync(options: BearerModuleAsyncOptions): DynamicModule {
    const adapterProvider: Provider = {
      provide: BearerAdapter,
      useFactory: async (...args: never[]) => {
        const config = await options.useFactory(...args);
        return new BearerAdapter({ auth: config.auth, debug: config.debug });
      },
      inject: options.inject || [],
    };

    const serviceProvider: Provider = {
      provide: BearerService,
      useFactory: (adapter: BearerAdapter) => new BearerService(adapter),
      inject: [BearerAdapter],
    };

    return {
      module: BearerModule,
      global: options.isGlobal,
      providers: [adapterProvider, serviceProvider],
      exports: [BearerAdapter, BearerService],
    };
  }
}
