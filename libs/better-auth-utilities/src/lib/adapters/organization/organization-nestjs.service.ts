/**
 * @file libs/better-auth-utilities/src/lib/adapters/organization/organization-nestjs.service.ts
 * @description Injectable NestJS service wrapping OrganizationAdapter
 */

import { Injectable } from '@nestjs/common';
import type { AdapterContext } from '../base/plugin-adapter.interface';
import {
  OrganizationAdapter,
  type CreateOrganizationOptions,
  type UpdateOrganizationOptions,
  type ListOrganizationsOptions,
  type AddMemberOptions,
  type RemoveMemberOptions,
  type UpdateMemberRoleOptions,
  type ListMembersOptions,
  type CreateInvitationOptions,
  type AcceptInvitationOptions,
  type RejectInvitationOptions,
  type CancelInvitationOptions,
  type ListInvitationsOptions,
} from './organization.adapter';

/**
 * Injectable NestJS service for Organization plugin operations
 */
@Injectable()
export class OrganizationService {
  constructor(private readonly adapter: OrganizationAdapter) {}

  async createOrganization(options: CreateOrganizationOptions, context: AdapterContext = {}) {
    return this.adapter.createOrganization(options, context);
  }

  async updateOrganization(options: UpdateOrganizationOptions, context: AdapterContext = {}) {
    return this.adapter.updateOrganization(options, context);
  }

  async deleteOrganization(organizationId: string, context: AdapterContext = {}) {
    return this.adapter.deleteOrganization(organizationId, context);
  }

  async listOrganizations(options: ListOrganizationsOptions = {}, context: AdapterContext = {}) {
    return this.adapter.listOrganizations(options, context);
  }

  async addMember(options: AddMemberOptions, context: AdapterContext = {}) {
    return this.adapter.addMember(options, context);
  }

  async removeMember(options: RemoveMemberOptions, context: AdapterContext = {}) {
    return this.adapter.removeMember(options, context);
  }

  async updateMemberRole(options: UpdateMemberRoleOptions, context: AdapterContext = {}) {
    return this.adapter.updateMemberRole(options, context);
  }

  async listMembers(options: ListMembersOptions, context: AdapterContext = {}) {
    return this.adapter.listMembers(options, context);
  }

  async createInvitation(options: CreateInvitationOptions, context: AdapterContext = {}) {
    return this.adapter.createInvitation(options, context);
  }

  async acceptInvitation(options: AcceptInvitationOptions, context: AdapterContext = {}) {
    return this.adapter.acceptInvitation(options, context);
  }

  async rejectInvitation(options: RejectInvitationOptions, context: AdapterContext = {}) {
    return this.adapter.rejectInvitation(options, context);
  }

  async cancelInvitation(options: CancelInvitationOptions, context: AdapterContext = {}) {
    return this.adapter.cancelInvitation(options, context);
  }

  async listInvitations(options: ListInvitationsOptions, context: AdapterContext = {}) {
    return this.adapter.listInvitations(options, context);
  }

  getAdapter(): OrganizationAdapter {
    return this.adapter;
  }
}
