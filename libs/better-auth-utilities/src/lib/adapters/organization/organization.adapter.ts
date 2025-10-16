/**
 * @file libs/better-auth-utilities/src/lib/adapters/organization/organization.adapter.ts
 * @description Server API adapter for better-auth Organization plugin.
 * Provides type-safe methods for multi-tenant organization management.
 */

import type { betterAuth } from 'better-auth';
import {
  type PluginAdapter,
  type AdapterConfig,
  type AdapterContext,
  type AdapterResponse,
  AdapterOperationError,
  PluginNotAvailableError,
} from '../base/plugin-adapter.interface';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  role: string;
  createdAt: Date;
}

export interface OrganizationInvitation {
  id: string;
  organizationId: string;
  email: string;
  role: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  expiresAt: Date;
  inviterId: string;
  createdAt: Date;
}

export interface CreateOrganizationOptions {
  name: string;
  slug?: string;
  logo?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateOrganizationOptions {
  organizationId: string;
  data: {
    name?: string;
    slug?: string;
    logo?: string;
    metadata?: Record<string, unknown>;
  };
}

export interface ListOrganizationsOptions {
  userId?: string;
  limit?: number;
  offset?: number;
}

export interface AddMemberOptions {
  organizationId: string;
  userId: string;
  role: string;
}

export interface RemoveMemberOptions {
  organizationId: string;
  userId: string;
}

export interface UpdateMemberRoleOptions {
  organizationId: string;
  userId: string;
  role: string;
}

export interface ListMembersOptions {
  organizationId: string;
  limit?: number;
  offset?: number;
}

export interface CreateInvitationOptions {
  organizationId: string;
  email: string;
  role: string;
  expiresIn?: number;
}

export interface AcceptInvitationOptions {
  invitationId: string;
}

export interface RejectInvitationOptions {
  invitationId: string;
}

export interface CancelInvitationOptions {
  invitationId: string;
}

export interface ListInvitationsOptions {
  organizationId: string;
  status?: 'pending' | 'accepted' | 'rejected' | 'cancelled';
}

export interface OrganizationServerAPI {
  createOrganization(
    options: CreateOrganizationOptions & { headers?: Headers | Record<string, string> }
  ): Promise<{ data?: Organization; error?: unknown }>;

  updateOrganization(
    options: UpdateOrganizationOptions & { headers?: Headers | Record<string, string> }
  ): Promise<{ data?: Organization; error?: unknown }>;

  deleteOrganization(options: {
    organizationId: string;
    headers?: Headers | Record<string, string>;
  }): Promise<{ data?: { success: boolean }; error?: unknown }>;

  listOrganizations(
    options: ListOrganizationsOptions & { headers?: Headers | Record<string, string> }
  ): Promise<{ data?: Organization[]; error?: unknown }>;

  addMember(
    options: AddMemberOptions & { headers?: Headers | Record<string, string> }
  ): Promise<{ data?: OrganizationMember; error?: unknown }>;

  removeMember(
    options: RemoveMemberOptions & { headers?: Headers | Record<string, string> }
  ): Promise<{ data?: { success: boolean }; error?: unknown }>;

  updateMemberRole(
    options: UpdateMemberRoleOptions & { headers?: Headers | Record<string, string> }
  ): Promise<{ data?: OrganizationMember; error?: unknown }>;

  listMembers(
    options: ListMembersOptions & { headers?: Headers | Record<string, string> }
  ): Promise<{ data?: OrganizationMember[]; error?: unknown }>;

  createInvitation(
    options: CreateInvitationOptions & { headers?: Headers | Record<string, string> }
  ): Promise<{ data?: OrganizationInvitation; error?: unknown }>;

  acceptInvitation(
    options: AcceptInvitationOptions & { headers?: Headers | Record<string, string> }
  ): Promise<{ data?: { success: boolean }; error?: unknown }>;

  rejectInvitation(
    options: RejectInvitationOptions & { headers?: Headers | Record<string, string> }
  ): Promise<{ data?: { success: boolean }; error?: unknown }>;

  cancelInvitation(
    options: CancelInvitationOptions & { headers?: Headers | Record<string, string> }
  ): Promise<{ data?: { success: boolean }; error?: unknown }>;

  listInvitations(
    options: ListInvitationsOptions & { headers?: Headers | Record<string, string> }
  ): Promise<{ data?: OrganizationInvitation[]; error?: unknown }>;
}

// ============================================================================
// ORGANIZATION ADAPTER
// ============================================================================

export class OrganizationAdapter implements PluginAdapter<OrganizationServerAPI> {
  public readonly pluginId = 'organization';
  public readonly pluginName = 'Organization';
  public readonly api: OrganizationServerAPI;

  private readonly auth: ReturnType<typeof betterAuth>;
  private readonly debug: boolean;

  constructor(config: AdapterConfig) {
    this.auth = config.auth;
    this.debug = config.debug ?? false;

    if (!this.isAvailable()) {
      throw new PluginNotAvailableError(
        this.pluginName,
        'Organization plugin not enabled in better-auth configuration'
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const authApi = this.auth.api as any;

    this.api = {
      createOrganization: authApi.createOrganization?.bind(authApi),
      updateOrganization: authApi.updateOrganization?.bind(authApi),
      deleteOrganization: authApi.deleteOrganization?.bind(authApi),
      listOrganizations: authApi.listOrganizations?.bind(authApi),
      addMember: authApi.addMember?.bind(authApi),
      removeMember: authApi.removeMember?.bind(authApi),
      updateMemberRole: authApi.updateMemberRole?.bind(authApi),
      listMembers: authApi.listMembers?.bind(authApi),
      createInvitation: authApi.createInvitation?.bind(authApi),
      acceptInvitation: authApi.acceptInvitation?.bind(authApi),
      rejectInvitation: authApi.rejectInvitation?.bind(authApi),
      cancelInvitation: authApi.cancelInvitation?.bind(authApi),
      listInvitations: authApi.listInvitations?.bind(authApi),
    };

    this.log('Organization adapter initialized');
  }

  public isAvailable(): boolean {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const authApi = this.auth.api as any;
    return typeof authApi.createOrganization === 'function';
  }

  async createOrganization(
    options: CreateOrganizationOptions,
    context: AdapterContext
  ): Promise<AdapterResponse<Organization>> {
    try {
      this.log('Creating organization:', options.name);
      const result = await this.api.createOrganization({ ...options, headers: context.headers });
      if (result.error) {
        throw new AdapterOperationError('createOrganization', 'Failed to create organization', result.error);
      }
      return { success: true, data: result.data, message: 'Organization created successfully' };
    } catch (error) {
      this.log('Error creating organization:', error);
      return { success: false, error, message: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async updateOrganization(
    options: UpdateOrganizationOptions,
    context: AdapterContext
  ): Promise<AdapterResponse<Organization>> {
    try {
      this.log('Updating organization:', options.organizationId);
      const result = await this.api.updateOrganization({ ...options, headers: context.headers });
      if (result.error) {
        throw new AdapterOperationError('updateOrganization', 'Failed to update organization', result.error);
      }
      return { success: true, data: result.data, message: 'Organization updated successfully' };
    } catch (error) {
      this.log('Error updating organization:', error);
      return { success: false, error, message: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async deleteOrganization(
    organizationId: string,
    context: AdapterContext
  ): Promise<AdapterResponse<{ success: boolean }>> {
    try {
      this.log('Deleting organization:', organizationId);
      const result = await this.api.deleteOrganization({ organizationId, headers: context.headers });
      if (result.error) {
        throw new AdapterOperationError('deleteOrganization', 'Failed to delete organization', result.error);
      }
      return { success: true, data: result.data, message: 'Organization deleted successfully' };
    } catch (error) {
      this.log('Error deleting organization:', error);
      return { success: false, error, message: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async listOrganizations(
    options: ListOrganizationsOptions,
    context: AdapterContext
  ): Promise<AdapterResponse<Organization[]>> {
    try {
      this.log('Listing organizations');
      const result = await this.api.listOrganizations({ ...options, headers: context.headers });
      if (result.error) {
        throw new AdapterOperationError('listOrganizations', 'Failed to list organizations', result.error);
      }
      return { success: true, data: result.data || [], message: 'Organizations retrieved successfully' };
    } catch (error) {
      this.log('Error listing organizations:', error);
      return { success: false, error, message: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async addMember(
    options: AddMemberOptions,
    context: AdapterContext
  ): Promise<AdapterResponse<OrganizationMember>> {
    try {
      this.log('Adding member to organization:', options.organizationId);
      const result = await this.api.addMember({ ...options, headers: context.headers });
      if (result.error) {
        throw new AdapterOperationError('addMember', 'Failed to add member', result.error);
      }
      return { success: true, data: result.data, message: 'Member added successfully' };
    } catch (error) {
      this.log('Error adding member:', error);
      return { success: false, error, message: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async removeMember(
    options: RemoveMemberOptions,
    context: AdapterContext
  ): Promise<AdapterResponse<{ success: boolean }>> {
    try {
      this.log('Removing member from organization:', options.organizationId);
      const result = await this.api.removeMember({ ...options, headers: context.headers });
      if (result.error) {
        throw new AdapterOperationError('removeMember', 'Failed to remove member', result.error);
      }
      return { success: true, data: result.data, message: 'Member removed successfully' };
    } catch (error) {
      this.log('Error removing member:', error);
      return { success: false, error, message: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async updateMemberRole(
    options: UpdateMemberRoleOptions,
    context: AdapterContext
  ): Promise<AdapterResponse<OrganizationMember>> {
    try {
      this.log('Updating member role:', options.userId);
      const result = await this.api.updateMemberRole({ ...options, headers: context.headers });
      if (result.error) {
        throw new AdapterOperationError('updateMemberRole', 'Failed to update member role', result.error);
      }
      return { success: true, data: result.data, message: 'Member role updated successfully' };
    } catch (error) {
      this.log('Error updating member role:', error);
      return { success: false, error, message: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async listMembers(
    options: ListMembersOptions,
    context: AdapterContext
  ): Promise<AdapterResponse<OrganizationMember[]>> {
    try {
      this.log('Listing members for organization:', options.organizationId);
      const result = await this.api.listMembers({ ...options, headers: context.headers });
      if (result.error) {
        throw new AdapterOperationError('listMembers', 'Failed to list members', result.error);
      }
      return { success: true, data: result.data || [], message: 'Members retrieved successfully' };
    } catch (error) {
      this.log('Error listing members:', error);
      return { success: false, error, message: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async createInvitation(
    options: CreateInvitationOptions,
    context: AdapterContext
  ): Promise<AdapterResponse<OrganizationInvitation>> {
    try {
      this.log('Creating invitation for:', options.email);
      const result = await this.api.createInvitation({ ...options, headers: context.headers });
      if (result.error) {
        throw new AdapterOperationError('createInvitation', 'Failed to create invitation', result.error);
      }
      return { success: true, data: result.data, message: 'Invitation created successfully' };
    } catch (error) {
      this.log('Error creating invitation:', error);
      return { success: false, error, message: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async acceptInvitation(
    options: AcceptInvitationOptions,
    context: AdapterContext
  ): Promise<AdapterResponse<{ success: boolean }>> {
    try {
      this.log('Accepting invitation:', options.invitationId);
      const result = await this.api.acceptInvitation({ ...options, headers: context.headers });
      if (result.error) {
        throw new AdapterOperationError('acceptInvitation', 'Failed to accept invitation', result.error);
      }
      return { success: true, data: result.data, message: 'Invitation accepted successfully' };
    } catch (error) {
      this.log('Error accepting invitation:', error);
      return { success: false, error, message: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async rejectInvitation(
    options: RejectInvitationOptions,
    context: AdapterContext
  ): Promise<AdapterResponse<{ success: boolean }>> {
    try {
      this.log('Rejecting invitation:', options.invitationId);
      const result = await this.api.rejectInvitation({ ...options, headers: context.headers });
      if (result.error) {
        throw new AdapterOperationError('rejectInvitation', 'Failed to reject invitation', result.error);
      }
      return { success: true, data: result.data, message: 'Invitation rejected successfully' };
    } catch (error) {
      this.log('Error rejecting invitation:', error);
      return { success: false, error, message: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async cancelInvitation(
    options: CancelInvitationOptions,
    context: AdapterContext
  ): Promise<AdapterResponse<{ success: boolean }>> {
    try {
      this.log('Cancelling invitation:', options.invitationId);
      const result = await this.api.cancelInvitation({ ...options, headers: context.headers });
      if (result.error) {
        throw new AdapterOperationError('cancelInvitation', 'Failed to cancel invitation', result.error);
      }
      return { success: true, data: result.data, message: 'Invitation cancelled successfully' };
    } catch (error) {
      this.log('Error cancelling invitation:', error);
      return { success: false, error, message: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async listInvitations(
    options: ListInvitationsOptions,
    context: AdapterContext
  ): Promise<AdapterResponse<OrganizationInvitation[]>> {
    try {
      this.log('Listing invitations for organization:', options.organizationId);
      const result = await this.api.listInvitations({ ...options, headers: context.headers });
      if (result.error) {
        throw new AdapterOperationError('listInvitations', 'Failed to list invitations', result.error);
      }
      return { success: true, data: result.data || [], message: 'Invitations retrieved successfully' };
    } catch (error) {
      this.log('Error listing invitations:', error);
      return { success: false, error, message: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  private log(...args: unknown[]): void {
    if (this.debug) {
      console.log('[OrganizationAdapter]', ...args);
    }
  }
}

export function createOrganizationAdapter(config: AdapterConfig): OrganizationAdapter {
  return new OrganizationAdapter(config);
}
