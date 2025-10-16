/**
 * @file libs/better-auth-utilities/src/lib/adapters/api-key/api-key-nestjs.module.ts
 * @description NestJS module for API Key plugin integration.
 * Compatible with @thallesp/nestjs-better-auth patterns.
 */

import { Module, DynamicModule } from '@nestjs/common';
import type { betterAuth } from 'better-auth';
import { APIKeyAdapter } from './api-key.adapter';
import { APIKeyService } from './api-key-nestjs.service';

/**
 * Configuration options for API Key module.
 */
export interface APIKeyModuleOptions {
  /**
   * Better-auth instance.
   */
  auth: ReturnType<typeof betterAuth>;

  /**
   * Enable debug logging.
   */
  debug?: boolean;

  /**
   * Make module global (available everywhere without re-importing).
   */
  isGlobal?: boolean;
}

/**
 * Async configuration options for API Key module.
 */
export interface APIKeyModuleAsyncOptions {
  /**
   * Factory function to create configuration.
   */
  useFactory: (...args: unknown[]) => Promise<APIKeyModuleOptions> | APIKeyModuleOptions;

  /**
   * Dependencies to inject into factory.
   */
  inject?: unknown[];

  /**
   * Make module global.
   */
  isGlobal?: boolean;
}

/**
 * NestJS module for API Key plugin.
 * Provides APIKeyService for dependency injection.
 *
 * @example
 * ```typescript
 * import { Module } from '@nestjs/common';
 * import { APIKeyModule } from './adapters/api-key';
 * import { auth } from './auth';
 *
 * @Module({
 *   imports: [
 *     APIKeyModule.forRoot({
 *       auth,
 *       isGlobal: true,
 *     }),
 *   ],
 * })
 * export class AppModule {}
 * ```
 */
@Module({})
export class APIKeyModule {
  /**
   * Configure module with static options.
   */
  static forRoot(options: APIKeyModuleOptions): DynamicModule {
    const adapter = new APIKeyAdapter({
      auth: options.auth,
      debug: options.debug,
    });

    return {
      module: APIKeyModule,
      global: options.isGlobal ?? false,
      providers: [
        {
          provide: APIKeyAdapter,
          useValue: adapter,
        },
        APIKeyService,
      ],
      exports: [APIKeyAdapter, APIKeyService],
    };
  }

  /**
   * Configure module with async options (e.g., for ConfigService).
   */
  static forRootAsync(options: APIKeyModuleAsyncOptions): DynamicModule {
    return {
      module: APIKeyModule,
      global: options.isGlobal ?? false,
      providers: [
        {
          provide: 'API_KEY_MODULE_OPTIONS',
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        {
          provide: APIKeyAdapter,
          useFactory: (moduleOptions: APIKeyModuleOptions) => {
            return new APIKeyAdapter({
              auth: moduleOptions.auth,
              debug: moduleOptions.debug,
            });
          },
          inject: ['API_KEY_MODULE_OPTIONS'],
        },
        APIKeyService,
      ],
      exports: [APIKeyAdapter, APIKeyService],
    };
  }
}
