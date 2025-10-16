/**
 * @file libs/better-auth-utilities/src/lib/adapters/organization/organization-nestjs.module.ts
 * @description NestJS dynamic module for Organization plugin adapter
 */

import { DynamicModule, Module, Provider } from '@nestjs/common';
import type { betterAuth } from 'better-auth';
import { OrganizationAdapter } from './organization.adapter';
import { OrganizationService } from './organization-nestjs.service';

export interface OrganizationModuleOptions {
  auth: ReturnType<typeof betterAuth>;
  debug?: boolean;
  isGlobal?: boolean;
}

export interface OrganizationModuleAsyncOptions {
  useFactory: (...args: never[]) => Promise<OrganizationModuleOptions> | OrganizationModuleOptions;
  inject?: never[];
  isGlobal?: boolean;
}

@Module({})
export class OrganizationModule {
  static forRoot(options: OrganizationModuleOptions): DynamicModule {
    const adapterProvider: Provider = {
      provide: OrganizationAdapter,
      useFactory: () => new OrganizationAdapter({ auth: options.auth, debug: options.debug }),
    };

    const serviceProvider: Provider = {
      provide: OrganizationService,
      useFactory: (adapter: OrganizationAdapter) => new OrganizationService(adapter),
      inject: [OrganizationAdapter],
    };

    return {
      module: OrganizationModule,
      global: options.isGlobal,
      providers: [adapterProvider, serviceProvider],
      exports: [OrganizationAdapter, OrganizationService],
    };
  }

  static forRootAsync(options: OrganizationModuleAsyncOptions): DynamicModule {
    const adapterProvider: Provider = {
      provide: OrganizationAdapter,
      useFactory: async (...args: never[]) => {
        const config = await options.useFactory(...args);
        return new OrganizationAdapter({ auth: config.auth, debug: config.debug });
      },
      inject: options.inject || [],
    };

    const serviceProvider: Provider = {
      provide: OrganizationService,
      useFactory: (adapter: OrganizationAdapter) => new OrganizationService(adapter),
      inject: [OrganizationAdapter],
    };

    return {
      module: OrganizationModule,
      global: options.isGlobal,
      providers: [adapterProvider, serviceProvider],
      exports: [OrganizationAdapter, OrganizationService],
    };
  }
}
