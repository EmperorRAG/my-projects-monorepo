/**
 * @file services/my-nest-js-auth-microservice/src/app/auth/auth.controller.ts
 * @description Example controller demonstrating better-auth-utilities adapter services.
 *
 * Note: Basic auth routes (sign-in, sign-up, etc.) are automatically handled by
 * @thallesp/nestjs-better-auth. This controller demonstrates custom endpoints using
 * the type-safe adapter services from better-auth-utilities.
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
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
import {
  APIKeyService,
  AdminService,
  OrganizationService,
  UsernameService,
  TwoFactorService,
  type AdapterContext,
} from '@emperorrag/better-auth-utilities';
import { auth } from '../../lib/auth';

// Platform-agnostic request interface for headers
interface RequestWithHeaders {
  headers: Record<string, string | string[] | undefined>;
}

/**
 * Auth Controller
 *
 * Demonstrates using better-auth-utilities adapter services for type-safe
 * access to Better Auth plugin functionality.
 *
 * Available Services:
 * - APIKeyService: API key management
 * - AdminService: Admin role operations
 * - OrganizationService: Team/organization management
 * - UsernameService: Username operations
 * - TwoFactorService: 2FA management
 */
@Controller('api/custom-auth')
export class AuthController {
  constructor(
    private authService: AuthService<typeof auth>,
    private apiKeyService: APIKeyService,
    private adminService: AdminService,
    private organizationService: OrganizationService,
    private usernameService: UsernameService,
    private twoFactorService: TwoFactorService
  ) {}

  /**
   * Public health check endpoint
   */
  @Get('health')
  @Public()
  async health() {
    return {
      status: 'ok',
      message: 'Auth service with better-auth-utilities is running',
      adapters: [
        'APIKey',
        'Admin',
        'Organization',
        'Username',
        'TwoFactor',
      ],
    };
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

  // ============================================================================
  // API KEY OPERATIONS
  // ============================================================================

  /**
   * Create an API key for the current user
   *
   * @example POST /api/custom-auth/api-keys
   * Body: { "name": "My API Key", "expiresIn": 604800 }
   */
  @Post('api-keys')
  @UseGuards(AuthGuard)
  async createApiKey(
    @Req() req: RequestWithHeaders,
    @Body() body: { name: string; expiresIn?: number; metadata?: Record<string, unknown> }
  ) {
    const context: AdapterContext = { headers: req.headers };
    return this.apiKeyService.createApiKey(body, context);
  }

  /**
   * List all API keys for the current user
   */
  @Get('api-keys')
  @UseGuards(AuthGuard)
  async listApiKeys(@Req() req: RequestWithHeaders) {
    const context: AdapterContext = { headers: req.headers };
    return this.apiKeyService.listApiKeys({}, context);
  }

  /**
   * Delete an API key
   */
  @Delete('api-keys/:id')
  @UseGuards(AuthGuard)
  async deleteApiKey(
    @Param('id') id: string,
    @Req() req: RequestWithHeaders
  ) {
    const context: AdapterContext = { headers: req.headers };
    return this.apiKeyService.deleteApiKey(id, context);
  }

  // ============================================================================
  // ORGANIZATION OPERATIONS
  // ============================================================================

  /**
   * List user's organizations
   */
  @Get('organizations')
  @UseGuards(AuthGuard)
  async listOrganizations(@Req() req: RequestWithHeaders) {
    const context: AdapterContext = { headers: req.headers };
    return this.organizationService.listOrganizations({}, context);
  }

  /**
   * Create a new organization
   *
   * @example POST /api/custom-auth/organizations
   * Body: { "name": "My Organization", "slug": "my-org" }
   */
  @Post('organizations')
  @UseGuards(AuthGuard)
  async createOrganization(
    @Req() req: RequestWithHeaders,
    @Body() body: { name: string; slug?: string; metadata?: Record<string, unknown> }
  ) {
    const context: AdapterContext = { headers: req.headers };
    return this.organizationService.createOrganization(body, context);
  }

  /**
   * Get organization details
   */
  @Get('organizations/:id')
  @UseGuards(AuthGuard)
  async getOrganization(
    @Param('id') id: string,
    @Req() req: RequestWithHeaders
  ) {
    const context: AdapterContext = { headers: req.headers };
    return this.organizationService.getOrganization(id, context);
  }

  // ============================================================================
  // TWO-FACTOR AUTHENTICATION OPERATIONS
  // ============================================================================

  /**
   * Enable two-factor authentication
   */
  @Post('2fa/enable')
  @UseGuards(AuthGuard)
  async enableTwoFactor(@Req() req: RequestWithHeaders) {
    const context: AdapterContext = { headers: req.headers };
    return this.twoFactorService.enableTwoFactor({}, context);
  }

  /**
   * Verify two-factor code
   *
   * @example POST /api/custom-auth/2fa/verify
   * Body: { "code": "123456" }
   */
  @Post('2fa/verify')
  @UseGuards(AuthGuard)
  async verifyTwoFactor(
    @Req() req: RequestWithHeaders,
    @Body() body: { code: string }
  ) {
    const context: AdapterContext = { headers: req.headers };
    return this.twoFactorService.verifyTwoFactor(body, context);
  }

  /**
   * Disable two-factor authentication
   */
  @Post('2fa/disable')
  @UseGuards(AuthGuard)
  async disableTwoFactor(@Req() req: RequestWithHeaders) {
    const context: AdapterContext = { headers: req.headers };
    return this.twoFactorService.disableTwoFactor({}, context);
  }

  // ============================================================================
  // ADMIN OPERATIONS
  // ============================================================================

  /**
   * List all users (admin only)
   */
  @Get('admin/users')
  @UseGuards(AuthGuard)
  async listUsers(@Req() req: RequestWithHeaders) {
    const context: AdapterContext = { headers: req.headers };
    return this.adminService.listUsers({}, context);
  }

  /**
   * Update user role (admin only)
   *
   * @example PUT /api/custom-auth/admin/users/:id/role
   * Body: { "role": "admin" }
   */
  @Put('admin/users/:id/role')
  @UseGuards(AuthGuard)
  async updateUserRole(
    @Param('id') id: string,
    @Req() req: RequestWithHeaders,
    @Body() body: { role: string }
  ) {
    const context: AdapterContext = { headers: req.headers };
    return this.adminService.updateUserRole({ userId: id, ...body }, context);
  }
}
