/**
 * @file libs/better-auth-utilities/src/lib/adapters/email-otp/email-otp-nestjs.module.ts
 * @description NestJS dynamic module for Email OTP adapter integration.
 */

import { DynamicModule, Module, type Provider } from '@nestjs/common';
import type { AdapterConfig } from '../base/plugin-adapter.interface';
import { EmailOTPAdapter } from './email-otp.adapter';
import { EmailOTPService } from './email-otp-nestjs.service';

export interface EmailOTPModuleOptions {
  auth: AdapterConfig['auth'];
  debug?: boolean;
}

export interface EmailOTPModuleAsyncOptions {
  imports?: unknown[];
  useFactory: (...args: unknown[]) => Promise<EmailOTPModuleOptions> | EmailOTPModuleOptions;
  inject?: unknown[];
}

@Module({})
export class EmailOTPModule {
  static forRoot(options: EmailOTPModuleOptions): DynamicModule {
    const adapterProvider: Provider = {
      provide: EmailOTPAdapter,
      useFactory: () => {
        return new EmailOTPAdapter({
          auth: options.auth,
          debug: options.debug,
        });
      },
    };

    const serviceProvider: Provider = {
      provide: EmailOTPService,
      useFactory: (adapter: EmailOTPAdapter) => {
        return new EmailOTPService(adapter);
      },
      inject: [EmailOTPAdapter],
    };

    return {
      module: EmailOTPModule,
      providers: [adapterProvider, serviceProvider],
      exports: [EmailOTPAdapter, EmailOTPService],
    };
  }

  static forRootAsync(options: EmailOTPModuleAsyncOptions): DynamicModule {
    const adapterProvider: Provider = {
      provide: EmailOTPAdapter,
      useFactory: async (...args: unknown[]) => {
        const config = await options.useFactory(...args);
        return new EmailOTPAdapter({
          auth: config.auth,
          debug: config.debug,
        });
      },
      inject: options.inject || [],
    };

    const serviceProvider: Provider = {
      provide: EmailOTPService,
      useFactory: (adapter: EmailOTPAdapter) => {
        return new EmailOTPService(adapter);
      },
      inject: [EmailOTPAdapter],
    };

    return {
      module: EmailOTPModule,
      imports: options.imports || [],
      providers: [adapterProvider, serviceProvider],
      exports: [EmailOTPAdapter, EmailOTPService],
    };
  }
}
