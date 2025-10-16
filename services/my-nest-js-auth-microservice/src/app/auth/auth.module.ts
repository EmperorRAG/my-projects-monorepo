/**
 * @file services/my-nest-js-auth-microservice/src/app/auth/auth.module.ts
 * @description Auth module using @thallesp/nestjs-better-auth integration
 * with better-auth-utilities adapter modules for type-safe plugin access.
 */

import { Module } from '@nestjs/common';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';
import {
  AdminModule,
  APIKeyModule,
  BearerModule,
  EmailOTPModule,
  JWTModule,
  OrganizationModule,
  TwoFactorModule,
  UsernameModule,
} from '@emperorrag/better-auth-utilities';
import { auth } from '../../lib/auth';
import { AuthController } from './auth.controller';

/**
 * Auth Module
 *
 * Combines @thallesp/nestjs-better-auth for core authentication
 * with better-auth-utilities adapter modules for type-safe plugin operations.
 *
 * The adapter modules provide:
 * - AdminModule: Role-based access control operations
 * - APIKeyModule: API key creation, verification, and management
 * - BearerModule: Bearer token authentication
 * - EmailOTPModule: One-time password via email
 * - JWTModule: JWT token operations
 * - OrganizationModule: Multi-tenancy and team management
 * - TwoFactorModule: Two-factor authentication (TOTP)
 * - UsernameModule: Custom username authentication
 *
 * Each module provides an injectable service for dependency injection:
 * - AdminService, APIKeyService, BearerService, etc.
 */
@Module({
  imports: [
    // Core Better Auth integration
    BetterAuthModule.forRoot({auth}),

    // Better-auth-utilities adapter modules
    AdminModule.forRoot({ auth, isGlobal: false }),
    APIKeyModule.forRoot({ auth, isGlobal: false }),
    BearerModule.forRoot({ auth, isGlobal: false }),
    EmailOTPModule.forRoot({ auth, isGlobal: false }),
    JWTModule.forRoot({ auth, isGlobal: false }),
    OrganizationModule.forRoot({ auth, isGlobal: false }),
    TwoFactorModule.forRoot({ auth, isGlobal: false }),
    UsernameModule.forRoot({ auth, isGlobal: false }),
  ],
  controllers: [AuthController],
  providers: [],
  exports: [
    BetterAuthModule,
    AdminModule,
    APIKeyModule,
    BearerModule,
    EmailOTPModule,
    JWTModule,
    OrganizationModule,
    TwoFactorModule,
    UsernameModule,
  ],
})
export class AuthModule {}