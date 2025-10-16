/**
 * @file libs/better-auth-utilities/src/lib/adapters/jwt/jwt-nestjs.module.ts
 * @description NestJS dynamic module for JWT plugin adapter
 */

import { DynamicModule, Module, Provider } from '@nestjs/common';
import type { betterAuth } from 'better-auth';
import { JWTAdapter } from './jwt.adapter';
import { JWTService } from './jwt-nestjs.service';

export interface JWTModuleOptions {
  auth: ReturnType<typeof betterAuth>;
  debug?: boolean;
  isGlobal?: boolean;
}

export interface JWTModuleAsyncOptions {
  useFactory: (...args: never[]) => Promise<JWTModuleOptions> | JWTModuleOptions;
  inject?: never[];
  isGlobal?: boolean;
}

@Module({})
export class JWTModule {
  static forRoot(options: JWTModuleOptions): DynamicModule {
    const adapterProvider: Provider = {
      provide: JWTAdapter,
      useFactory: () => new JWTAdapter({ auth: options.auth, debug: options.debug }),
    };

    const serviceProvider: Provider = {
      provide: JWTService,
      useFactory: (adapter: JWTAdapter) => new JWTService(adapter),
      inject: [JWTAdapter],
    };

    return {
      module: JWTModule,
      global: options.isGlobal,
      providers: [adapterProvider, serviceProvider],
      exports: [JWTAdapter, JWTService],
    };
  }

  static forRootAsync(options: JWTModuleAsyncOptions): DynamicModule {
    const adapterProvider: Provider = {
      provide: JWTAdapter,
      useFactory: async (...args: never[]) => {
        const config = await options.useFactory(...args);
        return new JWTAdapter({ auth: config.auth, debug: config.debug });
      },
      inject: options.inject || [],
    };

    const serviceProvider: Provider = {
      provide: JWTService,
      useFactory: (adapter: JWTAdapter) => new JWTService(adapter),
      inject: [JWTAdapter],
    };

    return {
      module: JWTModule,
      global: options.isGlobal,
      providers: [adapterProvider, serviceProvider],
      exports: [JWTAdapter, JWTService],
    };
  }
}
