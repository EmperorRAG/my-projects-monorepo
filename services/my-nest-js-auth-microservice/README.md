# My NestJS Auth Microservice

A NestJS-based authentication microservice using Better Auth and Prisma ORM with PostgreSQL.

## Overview

This service provides centralized authentication for the monorepo using Better Auth, a framework-agnostic authentication library for TypeScript.

## Features

- ✅ Email and password authentication
- ✅ Session management
- ✅ PostgreSQL database with Prisma ORM
- ✅ Better Auth integration
- ✅ RESTful API endpoints

## Prerequisites

- PostgreSQL database running (see `tools/postgresql`)
- Prisma Client generated
- Better Auth packages installed

## Quick Start

### 1. Environment Setup

Copy the environment template and configure:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
DATABASE_URL="postgresql://better_auth_user:better_auth_password@localhost:5432/better_auth_db?schema=public"
PORT=3333
NODE_ENV=development
BETTER_AUTH_SECRET=your-secret-key-change-in-production
BETTER_AUTH_URL=http://localhost:3333
```

### 2. Start the Service

```bash
# Development mode
npx nx serve my-nest-js-auth-microservice

# Production build
npx nx build my-nest-js-auth-microservice
npx nx serve my-nest-js-auth-microservice --configuration=production
```

The service will be available at `http://localhost:3333`

## API Endpoints

All authentication endpoints are handled by Better Auth at `/api/auth/*`:

### Sign Up

```bash
POST /api/auth/sign-up/email
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

### Sign In

```bash
POST /api/auth/sign-in/email
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

### Sign Out

```bash
POST /api/auth/sign-out
Cookie: session_token=<token>
```

### Get Session

```bash
GET /api/auth/get-session
Cookie: session_token=<token>
```

## Architecture

```
services/my-nest-js-auth-microservice/
├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts    # Better Auth route handler
│   │   │   └── auth.module.ts        # Auth module
│   │   ├── app.controller.ts
│   │   ├── app.module.ts
│   │   └── app.service.ts
│   ├── lib/
│   │   └── auth.ts                   # Better Auth configuration
│   └── main.ts
├── .env                              # Environment variables (gitignored)
├── .env.example                      # Environment template
├── package.json
└── README.md
```

## Better Auth Configuration

The Better Auth instance is configured in `src/lib/auth.ts`:

```typescript
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24,     // 1 day
  },
});
```

## Database Schema

The service uses the shared Better Auth database located at `tools/postgresql/better-auth-db`.

### Tables

- **user**: User accounts
- **account**: OAuth and credential provider info
- **session**: Active user sessions
- **verification**: Email/phone verification tokens

## Development

### Running Tests

```bash
# Unit tests
npx nx test my-nest-js-auth-microservice

# E2E tests
npx nx e2e my-nest-js-auth-microservice-e2e
```

### Linting

```bash
npx nx lint my-nest-js-auth-microservice
```

### Type Checking

```bash
npx nx typecheck my-nest-js-auth-microservice
```

## Updating the Schema

If you modify the Better Auth configuration (add plugins, change settings):

```bash
# Regenerate the schema
cd tools/postgresql/better-auth-db
npx @better-auth/cli generate --config ../../../services/my-nest-js-auth-microservice/src/lib/auth.ts

# Create and apply migration
pnpm run prisma:migrate -- --name your_migration_name

# Regenerate Prisma Client
pnpm run prisma:generate
```

## Integration with Other Services

### Using the Auth Service in Next.js Apps

```typescript
// In your Next.js app
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: 'http://localhost:3333',
});

// Use in components
const { data: session } = authClient.useSession();
```

### Using the Auth Service in NestJS Services

```typescript
// Add auth middleware or guards
import { auth } from '@my-projects-monorepo/my-nest-js-auth-microservice/src/lib/auth';

// Verify session in your service
const session = await auth.api.getSession({
  headers: request.headers,
});
```

## Security Considerations

- ✅ Store `BETTER_AUTH_SECRET` securely (use environment variables)
- ✅ Use HTTPS in production
- ✅ Configure CORS properly for your frontend origins
- ✅ Implement rate limiting for authentication endpoints
- ✅ Regular security audits and updates

## Troubleshooting

### Service won't start

1. Ensure PostgreSQL is running:

   ```bash
   npx nx start postgresql
   ```

2. Verify Prisma Client is generated:

   ```bash
   cd tools/postgresql/better-auth-db
   pnpm run prisma:generate
   ```

3. Check environment variables in `.env`

### Authentication errors

1. Verify database connection:

   ```bash
   docker exec monorepo-postgres psql -U better_auth_user -d better_auth_db -c "\dt"
   ```

2. Check Better Auth configuration in `src/lib/auth.ts`

3. Verify session cookies are being set (check browser dev tools)

## Related Documentation

- [Better Auth Documentation](https://www.better-auth.com/docs)
- [PostgreSQL Setup](../../../tools/postgresql/README.md)
- [Prisma Documentation](https://www.prisma.io/docs)

## Support

For issues or questions:

1. Check this documentation
2. Review Better Auth docs
3. Check PostgreSQL and Prisma setup
4. Consult the team

---

**Last Updated**: 2025-10-13
**Author**: AI Assistant
**Version**: 1.0.0
