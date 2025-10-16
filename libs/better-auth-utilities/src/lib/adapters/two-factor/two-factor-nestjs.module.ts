/**
 * @file libs/better-auth-utilities/src/lib/adapters/two-factor/two-factor-nestjs.module.ts
 * @description NestJS dynamic module for Two-Factor Authentication adapter integration.
 */

import { DynamicModule, Module, type Provider, type Type } from '@nestjs/common';
import type { AdapterConfig } from '../base/plugin-adapter.interface';
import { TwoFactorAdapter } from './two-factor.adapter';
import { TwoFactorService } from './two-factor-nestjs.service';

export interface TwoFactorModuleOptions {
  auth: AdapterConfig['auth'];
  debug?: boolean;
}

export interface TwoFactorModuleAsyncOptions {
  imports?: (Type<any> | DynamicModule | Promise<DynamicModule>)[];
  useFactory: (...args: any[]) => Promise<TwoFactorModuleOptions> | TwoFactorModuleOptions;
  inject?: any[];
}

@Module({})
export class TwoFactorModule {
  static forRoot(options: TwoFactorModuleOptions): DynamicModule {
    const adapterProvider: Provider = {
      provide: TwoFactorAdapter,
      useFactory: () => {
        return new TwoFactorAdapter({
          auth: options.auth,
          debug: options.debug,
        });
      },
    };

    const serviceProvider: Provider = {
      provide: TwoFactorService,
      useFactory: (adapter: TwoFactorAdapter) => {
        return new TwoFactorService(adapter);
      },
      inject: [TwoFactorAdapter],
    };

    return {
      module: TwoFactorModule,
      providers: [adapterProvider, serviceProvider],
      exports: [TwoFactorAdapter, TwoFactorService],
    };
  }

  static forRootAsync(options: TwoFactorModuleAsyncOptions): DynamicModule {
    const adapterProvider: Provider = {
      provide: TwoFactorAdapter,
      useFactory: async (...args: unknown[]) => {
        const config = await options.useFactory(...args);
        return new TwoFactorAdapter({
          auth: config.auth,
          debug: config.debug,
        });
      },
      inject: options.inject || [],
    };

    const serviceProvider: Provider = {
      provide: TwoFactorService,
      useFactory: (adapter: TwoFactorAdapter) => {
        return new TwoFactorService(adapter);
      },
      inject: [TwoFactorAdapter],
    };

    return {
      module: TwoFactorModule,
      imports: options.imports || [],
      providers: [adapterProvider, serviceProvider],
      exports: [TwoFactorAdapter, TwoFactorService],
    };
  }
}
