/**
 * @file libs/better-auth-utilities/src/index.ts
 * @description Public API for the better-auth-utilities library.
 */

export {
  // Config and instances
  createAuthServer,
  createClientConfig,
  createServerConfig,
  defineConfig,
  createBetterAuthClient,

  // NestJS Modules
  AdminModule,
  APIKeyModule,
  BearerModule,
  EmailOTPModule,
  GenericOAuthModule,
  JWTModule,
  OrganizationModule,
  TwoFactorModule,
  UsernameModule,

  // NestJS Services
  AdminService,
  APIKeyService,
  BearerService,
  EmailOTPService,
  GenericOAuthService,
  JWTService,
  OrganizationService,
  TwoFactorService,
  UsernameService,
} from './lib/better-auth-utilities';

export type {
  // Interfaces and Types
  AdapterContext,
  AdapterResponse,
  AuthProvider,
  AvailablePlugins,
  BetterAuthConfig,
  ClientConfig,
  DEFAULT_CLIENT_CONFIG,
  DEFAULT_SERVER_CONFIG,
  InferAuthClient,
  InferAuthServer,
  ServerConfig,

} from './lib/better-auth-utilities';
