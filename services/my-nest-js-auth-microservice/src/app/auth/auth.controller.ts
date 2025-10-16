/**
 * @file services/my-nest-js-auth-microservice/src/app/auth/auth.controller.ts
 * @description Example controller showing how to use AuthService for custom auth endpoints.
 *
 * Note: Basic auth routes (sign-in, sign-up, etc.) are automatically handled by
 * @thallesp/nestjs-better-auth. This controller demonstrates custom endpoints that
 * use the AuthService to access Better Auth plugins.
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  AuthService,
  AuthGuard,
  Session,
  type UserSession,
  Public,
} from '@thallesp/nestjs-better-auth';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../../lib/auth';

// Platform-agnostic request interface for headers
interface RequestWithHeaders {
  headers: Record<string, string | string[] | undefined>;
}

/**
 * Example Auth Controller
 *
 * Demonstrates using AuthService to access Better Auth plugins and features.
 * The AuthService is typed with the specific auth configuration to enable
 * type-safe access to plugin methods.
 */
@Controller('api/custom-auth')
export class AuthController {
  constructor(private authService: AuthService<typeof auth>) {}

  /**
   * Public endpoint - no authentication required
   */
  @Get('health')
  @Public()
  async health() {
    return { status: 'ok', message: 'Auth service is running' };
  }

  /**
   * Get current user's profile
   * Protected by AuthGuard - requires authentication
   */
  @Get('me')
  @UseGuards(AuthGuard)
  async getProfile(@Session() session: UserSession) {
    return {
      user: session.user,
      session: session.session,
    };
  }

  /**
   * Get current user's accounts
   * Protected by AuthGuard - requires authentication
   */
  @Get('accounts')
  @UseGuards(AuthGuard)
  async getAccounts(@Req() req: RequestWithHeaders) {
    const accounts = await this.authService.api.listUserAccounts({
      headers: fromNodeHeaders(req.headers),
    });

    return { accounts };
  }

  /**
   * Create an API key for the current user
   * Protected by AuthGuard - requires authentication
   *
   * Example body:
   * {
   *   "name": "my-api-key",
   *   "expiresIn": 604800 // 7 days in seconds
   * }
   */
  @Post('api-keys')
  @UseGuards(AuthGuard)
  async createApiKey(
    @Req() req: RequestWithHeaders,
    @Body() body: { name: string; expiresIn?: number }
  ) {
    return this.authService.api.createApiKey({
      body,
      headers: fromNodeHeaders(req.headers),
    });
  }

  /**
   * List all API keys for the current user
   * Protected by AuthGuard - requires authentication
   */
  @Get('api-keys')
  @UseGuards(AuthGuard)
  async listApiKeys(@Req() req: RequestWithHeaders) {
    return this.authService.api.listApiKeys({
      headers: fromNodeHeaders(req.headers),
    });
  }
}
