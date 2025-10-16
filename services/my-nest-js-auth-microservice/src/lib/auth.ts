/**
 * @file services/my-nest-js-auth-microservice/src/lib/auth.ts
 * @description Better Auth configuration with comprehensive plugin support.
 * Uses the adapter pattern from better-auth-utilities for NestJS integration.
 */

import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '@my-projects-monorepo/prisma-client';

// Import Better Auth plugins
import {
  username,
  jwt,
  bearer,
  admin,
  organization,
  emailOTP,
  twoFactor,
  apiKey,
} from 'better-auth/plugins';

// Initialize Prisma Client
// Note: In production, this should be managed by the PrismaService
const prisma = new PrismaClient();

// Configure Better Auth with Prisma adapter and plugins
export const auth = betterAuth({
  // Database configuration with Prisma
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  // Email and password authentication
  emailAndPassword: {
    enabled: true,
  },

  // CORS configuration
  trustedOrigins: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:4200',
  ],

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days in seconds
    updateAge: 60 * 60 * 24, // 1 day in seconds
  },

  // Secret for signing tokens (loaded from environment)
  secret: process.env.BETTER_AUTH_SECRET || 'default-development-secret-change-in-production',

  // Plugin configuration
  plugins: [
    // Username authentication support (3-50 characters)
    username({
      minUsernameLength: 3,
      maxUsernameLength: 50,
    }),

    // JWT token support
    jwt(),

    // Bearer token support
    bearer(),

    // Admin role management
    admin(),

    // Organization/multi-tenancy support
    organization(),

    // Email OTP authentication (6-digit OTP, 5 minutes expiry)
    emailOTP({
      otpLength: 6,
      expiresIn: 300, // 5 minutes
      async sendVerificationOTP({ email, otp, type }) {
        // TODO: Implement email sending logic
        console.log(`Sending OTP ${otp} to ${email} (type: ${type})`);
        // In production, integrate with an email service like SendGrid, AWS SES, etc.
        // type can be: 'sign-in', 'email-verification', or 'password-reset'
      },
    }),

    // Two-factor authentication with TOTP
    twoFactor({
      issuer: 'My Auth Service',
      otpOptions: {
        async sendOTP({ user, otp }) {
          // TODO: Implement OTP delivery (email, SMS, etc.)
          console.log(`Sending 2FA OTP to user ${user.id}: ${otp}`);
          // In production, integrate with an email/SMS service
        },
      },
    }),

    // API key management
    apiKey(),
  ],
});
