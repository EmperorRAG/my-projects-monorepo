/**
 * @file libs/better-auth-utilities/src/lib/adapters/generic-oauth/generic-oauth-nestjs.module.ts
 * @description NestJS dynamic module for Generic OAuth adapter integration.
 */

import { DynamicModule, Module, type Provider } from '@nestjs/common';
import type { AdapterConfig } from '../base/plugin-adapter.interface';
import { GenericOAuthAdapter } from './generic-oauth.adapter';
import { GenericOAuthService } from './generic-oauth-nestjs.service';

export interface GenericOAuthModuleOptions {
  auth: AdapterConfig['auth'];
  debug?: boolean;
}

export interface GenericOAuthModuleAsyncOptions {
  imports?: unknown[];
  useFactory: (...args: unknown[]) => Promise<GenericOAuthModuleOptions> | GenericOAuthModuleOptions;
  inject?: unknown[];
}

@Module({})
export class GenericOAuthModule {
  static forRoot(options: GenericOAuthModuleOptions): DynamicModule {
    const adapterProvider: Provider = {
      provide: GenericOAuthAdapter,
      useFactory: () => {
        return new GenericOAuthAdapter({
          auth: options.auth,
          debug: options.debug,
        });
      },
    };

    const serviceProvider: Provider = {
      provide: GenericOAuthService,
      useFactory: (adapter: GenericOAuthAdapter) => {
        return new GenericOAuthService(adapter);
      },
      inject: [GenericOAuthAdapter],
    };

    return {
      module: GenericOAuthModule,
      providers: [adapterProvider, serviceProvider],
      exports: [GenericOAuthAdapter, GenericOAuthService],
    };
  }

  static forRootAsync(options: GenericOAuthModuleAsyncOptions): DynamicModule {
    const adapterProvider: Provider = {
      provide: GenericOAuthAdapter,
      useFactory: async (...args: unknown[]) => {
        const config = await options.useFactory(...args);
        return new GenericOAuthAdapter({
          auth: config.auth,
          debug: config.debug,
        });
      },
      inject: options.inject || [],
    };

    const serviceProvider: Provider = {
      provide: GenericOAuthService,
      useFactory: (adapter: GenericOAuthAdapter) => {
        return new GenericOAuthService(adapter);
      },
      inject: [GenericOAuthAdapter],
    };

    return {
      module: GenericOAuthModule,
      imports: options.imports || [],
      providers: [adapterProvider, serviceProvider],
      exports: [GenericOAuthAdapter, GenericOAuthService],
    };
  }
}
