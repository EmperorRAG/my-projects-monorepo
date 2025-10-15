# Better Auth Utilities - Plugin API Documentation

This document provides comprehensive documentation for all better-auth plugin utilities implemented using the Effect-TS functional programming paradigm.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Plugin Utilities](#plugin-utilities)
  - [Two-Factor Authentication](#two-factor-authentication)
  - [Admin Plugin](#admin-plugin)
  - [Organization Plugin](#organization-plugin)
  - [Username Plugin](#username-plugin)
  - [Magic Link Plugin](#magic-link-plugin)
  - [Multi-Session Plugin](#multi-session-plugin)
  - [Anonymous Plugin](#anonymous-plugin)
  - [Phone Number Plugin](#phone-number-plugin)
  - [Email OTP Plugin](#email-otp-plugin)
- [Testing](#testing)
- [Error Handling](#error-handling)

## Overview

All plugin utilities in this library follow these principles:

1. **Effect-TS Paradigm**: All async operations return `Effect` types for composable error handling
2. **Pure Functions**: Validation and URL building functions are pure
3. **Type Safety**: Comprehensive TypeScript types for all inputs and outputs
4. **Error Types**: Custom error classes for each plugin with cause tracking
5. **Documentation**: Complete JSDoc with usage examples

## Installation

```typescript
import {
  // Two-Factor
  enableTwoFactor,
  disableTwoFactor,
  verifyTwoFactorCode,
  
  // Admin
  banUser,
  unbanUser,
  impersonateUser,
  
  // Organization
  createOrganization,
  updateOrganization,
  deleteOrganization,
  inviteMember,
  
  // And more...
} from '@emperorrag/better-auth-utilities';
```

## Plugin Utilities

### Two-Factor Authentication

The two-factor plugin provides TOTP-based authentication.

#### Enable Two-Factor

```typescript
import { Effect } from 'effect';
import { enableTwoFactor, type TwoFactorConfig } from '@emperorrag/better-auth-utilities';

const config: TwoFactorConfig = {
  baseUrl: 'http://localhost:3000',
};

const program = Effect.gen(function* () {
  const result = yield* enableTwoFactor(
    { password: 'userPassword123' },
    config
  );
  
  console.log('Secret:', result.secret);
  console.log('QR Code:', result.qrCode);
  console.log('Backup Codes:', result.backupCodes);
  
  return result;
});

// Run the effect
await Effect.runPromise(program);
```

#### Verify Two-Factor Code

```typescript
const verifyProgram = Effect.gen(function* () {
  const result = yield* verifyTwoFactorCode(
    { code: '123456' },
    config
  );
  
  if (result.verified) {
    console.log('Session:', result.session);
  }
  
  return result;
});

await Effect.runPromise(verifyProgram);
```

#### Disable Two-Factor

```typescript
await Effect.runPromise(
  disableTwoFactor({ password: 'userPassword123' }, config)
);
```

### Admin Plugin

The admin plugin provides user management and impersonation capabilities.

#### Ban User

```typescript
import { banUser, type AdminConfig } from '@emperorrag/better-auth-utilities';

const config: AdminConfig = {
  baseUrl: 'http://localhost:3000',
};

const program = Effect.gen(function* () {
  const bannedUser = yield* banUser(
    {
      userId: 'user-123',
      reason: 'Terms of service violation',
      expiresAt: new Date('2025-01-01'),
    },
    config
  );
  
  console.log('User banned:', bannedUser.email);
  console.log('Ban expires:', bannedUser.bannedUntil);
  
  return bannedUser;
});

await Effect.runPromise(program);
```

#### Impersonate User

```typescript
const impersonateProgram = Effect.gen(function* () {
  const session = yield* impersonateUser(
    { userId: 'user-456' },
    config
  );
  
  console.log('Impersonating:', session.userId);
  console.log('Session ID:', session.sessionId);
  console.log('Impersonated by:', session.impersonatedBy);
  
  return session;
});

await Effect.runPromise(impersonateProgram);
```

### Organization Plugin

The organization plugin provides multi-tenant organization management.

#### Create Organization

```typescript
import { createOrganization, type OrganizationConfig } from '@emperorrag/better-auth-utilities';

const config: OrganizationConfig = {
  baseUrl: 'http://localhost:3000',
};

const program = Effect.gen(function* () {
  const org = yield* createOrganization(
    {
      name: 'Acme Corporation',
      slug: 'acme',
      description: 'A leading tech company',
      metadata: { industry: 'technology', size: 'large' },
    },
    config
  );
  
  console.log('Organization created:', org.name);
  console.log('Slug:', org.slug);
  
  return org;
});

await Effect.runPromise(program);
```

#### Invite Member

```typescript
const inviteProgram = Effect.gen(function* () {
  const invitation = yield* inviteMember(
    {
      organizationId: 'org-123',
      email: 'newmember@example.com',
      role: 'member',
    },
    config
  );
  
  console.log('Invitation sent to:', invitation.email);
  console.log('Role:', invitation.role);
  
  return invitation;
});

await Effect.runPromise(inviteProgram);
```

### Username Plugin

The username plugin provides username management and availability checking.

#### Set Username

```typescript
import { setUsername, checkUsernameAvailability } from '@emperorrag/better-auth-utilities';

const program = Effect.gen(function* () {
  // Check availability first
  const availability = yield* checkUsernameAvailability(
    { username: 'johndoe' },
    { baseUrl: 'http://localhost:3000' }
  );
  
  if (availability.available) {
    // Set the username
    yield* setUsername(
      { username: 'johndoe' },
      { baseUrl: 'http://localhost:3000' }
    );
    console.log('Username set successfully');
  } else {
    console.log('Username already taken');
  }
});

await Effect.runPromise(program);
```

### Magic Link Plugin

The magic link plugin provides passwordless authentication via email.

#### Send Magic Link

```typescript
import { sendMagicLink, verifyMagicLink } from '@emperorrag/better-auth-utilities';

const sendProgram = Effect.gen(function* () {
  const result = yield* sendMagicLink(
    {
      email: 'user@example.com',
      redirectTo: '/dashboard',
    },
    { baseUrl: 'http://localhost:3000' }
  );
  
  console.log('Magic link sent to:', result.email);
  
  return result;
});

await Effect.runPromise(sendProgram);
```

#### Verify Magic Link

```typescript
const verifyProgram = Effect.gen(function* () {
  const result = yield* verifyMagicLink(
    { token: 'magic-token-from-email' },
    { baseUrl: 'http://localhost:3000' }
  );
  
  if (result.verified) {
    console.log('User authenticated:', result.session?.userId);
  }
  
  return result;
});

await Effect.runPromise(verifyProgram);
```

### Multi-Session Plugin

The multi-session plugin provides session management across multiple devices.

#### List Sessions

```typescript
import { listSessions, revokeSession } from '@emperorrag/better-auth-utilities';

const program = Effect.gen(function* () {
  const sessions = yield* listSessions({
    baseUrl: 'http://localhost:3000',
  });
  
  console.log('Active sessions:', sessions.length);
  
  for (const session of sessions) {
    console.log('Session:', session.id);
    console.log('Device:', session.deviceName);
    console.log('Last active:', session.lastActiveAt);
  }
  
  return sessions;
});

await Effect.runPromise(program);
```

#### Revoke Session

```typescript
await Effect.runPromise(
  revokeSession('session-id-123', { baseUrl: 'http://localhost:3000' })
);
```

### Anonymous Plugin

The anonymous plugin provides anonymous authentication.

#### Sign In Anonymously

```typescript
import { signInAnonymously, linkAnonymousAccount } from '@emperorrag/better-auth-utilities';

const program = Effect.gen(function* () {
  // Step 1: Sign in anonymously
  const session = yield* signInAnonymously({
    baseUrl: 'http://localhost:3000',
  });
  
  console.log('Anonymous user ID:', session.userId);
  console.log('Is anonymous:', session.isAnonymous);
  
  // Step 2: Link to real account later
  yield* linkAnonymousAccount(
    'user@example.com',
    'password123',
    { baseUrl: 'http://localhost:3000' }
  );
  
  console.log('Account linked successfully');
});

await Effect.runPromise(program);
```

### Phone Number Plugin

The phone number plugin provides phone-based authentication with OTP.

#### Send Phone OTP

```typescript
import { sendPhoneOTP, verifyPhoneOTP } from '@emperorrag/better-auth-utilities';

const program = Effect.gen(function* () {
  // Send OTP
  const sendResult = yield* sendPhoneOTP(
    '+1234567890',
    { baseUrl: 'http://localhost:3000' }
  );
  
  console.log('OTP sent to:', sendResult.phoneNumber);
  
  // Verify OTP
  const verifyResult = yield* verifyPhoneOTP(
    '+1234567890',
    '123456',
    { baseUrl: 'http://localhost:3000' }
  );
  
  if (verifyResult.verified) {
    console.log('Phone verified, session:', verifyResult.session?.sessionId);
  }
  
  return verifyResult;
});

await Effect.runPromise(program);
```

### Email OTP Plugin

The email OTP plugin provides email-based OTP authentication.

#### Send Email OTP

```typescript
import { sendEmailOTP, verifyEmailOTP } from '@emperorrag/better-auth-utilities';

const program = Effect.gen(function* () {
  // Send OTP
  const sendResult = yield* sendEmailOTP(
    'user@example.com',
    { baseUrl: 'http://localhost:3000' }
  );
  
  console.log('OTP sent to:', sendResult.email);
  
  // Verify OTP
  const verifyResult = yield* verifyEmailOTP(
    'user@example.com',
    '123456',
    { baseUrl: 'http://localhost:3000' }
  );
  
  if (verifyResult.verified) {
    console.log('Email verified, user:', verifyResult.session?.userId);
  }
  
  return verifyResult;
});

await Effect.runPromise(program);
```

## Testing

All plugins include comprehensive test suites with >90% code coverage. Tests follow these patterns:

```typescript
import { Effect } from 'effect';
import { enableTwoFactor } from './two-factor.utils';

// Mock global fetch
global.fetch = jest.fn();

describe('enableTwoFactor', () => {
  it('should successfully enable 2FA', async () => {
    const mockResponse = {
      secret: 'JBSWY3DPEHPK3PXP',
      qrCode: 'data:image/png;base64,...',
      backupCodes: ['code1', 'code2'],
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await Effect.runPromise(
      enableTwoFactor(
        { password: 'test' },
        { baseUrl: 'http://localhost:3000' }
      )
    );

    expect(result).toEqual(mockResponse);
  });
});
```

## Error Handling

All plugins use custom error types for granular error handling:

```typescript
import { Effect, Exit } from 'effect';
import { enableTwoFactor, TwoFactorEnableError } from '@emperorrag/better-auth-utilities';

const program = Effect.gen(function* () {
  const result = yield* enableTwoFactor(
    { password: 'test' },
    { baseUrl: 'http://localhost:3000' }
  );
  return result;
});

// Handle errors gracefully
const exit = await Effect.runPromiseExit(program);

if (Exit.isFailure(exit)) {
  const error = exit.cause;
  
  if (error instanceof TwoFactorEnableError) {
    console.error('2FA enable failed:', error.message);
    console.error('Cause:', error.cause);
  }
}
```

## Error Types

Each plugin exports custom error types:

- **Two-Factor**: `TwoFactorEnableError`, `TwoFactorDisableError`, `TwoFactorVerificationError`
- **Admin**: `UserBanError`, `UserUnbanError`, `ImpersonationError`, `RoleAssignmentError`
- **Organization**: `OrganizationCreationError`, `OrganizationUpdateError`, `OrganizationDeletionError`, `MemberInvitationError`, `MemberRemovalError`
- **Username**: `UsernameError`
- **Magic Link**: `MagicLinkError`
- **Multi-Session**: `MultiSessionError`
- **Anonymous**: `AnonymousAuthError`
- **Phone Number**: `PhoneNumberError`
- **Email OTP**: `EmailOTPError`

All error types include:
- `_tag` property for error discrimination
- `cause` property for error chaining
- Descriptive error messages

## Contributing

When adding new plugin utilities:

1. Follow the Effect-TS functional programming paradigm
2. Create custom error types with `_tag` and `cause` properties
3. Implement pure validation functions
4. Provide comprehensive JSDoc with examples
5. Write tests achieving >90% code coverage
6. Update this documentation

## License

MIT
