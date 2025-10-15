# @my-projects-monorepo/better-auth-utilities

A comprehensive, type-safe configuration system for better-auth with plugin support.

## Features

- ✅ **Type-Safe Configuration**: Full TypeScript support with intelligent autocomplete
- ✅ **Plugin System**: Support for 24+ better-auth plugins across 4 categories
- ✅ **Default Values**: Sensible defaults for all configuration options
- ✅ **Server & Client**: Unified configuration for both server and client APIs
- ✅ **Environment-Aware**: Built for production with security best practices
- ✅ **Well-Documented**: Comprehensive JSDoc comments and examples

## Installation

This is a shared library within the Nx monorepo. Reference it in your project's dependencies:

```json
{
  "dependencies": {
    "@my-projects-monorepo/better-auth-utilities": "*"
  }
}
```

## Quick Start

### Basic Configuration

```typescript
import { defineConfig } from '@my-projects-monorepo/better-auth-utilities';

const authConfig = defineConfig({
  enabledServerPlugins: ['username', 'twoFactor'] as const,
  enabledClientPlugins: ['username', 'twoFactor'] as const,

  server: {
    secret: process.env.BETTER_AUTH_SECRET || 'REPLACE_ME',
    database: process.env.DATABASE_URL,
    appName: 'My App',

    plugins: {
      username: {
        enabled: true,
        requireUniqueUsername: true,
        minLength: 3,
        maxLength: 20,
      },
      twoFactor: {
        enabled: true,
        issuer: 'My App',
        twoFactorPage: '/auth/2fa',
      },
    },
  },

  client: {
    baseURL: 'http://localhost:3000',

    plugins: {
      username: {
        enabled: true,
      },
      twoFactor: {
        enabled: true,
        twoFactorPage: '/auth/2fa',
      },
    },
  },
});
```

### Using Default Configurations

```typescript
import {
  defineConfig,
  DEFAULT_SERVER_CONFIG,
  DEFAULT_CLIENT_CONFIG
} from '@my-projects-monorepo/better-auth-utilities';

const authConfig = defineConfig({
  enabledServerPlugins: ['jwt'] as const,
  enabledClientPlugins: [] as const,

  server: {
    ...DEFAULT_SERVER_CONFIG,
    secret: process.env.BETTER_AUTH_SECRET || 'REPLACE_ME',
    appName: 'My Custom App',

    plugins: {
      jwt: {
        enabled: true,
        jwtExpiresIn: '7d',
      },
    },
  },

  client: {
    ...DEFAULT_CLIENT_CONFIG,
  },
});
```

## Available Plugins

### Core Plugins

- `username` - Username authentication
- `magicLink` - Passwordless magic link authentication
- `twoFactor` - Two-factor authentication (TOTP)
- `admin` - Admin user management
- `organization` - Multi-tenant organization support

### OAuth & Authentication

- `passkey` - WebAuthn/Passkey authentication
- `oidc` - OpenID Connect provider
- `siwe` - Sign-In with Ethereum
- `genericOAuth` - Custom OAuth providers
- `oneTap` - Google One Tap

### Integration Plugins

- `stripe` - Stripe payment integration
- `polar` - Polar payment integration
- `dodopayments` - Dodo Payments integration
- `dubAnalytics` - Dub Analytics integration

### Security & Advanced

- `bearer` - Bearer token authentication
- `jwt` - JSON Web Token support
- `apiKey` - API key authentication
- `haveIBeenPwned` - Password breach detection
- `multiSession` - Multiple concurrent sessions
- `anonymous` - Anonymous user support
- `phoneNumber` - Phone number authentication
- `emailOTP` - Email one-time passwords
- `deviceAuthorization` - OAuth device flow
- `lastLoginMethod` - Track user's last login method
- `oneTimeToken` - Single-use token authentication

## API Reference

### `defineConfig<ServerPlugins, ClientPlugins>(config)`

Creates a type-safe better-auth configuration.

**Type Parameters:**

- `ServerPlugins` - Array of plugin names enabled on the server (default: `[]`)
- `ClientPlugins` - Array of plugin names enabled on the client (default: `ServerPlugins`)

**Parameters:**

- `config.enabledServerPlugins` - Array of plugin names to enable on the server
- `config.enabledClientPlugins` - Array of plugin names to enable on the client
- `config.server` - Server configuration object
- `config.client` - Client configuration object

**Returns:**
A `BetterAuthConfig` object with type-safe plugin configurations.

### Server Configuration Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `secret` | `string` | **Required** | Secret key for signing tokens |
| `database` | `string` | `undefined` | Database connection URL |
| `appName` | `string` | `'My Application'` | Application name |
| `baseURL` | `string` | `'http://localhost:3000'` | Auth server base URL |
| `plugins` | `Record<string, unknown>` | `{}` | Plugin-specific configurations |

**Advanced Options:**

- `emailAndPassword` - Email/password authentication settings
- `emailVerification` - Email verification configuration
- `socialProviders` - OAuth provider configurations
- `session` - Session expiration and update settings
- `rateLimit` - Rate limiting configuration
- `trustedOrigins` - CORS allowed origins

### Client Configuration Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `baseURL` | `string` | Same origin | Auth server API URL |
| `redirectUri` | `string` | `'/dashboard'` | Post-login redirect |
| `postLogoutRedirectUri` | `string` | `'/'` | Post-logout redirect |
| `autoRefreshSession` | `boolean` | `true` | Auto-refresh sessions |
| `scopes` | `string[]` | `['openid', 'profile', 'email']` | OAuth scopes |
| `plugins` | `Record<string, unknown>` | `{}` | Plugin-specific configurations |

**Fetch Options:**

- `credentials` - CORS credentials mode (`'omit'` | `'same-origin'` | `'include'`)
- `onSuccess` - Success callback
- `onError` - Error callback

## Examples

See `config.example.ts` for comprehensive examples including:

1. **Basic Configuration** - Common authentication setup
2. **Advanced Configuration** - Payment integration with Stripe
3. **Security-Focused** - Maximum security with API keys, JWT, and 2FA
4. **Mobile Configuration** - Anonymous users, phone auth, and OTP

## TypeScript Support

This library provides full TypeScript support with:

- **Intelligent Autocomplete**: TypeScript will suggest only the plugins you've enabled
- **Type Narrowing**: Plugin configurations are conditionally included based on `enabledServerPlugins` and `enabledClientPlugins`
- **Compile-Time Safety**: Attempting to configure a plugin that isn't enabled will result in a TypeScript error

```typescript
const config = defineConfig({
  enabledServerPlugins: ['jwt'] as const,
  enabledClientPlugins: [] as const,

  server: {
    secret: 'my-secret',
    plugins: {
      jwt: { enabled: true }, // ✅ OK
      // stripe: { enabled: true }, // ❌ TypeScript error: 'stripe' not enabled
    },
  },

  client: {
    plugins: {
      // jwt: { enabled: true }, // ❌ TypeScript error: 'jwt' not in client plugins
    },
  },
});
```

## Best Practices

### Security

1. **Always load secrets from environment variables**

   ```typescript
   secret: process.env.BETTER_AUTH_SECRET || 'REPLACE_ME_IN_PRODUCTION'
   ```

2. **Use strong session expiration**

   ```typescript
   session: {
     expiresIn: 60 * 60 * 24 * 7, // 7 days
     freshAge: 60 * 10, // 10 minutes for sensitive operations
   }
   ```

3. **Enable rate limiting**

   ```typescript
   rateLimit: {
     enabled: true,
     window: 60,
     max: 10,
   }
   ```

### Performance

1. **Only enable plugins you need**
2. **Use caching for frequent operations**
3. **Configure appropriate session update intervals**

### Maintainability

1. **Export configuration from a central location**
2. **Use environment-specific configs (dev, staging, prod)**
3. **Document custom plugin configurations**

## Development

### Build

```bash
npx nx build better-auth-utilities
```

### Test

```bash
npx nx test better-auth-utilities
```

### Lint

```bash
npx nx lint better-auth-utilities
```

## Contributing

When adding new plugin configurations:

1. Add the plugin name to `AvailablePlugins` type
2. Add the configuration interface to `PluginConfigRegistry`
3. Update the examples in `config.example.ts`
4. Update this README with the new plugin

## License

MIT

## Related

- [better-auth Documentation](https://better-auth.com)
- [better-auth GitHub](https://github.com/better-auth/better-auth)
- [better-auth Plugins](https://better-auth.com/docs/plugins)
