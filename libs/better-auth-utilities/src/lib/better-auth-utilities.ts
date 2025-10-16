/**
 * @file libs/better-auth-utilities/src/lib/better-auth-utilities.ts
 * @description Main export file for better-auth-utilities library
 */

// Export configuration utilities
export { defineConfig, createClientConfig, createServerConfig} from './config';
export type { AuthProvider, AvailablePlugins, BetterAuthConfig, ClientConfig, DEFAULT_CLIENT_CONFIG, DEFAULT_SERVER_CONFIG, OAuthProviderId, PluginConfigRegistry, ServerConfig } from './config';

// Export server instance creation
export { createAuthServer} from './server';
export type { InferAuthServer, InferSession} from './server';

// Export client instance creation
export { createBetterAuthClient} from './client';
export type { InferAuthClient } from './client';

// Export NestJS adapter modules and services
// (Adapters are not exported to avoid naming conflicts)
export { AdminModule } from './adapters/admin/admin-nestjs.module';
export { AdminService } from './adapters/admin/admin-nestjs.service';

export { APIKeyModule } from './adapters/api-key/api-key-nestjs.module';
export { APIKeyService } from './adapters/api-key/api-key-nestjs.service';

export { BearerModule } from './adapters/bearer/bearer-nestjs.module';
export { BearerService } from './adapters/bearer/bearer-nestjs.service';

export { EmailOTPModule } from './adapters/email-otp/email-otp-nestjs.module';
export { EmailOTPService } from './adapters/email-otp/email-otp-nestjs.service';

export { GenericOAuthModule } from './adapters/generic-oauth/generic-oauth-nestjs.module';
export { GenericOAuthService } from './adapters/generic-oauth/generic-oauth-nestjs.service';

export { JWTModule } from './adapters/jwt/jwt-nestjs.module';
export { JWTService } from './adapters/jwt/jwt-nestjs.service';

export { OrganizationModule } from './adapters/organization/organization-nestjs.module';
export { OrganizationService } from './adapters/organization/organization-nestjs.service';

export { TwoFactorModule } from './adapters/two-factor/two-factor-nestjs.module';
export { TwoFactorService } from './adapters/two-factor/two-factor-nestjs.service';

export { UsernameModule } from './adapters/username/username-nestjs.module';
export { UsernameService } from './adapters/username/username-nestjs.service';

// Export base adapter interface for typing
export type { AdapterContext, AdapterResponse } from './adapters/base/plugin-adapter.interface';
