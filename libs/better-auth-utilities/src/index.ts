/**
 * @file libs/better-auth-utilities/src/index.ts
 * @description Public API for the better-auth-utilities library.
 */

export {
  createAuthServer,
  createClientConfig,
  createServerConfig,
  defineConfig,
  createBetterAuthClient,

  AdminModule,
  APIKeyModule,
  BearerModule,
  EmailOTPModule,
  GenericOAuthModule,
  JWTModule,
  OrganizationModule,
  TwoFactorModule,
  UsernameModule,

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
