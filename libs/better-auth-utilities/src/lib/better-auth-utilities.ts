/**
 * @file libs/better-auth-utilities/src/lib/better-auth-utilities.ts
 * @description Main export file for better-auth-utilities library
 */

// Export configuration utilities
export * from './config';

// Export server instance creation
export * from './server';

// Export client instance creation
export * from './client';

// Export plugin utilities
export * from './plugins/api-key/api-key.utils';
export * from './plugins/bearer/bearer.utils';
export * from './plugins/jwt/jwt.utils';
export * from './plugins/two-factor/two-factor.utils';
export * from './plugins/admin/admin.utils';
export * from './plugins/organization/organization.utils';
export * from './plugins/username/username.utils';
export * from './plugins/magic-link/magic-link.utils';
export * from './plugins/multi-session/multi-session.utils';
export * from './plugins/anonymous/anonymous.utils';
export * from './plugins/phone-number/phone-number.utils';
export * from './plugins/email-otp/email-otp.utils';
