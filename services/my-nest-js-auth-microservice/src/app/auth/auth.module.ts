/**
 * @file services/my-nest-js-auth-microservice/src/app/auth/auth.module.ts
 * @description Auth module using @thallesp/nestjs-better-auth integration.
 * Provides AuthService for type-safe access to Better Auth plugins.
 */

import { Module } from '@nestjs/common';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from '../../lib/auth';
import { AuthController } from './auth.controller';

/**
 * Auth Module
 *
 * Uses AuthModule.forRoot() from @thallesp/nestjs-better-auth to integrate
 * the Better Auth configuration with NestJS dependency injection.
 *
 * The AuthService provided by this module gives type-safe access to:
 * - User authentication (email/password, username)
 * - JWT and bearer token management
 * - Admin role management
 * - Organization/multi-tenancy
 * - Email OTP authentication
 * - Two-factor authentication
 * - API key management
 */
@Module({
  imports: [BetterAuthModule.forRoot(auth)],
  controllers: [AuthController],
  providers: [],
  exports: [BetterAuthModule],
})
export class AuthModule {}
