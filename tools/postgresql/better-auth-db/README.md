# Better Auth Database

PostgreSQL database with Prisma ORM configured for Better Auth.

## Initial Setup

```bash
# Ensure PostgreSQL is running
npx nx start postgresql

# Generate Prisma Client (from monorepo root)
cd tools/postgresql/better-auth-db
pnpm run prisma:generate
```

## Prisma Commands

All commands should be run from the `tools/postgresql/better-auth-db` directory or via Nx from the monorepo root.

```bash
# Generate Prisma Client
pnpm run prisma:generate

# Create and apply migration
pnpm run prisma:migrate

# Apply migrations (production)
pnpm run prisma:migrate:deploy

# Open Prisma Studio
pnpm run prisma:studio

# Push schema without migration
pnpm run prisma:push

# Reset database
pnpm run prisma:reset

# Validate schema
pnpm run prisma:validate
```

## Better Auth CLI

```bash
# Generate schema from Better Auth config
pnpm run better-auth:generate

# Apply Better Auth migrations
pnpm run better-auth:migrate
```

## Using Prisma Client

```typescript
import { PrismaClient } from '@my-projects-monorepo/better-auth-db/prisma/generated/client';

const prisma = new PrismaClient();

// Query users
const users = await prisma.user.findMany();

// Create user
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'John Doe',
  },
});
```

## Integration with Better Auth

```typescript
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '@my-projects-monorepo/better-auth-db/prisma/generated/client';

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
});
```

## Schema Updates

When Better Auth plugins are added or configuration changes:

```bash
# Regenerate schema with Better Auth CLI
npx @better-auth/cli generate --config ../../../services/auth-service/src/auth.ts

# Create Prisma migration
pnpm run prisma:migrate

# Regenerate Prisma Client
pnpm run prisma:generate
```

## Connection String Format

```plaintext
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA&sslmode=MODE"
```

Example:

```plaintext
DATABASE_URL="postgresql://better_auth_user:password@localhost:5432/better_auth_db?schema=public"
```

For production with SSL:

```plaintext
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public&sslmode=require"
```

## Directory Structure

```plaintext
better-auth-db/
├── .env                    # Local environment (gitignored)
├── .env.example            # Environment template
├── package.json            # npm scripts for Prisma
├── README.md               # This file
└── prisma/
    ├── schema.prisma       # Prisma schema definition
    ├── generated/          # Generated Prisma Client (gitignored)
    └── migrations/         # Prisma migrations
```

## Troubleshooting

### Prisma Client Generation Fails

```bash
# Ensure DATABASE_URL is set
cat .env

# Validate schema
pnpm run prisma:validate

# Regenerate client
pnpm run prisma:generate
```

### Migration Issues

```bash
# Check database connection
docker exec monorepo-postgres pg_isready -U postgres

# Verify database exists
docker exec monorepo-postgres psql -U postgres -c "\l" | grep better_auth

# Reset and start fresh (development only)
pnpm run prisma:reset
```

## Notes

- All Prisma and Better Auth dependencies are installed at the monorepo root
- Prisma Client is generated to `./prisma/generated/client` for isolation
- Database connection details are in `.env` file (never commit this)
- Use `.env.example` as a template for new environments

---

**Last Updated**: October 13, 2025
**Version**: 1.0.0
