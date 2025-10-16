/**
 * @module organization.utils
 * @description Provides utilities for interacting with the `better-auth` Organization plugin.
 * These functions are designed using the Effect-TS functional programming paradigm and provide server API
 * functionality for creating, managing, and querying organizations, as well as member management.
 */

import { Effect } from 'effect';

// ============================================================================
// Custom Error Classes
// ============================================================================

/**
 * Error thrown when organization creation fails.
 */
export class OrganizationCreationError extends Error {
  readonly _tag = 'OrganizationCreationError';

  constructor(
    message: string,
    public override readonly cause?: unknown
  ) {
    super(message);
    this.name = 'OrganizationCreationError';
  }
}

/**
 * Error thrown when organization update fails.
 */
export class OrganizationUpdateError extends Error {
  readonly _tag = 'OrganizationUpdateError';

  constructor(
    message: string,
    public override readonly cause?: unknown
  ) {
    super(message);
    this.name = 'OrganizationUpdateError';
  }
}

/**
 * Error thrown when organization deletion fails.
 */
export class OrganizationDeletionError extends Error {
  readonly _tag = 'OrganizationDeletionError';

  constructor(
    message: string,
    public override readonly cause?: unknown
  ) {
    super(message);
    this.name = 'OrganizationDeletionError';
  }
}

/**
 * Error thrown when member invitation fails.
 */
export class MemberInvitationError extends Error {
  readonly _tag = 'MemberInvitationError';

  constructor(
    message: string,
    public override readonly cause?: unknown
  ) {
    super(message);
    this.name = 'MemberInvitationError';
  }
}

/**
 * Error thrown when member removal fails.
 */
export class MemberRemovalError extends Error {
  readonly _tag = 'MemberRemovalError';

  constructor(
    message: string,
    public override readonly cause?: unknown
  ) {
    super(message);
    this.name = 'MemberRemovalError';
  }
}

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Organization member role types.
 */
export type MemberRole = 'owner' | 'admin' | 'member';

/**
 * Options for creating an organization.
 */
export interface CreateOrganizationOptions {
  readonly name: string;
  readonly slug?: string;
  readonly description?: string;
  readonly logo?: string;
  readonly metadata?: Record<string, unknown>;
}

/**
 * Options for updating an organization.
 */
export interface UpdateOrganizationOptions {
  readonly organizationId: string;
  readonly name?: string;
  readonly slug?: string;
  readonly description?: string;
  readonly logo?: string;
  readonly metadata?: Record<string, unknown>;
}

/**
 * Options for inviting a member to an organization.
 */
export interface InviteMemberOptions {
  readonly organizationId: string;
  readonly email: string;
  readonly role: MemberRole;
}

/**
 * Options for removing a member from an organization.
 */
export interface RemoveMemberOptions {
  readonly organizationId: string;
  readonly userId: string;
}

/**
 * Options for updating a member's role.
 */
export interface UpdateMemberRoleOptions {
  readonly organizationId: string;
  readonly userId: string;
  readonly role: MemberRole;
}

/**
 * Configuration for organization operations.
 */
export interface OrganizationConfig {
  readonly baseUrl: string;
  readonly createEndpoint?: string;
  readonly updateEndpoint?: string;
  readonly deleteEndpoint?: string;
  readonly inviteMemberEndpoint?: string;
  readonly removeMemberEndpoint?: string;
  readonly updateMemberRoleEndpoint?: string;
  readonly listOrganizationsEndpoint?: string;
  readonly getOrganizationEndpoint?: string;
}

/**
 * Organization object.
 */
export interface Organization {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly description?: string;
  readonly logo?: string;
  readonly createdAt: string;
  readonly metadata?: Record<string, unknown>;
}

/**
 * Organization member object.
 */
export interface OrganizationMember {
  readonly id: string;
  readonly userId: string;
  readonly organizationId: string;
  readonly role: MemberRole;
  readonly joinedAt: string;
  readonly user?: {
    readonly id: string;
    readonly email: string;
    readonly name: string;
  };
}

/**
 * Invitation object.
 */
export interface MemberInvitation {
  readonly id: string;
  readonly organizationId: string;
  readonly email: string;
  readonly role: MemberRole;
  readonly status: 'pending' | 'accepted' | 'rejected';
  readonly expiresAt: string;
}

// ============================================================================
// Supporting Utilities
// ============================================================================

/**
 * Builds the URL for the organization creation endpoint.
 *
 * @pure
 * @description Constructs the full URL for the better-auth organization creation endpoint.
 *
 * @fp-pattern Pure function
 * @composition N/A - Single operation
 *
 * @param config - Configuration containing the base URL and optional create endpoint.
 * @returns {string} The complete URL for the creation endpoint.
 *
 * @example
 * const url = buildCreateOrganizationUrl({ baseUrl: 'http://localhost:3000' });
 * // => 'http://localhost:3000/api/auth/organization/create'
 */
export const buildCreateOrganizationUrl = (config: OrganizationConfig): string => {
  const endpoint = config.createEndpoint || '/api/auth/organization/create';
  return `${config.baseUrl}${endpoint}`;
};

/**
 * Builds the URL for the organization update endpoint.
 *
 * @pure
 * @description Constructs the full URL for the better-auth organization update endpoint.
 *
 * @fp-pattern Pure function
 * @composition N/A - Single operation
 *
 * @param config - Configuration containing the base URL and optional update endpoint.
 * @returns {string} The complete URL for the update endpoint.
 *
 * @example
 * const url = buildUpdateOrganizationUrl({ baseUrl: 'http://localhost:3000' });
 * // => 'http://localhost:3000/api/auth/organization/update'
 */
export const buildUpdateOrganizationUrl = (config: OrganizationConfig): string => {
  const endpoint = config.updateEndpoint || '/api/auth/organization/update';
  return `${config.baseUrl}${endpoint}`;
};

/**
 * Builds the URL for the organization deletion endpoint.
 *
 * @pure
 * @description Constructs the full URL for the better-auth organization deletion endpoint.
 *
 * @fp-pattern Pure function
 * @composition N/A - Single operation
 *
 * @param config - Configuration containing the base URL and optional delete endpoint.
 * @returns {string} The complete URL for the deletion endpoint.
 *
 * @example
 * const url = buildDeleteOrganizationUrl({ baseUrl: 'http://localhost:3000' });
 * // => 'http://localhost:3000/api/auth/organization/delete'
 */
export const buildDeleteOrganizationUrl = (config: OrganizationConfig): string => {
  const endpoint = config.deleteEndpoint || '/api/auth/organization/delete';
  return `${config.baseUrl}${endpoint}`;
};

/**
 * Builds the URL for the member invitation endpoint.
 *
 * @pure
 * @description Constructs the full URL for the better-auth member invitation endpoint.
 *
 * @fp-pattern Pure function
 * @composition N/A - Single operation
 *
 * @param config - Configuration containing the base URL and optional invite endpoint.
 * @returns {string} The complete URL for the invitation endpoint.
 *
 * @example
 * const url = buildInviteMemberUrl({ baseUrl: 'http://localhost:3000' });
 * // => 'http://localhost:3000/api/auth/organization/invite-member'
 */
export const buildInviteMemberUrl = (config: OrganizationConfig): string => {
  const endpoint = config.inviteMemberEndpoint || '/api/auth/organization/invite-member';
  return `${config.baseUrl}${endpoint}`;
};

/**
 * Validates organization creation options.
 *
 * @pure
 * @description Ensures required fields are present and valid.
 *
 * @fp-pattern Pure function returning Effect for validation
 * @composition N/A - Single operation
 *
 * @param options - The organization creation options to validate.
 * @returns {Effect.Effect<CreateOrganizationOptions, OrganizationCreationError>} Effect containing validated options or error.
 *
 * @example
 * const options = { name: 'Acme Corp' };
 * const validatedEffect = validateCreateOrganizationOptions(options);
 * // Effect.runSync(validatedEffect) => { name: 'Acme Corp' }
 */
export const validateCreateOrganizationOptions = (
  options: CreateOrganizationOptions
): Effect.Effect<CreateOrganizationOptions, OrganizationCreationError> =>
  Effect.try({
    try: () => {
      if (!options.name || options.name.trim().length === 0) {
        throw new OrganizationCreationError('Organization name is required and cannot be empty');
      }
      return options;
    },
    catch: (error) =>
      error instanceof OrganizationCreationError
        ? error
        : new OrganizationCreationError('Failed to validate organization creation options', error),
  });

/**
 * Validates member role.
 *
 * @pure
 * @description Ensures the role is a valid member role type.
 *
 * @fp-pattern Pure function returning Effect for validation
 * @composition N/A - Single operation
 *
 * @param role - The role to validate.
 * @returns {Effect.Effect<MemberRole, MemberInvitationError>} Effect containing validated role or error.
 *
 * @example
 * const validatedEffect = validateMemberRole('admin');
 * // Effect.runSync(validatedEffect) => 'admin'
 */
export const validateMemberRole = (
  role: string
): Effect.Effect<MemberRole, MemberInvitationError> =>
  Effect.try({
    try: () => {
      const validRoles: MemberRole[] = ['owner', 'admin', 'member'];
      if (!validRoles.includes(role as MemberRole)) {
        throw new MemberInvitationError(
          `Invalid role: ${role}. Must be one of: ${validRoles.join(', ')}`
        );
      }
      return role as MemberRole;
    },
    catch: (error) =>
      error instanceof MemberInvitationError
        ? error
        : new MemberInvitationError('Failed to validate member role', error),
  });

// ============================================================================
// Main Utilities
// ============================================================================

/**
 * Creates a new organization.
 *
 * @description This function uses the better-auth organization plugin to create a new organization.
 * It makes a POST request to the `/api/auth/organization/create` endpoint with the organization details.
 * The creator automatically becomes the organization owner.
 *
 * Note: This is a server-only operation that requires an active user session.
 *
 * @param options - The options including organization name, slug, and other details.
 * @param config - Configuration for the API endpoint, including base URL.
 * @returns {Effect.Effect<Organization, OrganizationCreationError>} An Effect that resolves with
 * the created organization or fails with an error.
 *
 * @example
 * const options = { name: 'Acme Corporation', slug: 'acme' };
 * const config = { baseUrl: 'http://localhost:3000' };
 * const createEffect = createOrganization(options, config);
 * const org = await Effect.runPromise(createEffect);
 * // => { id: 'org-123', name: 'Acme Corporation', slug: 'acme', ... }
 *
 * @example
 * // Creating with metadata
 * const program = Effect.gen(function* () {
 *   const org = yield* createOrganization(
 *     {
 *       name: 'Tech Startup',
 *       slug: 'tech-startup',
 *       description: 'A cutting-edge tech company',
 *       metadata: { industry: 'technology', size: 'small' }
 *     },
 *     config
 *   );
 *   console.log('Created organization:', org.name);
 *   return org;
 * });
 */
export const createOrganization = (
  options: CreateOrganizationOptions,
  config: OrganizationConfig
): Effect.Effect<Organization, OrganizationCreationError> =>
  Effect.gen(function* () {
    // Validate options
    const validatedOptions = yield* validateCreateOrganizationOptions(options);

    // Build the endpoint URL
    const url = buildCreateOrganizationUrl(config);

    // Prepare request body
    const requestBody: Record<string, unknown> = {
      name: validatedOptions.name,
    };

    if (validatedOptions.slug) {
      requestBody.slug = validatedOptions.slug;
    }
    if (validatedOptions.description) {
      requestBody.description = validatedOptions.description;
    }
    if (validatedOptions.logo) {
      requestBody.logo = validatedOptions.logo;
    }
    if (validatedOptions.metadata) {
      requestBody.metadata = validatedOptions.metadata;
    }

    // Make the POST request
    const response = yield* Effect.tryPromise({
      try: () =>
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(requestBody),
        }),
      catch: (error) =>
        new OrganizationCreationError(`Failed to send creation request to ${url}`, error),
    });

    // Check response status
    if (!response.ok) {
      const errorText = yield* Effect.tryPromise({
        try: () => response.text(),
        catch: () => new OrganizationCreationError('Failed to read error response'),
      });
      return yield* Effect.fail(
        new OrganizationCreationError(
          `Create organization failed with status ${response.status}: ${errorText}`
        )
      );
    }

    // Parse the response
    const result = yield* Effect.tryPromise({
      try: () => response.json() as Promise<Organization>,
      catch: (error) =>
        new OrganizationCreationError('Failed to parse creation response', error),
    });

    return result;
  });

/**
 * Updates an existing organization.
 *
 * @description This function uses the better-auth organization plugin to update organization details.
 * It makes a POST request to the `/api/auth/organization/update` endpoint with the organization ID
 * and updated fields. Only organization owners and admins can update the organization.
 *
 * @param options - The options including organization ID and fields to update.
 * @param config - Configuration for the API endpoint, including base URL.
 * @returns {Effect.Effect<Organization, OrganizationUpdateError>} An Effect that resolves with
 * the updated organization or fails with an error.
 *
 * @example
 * const options = { organizationId: 'org-123', name: 'Acme Corp Ltd' };
 * const config = { baseUrl: 'http://localhost:3000' };
 * const updateEffect = updateOrganization(options, config);
 * const org = await Effect.runPromise(updateEffect);
 * // => { id: 'org-123', name: 'Acme Corp Ltd', ... }
 *
 * @example
 * // Updating multiple fields
 * const program = Effect.gen(function* () {
 *   const org = yield* updateOrganization(
 *     {
 *       organizationId: 'org-456',
 *       name: 'Updated Name',
 *       description: 'New description',
 *       logo: 'https://example.com/new-logo.png'
 *     },
 *     config
 *   );
 *   return org;
 * });
 */
export const updateOrganization = (
  options: UpdateOrganizationOptions,
  config: OrganizationConfig
): Effect.Effect<Organization, OrganizationUpdateError> =>
  Effect.gen(function* () {
    // Validate organization ID
    if (!options.organizationId || options.organizationId.trim().length === 0) {
      return yield* Effect.fail(
        new OrganizationUpdateError('Organization ID is required')
      );
    }

    // Build the endpoint URL
    const url = buildUpdateOrganizationUrl(config);

    // Prepare request body
    const requestBody: Record<string, unknown> = {
      organizationId: options.organizationId,
    };

    if (options.name !== undefined) {
      requestBody.name = options.name;
    }
    if (options.slug !== undefined) {
      requestBody.slug = options.slug;
    }
    if (options.description !== undefined) {
      requestBody.description = options.description;
    }
    if (options.logo !== undefined) {
      requestBody.logo = options.logo;
    }
    if (options.metadata !== undefined) {
      requestBody.metadata = options.metadata;
    }

    // Make the POST request
    const response = yield* Effect.tryPromise({
      try: () =>
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(requestBody),
        }),
      catch: (error) =>
        new OrganizationUpdateError(`Failed to send update request to ${url}`, error),
    });

    // Check response status
    if (!response.ok) {
      const errorText = yield* Effect.tryPromise({
        try: () => response.text(),
        catch: () => new OrganizationUpdateError('Failed to read error response'),
      });
      return yield* Effect.fail(
        new OrganizationUpdateError(
          `Update organization failed with status ${response.status}: ${errorText}`
        )
      );
    }

    // Parse the response
    const result = yield* Effect.tryPromise({
      try: () => response.json() as Promise<Organization>,
      catch: (error) =>
        new OrganizationUpdateError('Failed to parse update response', error),
    });

    return result;
  });

/**
 * Deletes an organization.
 *
 * @description This function uses the better-auth organization plugin to delete an organization.
 * It makes a POST request to the `/api/auth/organization/delete` endpoint with the organization ID.
 * Only organization owners can delete the organization.
 *
 * @param organizationId - The ID of the organization to delete.
 * @param config - Configuration for the API endpoint, including base URL.
 * @returns {Effect.Effect<void, OrganizationDeletionError>} An Effect that succeeds if deleted or fails with an error.
 *
 * @example
 * const config = { baseUrl: 'http://localhost:3000' };
 * const deleteEffect = deleteOrganization('org-123', config);
 * await Effect.runPromise(deleteEffect);
 * // Organization deleted successfully
 *
 * @example
 * // Using in a workflow
 * const program = Effect.gen(function* () {
 *   yield* deleteOrganization('org-456', config);
 *   console.log('Organization deleted');
 * });
 */
export const deleteOrganization = (
  organizationId: string,
  config: OrganizationConfig
): Effect.Effect<void, OrganizationDeletionError> =>
  Effect.gen(function* () {
    // Validate organization ID
    if (!organizationId || organizationId.trim().length === 0) {
      return yield* Effect.fail(
        new OrganizationDeletionError('Organization ID is required')
      );
    }

    // Build the endpoint URL
    const url = buildDeleteOrganizationUrl(config);

    // Make the POST request
    const response = yield* Effect.tryPromise({
      try: () =>
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ organizationId }),
        }),
      catch: (error) =>
        new OrganizationDeletionError(`Failed to send deletion request to ${url}`, error),
    });

    // Check response status
    if (!response.ok) {
      const errorText = yield* Effect.tryPromise({
        try: () => response.text(),
        catch: () => new OrganizationDeletionError('Failed to read error response'),
      });
      return yield* Effect.fail(
        new OrganizationDeletionError(
          `Delete organization failed with status ${response.status}: ${errorText}`
        )
      );
    }

    return;
  });

/**
 * Invites a member to an organization.
 *
 * @description This function uses the better-auth organization plugin to invite a member.
 * It makes a POST request to the `/api/auth/organization/invite-member` endpoint with the
 * organization ID, email, and role. An invitation email is sent to the invitee.
 *
 * Note: Only organization owners and admins can invite members.
 *
 * @param options - The options including organization ID, email, and role.
 * @param config - Configuration for the API endpoint, including base URL.
 * @returns {Effect.Effect<MemberInvitation, MemberInvitationError>} An Effect that resolves with
 * the invitation details or fails with an error.
 *
 * @example
 * const options = { organizationId: 'org-123', email: 'user@example.com', role: 'member' };
 * const config = { baseUrl: 'http://localhost:3000' };
 * const inviteEffect = inviteMember(options, config);
 * const invitation = await Effect.runPromise(inviteEffect);
 * // => { id: 'inv-789', organizationId: 'org-123', email: '...', role: 'member', ... }
 *
 * @example
 * // Inviting an admin
 * const program = Effect.gen(function* () {
 *   const invitation = yield* inviteMember(
 *     { organizationId: 'org-456', email: 'admin@example.com', role: 'admin' },
 *     config
 *   );
 *   console.log('Invitation sent to:', invitation.email);
 *   return invitation;
 * });
 */
export const inviteMember = (
  options: InviteMemberOptions,
  config: OrganizationConfig
): Effect.Effect<MemberInvitation, MemberInvitationError> =>
  Effect.gen(function* () {
    // Validate inputs
    if (!options.organizationId || options.organizationId.trim().length === 0) {
      return yield* Effect.fail(
        new MemberInvitationError('Organization ID is required')
      );
    }
    if (!options.email || options.email.trim().length === 0) {
      return yield* Effect.fail(
        new MemberInvitationError('Email is required')
      );
    }

    const validatedRole = yield* validateMemberRole(options.role);

    // Build the endpoint URL
    const url = buildInviteMemberUrl(config);

    // Make the POST request
    const response = yield* Effect.tryPromise({
      try: () =>
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            organizationId: options.organizationId,
            email: options.email,
            role: validatedRole,
          }),
        }),
      catch: (error) =>
        new MemberInvitationError(`Failed to send invitation request to ${url}`, error),
    });

    // Check response status
    if (!response.ok) {
      const errorText = yield* Effect.tryPromise({
        try: () => response.text(),
        catch: () => new MemberInvitationError('Failed to read error response'),
      });
      return yield* Effect.fail(
        new MemberInvitationError(
          `Invite member failed with status ${response.status}: ${errorText}`
        )
      );
    }

    // Parse the response
    const result = yield* Effect.tryPromise({
      try: () => response.json() as Promise<MemberInvitation>,
      catch: (error) =>
        new MemberInvitationError('Failed to parse invitation response', error),
    });

    return result;
  });
