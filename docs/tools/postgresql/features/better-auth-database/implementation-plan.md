# PostgreSQL Database Setup for Better Auth with Prisma ORM - Implementation Plan

## Overview

This implementation plan outlines the setup of a PostgreSQL database in the `tools/postgresql` directory, configured with Prisma ORM to support Better Auth for centralized authentication in the monorepo.

## Goals

- Create a dedicated PostgreSQL database environment in `tools/postgresql/` for Better Auth
- Configure Prisma as the ORM for Better Auth with PostgreSQL
- Establish a reusable pattern for future PostgreSQL databases in the monorepo
- Enable Docker-based PostgreSQL deployment for local development and production
- Integrate the database with the planned authentication service

## Prerequisites

- Docker and Docker Compose installed
- Node.js and pnpm installed (via monorepo root)
- Basic understanding of Prisma ORM
- Better Auth library (to be installed)

## Technical Considerations

### 1. Directory Structure

```plaintext
tools/
└── postgresql/
    ├── docker-compose.yaml           # PostgreSQL container config
    ├── docker-compose.prod.yaml      # Production overrides
    ├── .env.example                  # Template for environment variables
    ├── .env                          # Local environment (gitignored)
    ├── .gitignore                    # Ignore sensitive files
    ├── README.md                     # Setup and usage documentation
    ├── project.json                  # Nx project configuration
    ├── init-scripts/                 # Database initialization scripts
    │   └── 01-create-databases.sql   # Create Better Auth database
    ├── backups/                      # Database backup scripts/location
    │   └── .gitkeep
    └── better-auth-db/               # Better Auth specific config
        ├── prisma/
        │   ├── schema.prisma         # Prisma schema for Better Auth
        │   └── migrations/           # Prisma migration files
        ├── .env                      # Database-specific env vars
        ├── package.json              # Prisma dependencies
        └── README.md                 # Better Auth DB documentation
```

### 2. PostgreSQL Docker Configuration

**File: `tools/postgresql/docker-compose.yaml`**

```yaml
version: '3.9'

services:
  postgres:
    image: postgres:16-alpine
    container_name: monorepo-postgres
    restart: unless-stopped
    ports:
      - '5432:5432'
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-postgres}
      POSTGRES_DB: ${POSTGRES_DB:-postgres}
      PGDATA: /var/lib/postgresql/data/pgdata
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./init-scripts:/docker-entrypoint-initdb.d:ro
      - ./backups:/backups
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U ${POSTGRES_USER:-postgres}']
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - monorepo-network

  # Optional: pgAdmin for database management
  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: monorepo-pgadmin
    restart: unless-stopped
    ports:
      - '5050:80'
    environment:
      PGADMIN_DEFAULT_EMAIL: ${PGADMIN_EMAIL:-admin@monorepo.local}
      PGADMIN_DEFAULT_PASSWORD: ${PGADMIN_PASSWORD:-admin}
      PGADMIN_CONFIG_SERVER_MODE: 'False'
    volumes:
      - pgadmin-data:/var/lib/pgadmin
    depends_on:
      - postgres
    networks:
      - monorepo-network

volumes:
  postgres-data:
    driver: local
  pgadmin-data:
    driver: local

networks:
  monorepo-network:
    driver: bridge
```

**File: `tools/postgresql/docker-compose.prod.yaml`**

```yaml
version: '3.9'

services:
  postgres:
    restart: always
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD} # Must be set in production
    ports:
      - '127.0.0.1:5432:5432' # Bind to localhost only
    volumes:
      - /var/lib/postgresql/data:/var/lib/postgresql/data # Production mount
    healthcheck:
      interval: 30s
      timeout: 10s
      retries: 3

  # Remove pgAdmin in production
  pgadmin:
    profiles:
      - dev-only
```

### 3. Environment Configuration

**File: `tools/postgresql/.env.example`**

```bash
# PostgreSQL Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres_dev_password
POSTGRES_DB=postgres

# pgAdmin Configuration
PGADMIN_EMAIL=admin@monorepo.local
PGADMIN_PASSWORD=admin_dev_password

# Better Auth Database
BETTER_AUTH_DB_NAME=better_auth_db
BETTER_AUTH_DB_USER=better_auth_user
BETTER_AUTH_DB_PASSWORD=better_auth_password

# Connection Strings (generated, do not edit manually)
DATABASE_URL="postgresql://${BETTER_AUTH_DB_USER}:${BETTER_AUTH_DB_PASSWORD}@localhost:5432/${BETTER_AUTH_DB_NAME}?schema=public"
```

### 4. Database Initialization Script

**File: `tools/postgresql/init-scripts/01-create-databases.sql`**

```sql
-- Create Better Auth Database
CREATE DATABASE better_auth_db;

-- Create dedicated user for Better Auth
CREATE USER better_auth_user WITH PASSWORD 'better_auth_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE better_auth_db TO better_auth_user;

-- Connect to the Better Auth database
\c better_auth_db;

-- Grant schema permissions
GRANT ALL ON SCHEMA public TO better_auth_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO better_auth_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO better_auth_user;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO better_auth_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO better_auth_user;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Output success message
SELECT 'Better Auth database created successfully' AS status;
```

### 5. Prisma Schema for Better Auth

**File: `tools/postgresql/better-auth-db/prisma/schema.prisma`**

```prisma
// Prisma Schema for Better Auth
// This schema will be enhanced by Better Auth CLI

generator client {
  provider = "prisma-client-js"
  output   = "./generated/client"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Better Auth will generate the complete schema
// Run: npx @better-auth/cli generate --config ../../../services/auth-service/src/auth.ts

// Placeholder model (will be replaced by Better Auth CLI)
model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  emailVerified Boolean   @default(false)
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts      Account[]
  sessions      Session[]

  @@map("user")
}

model Account {
  id                    String    @id @default(cuid())
  userId                String
  accountId             String
  providerId            String
  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  password              String?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("account")
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  expiresAt DateTime
  token     String   @unique
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("session")
}

model Verification {
  id         String   @id @default(cuid())
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@unique([identifier, value])
  @@map("verification")
}
```

**File: `tools/postgresql/better-auth-db/.env`**

```bash
# Database Connection String
DATABASE_URL="postgresql://better_auth_user:better_auth_password@localhost:5432/better_auth_db?schema=public"

# Alternative for production (override in production environment)
# DATABASE_URL="postgresql://user:password@host:5432/database?schema=public&sslmode=require"
```

### 6. Prisma Package Configuration

**File: `tools/postgresql/better-auth-db/package.json`**

```json
{
  "name": "@my-projects-monorepo/better-auth-db",
  "version": "1.0.0",
  "private": true,
  "description": "Better Auth PostgreSQL database with Prisma ORM",
  "scripts": {
    "prisma:generate": "prisma generate --schema=./prisma/schema.prisma",
    "prisma:migrate": "prisma migrate dev --schema=./prisma/schema.prisma",
    "prisma:migrate:deploy": "prisma migrate deploy --schema=./prisma/schema.prisma",
    "prisma:studio": "prisma studio --schema=./prisma/schema.prisma",
    "prisma:push": "prisma db push --schema=./prisma/schema.prisma",
    "prisma:reset": "prisma migrate reset --schema=./prisma/schema.prisma --force",
    "better-auth:generate": "npx @better-auth/cli generate",
    "better-auth:migrate": "npx @better-auth/cli migrate",
    "db:seed": "node seeds/seed.js"
  },
  "dependencies": {
    "@prisma/client": "^5.22.0"
  },
  "devDependencies": {
    "prisma": "^5.22.0",
    "@better-auth/cli": "^1.0.0"
  }
}
```

### 7. Nx Project Configuration

**File: `tools/postgresql/project.json`**

```json
{
  "name": "postgresql",
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "projectType": "application",
  "sourceRoot": "tools/postgresql",
  "targets": {
    "start": {
      "executor": "nx:run-commands",
      "options": {
        "command": "docker-compose up -d",
        "cwd": "tools/postgresql"
      }
    },
    "stop": {
      "executor": "nx:run-commands",
      "options": {
        "command": "docker-compose down",
        "cwd": "tools/postgresql"
      }
    },
    "restart": {
      "executor": "nx:run-commands",
      "options": {
        "command": "docker-compose restart",
        "cwd": "tools/postgresql"
      }
    },
    "logs": {
      "executor": "nx:run-commands",
      "options": {
        "command": "docker-compose logs -f postgres",
        "cwd": "tools/postgresql"
      }
    },
    "prisma:generate": {
      "executor": "nx:run-commands",
      "options": {
        "command": "pnpm run prisma:generate",
        "cwd": "tools/postgresql/better-auth-db"
      }
    },
    "prisma:migrate": {
      "executor": "nx:run-commands",
      "options": {
        "command": "pnpm run prisma:migrate",
        "cwd": "tools/postgresql/better-auth-db"
      }
    },
    "prisma:studio": {
      "executor": "nx:run-commands",
      "options": {
        "command": "pnpm run prisma:studio",
        "cwd": "tools/postgresql/better-auth-db"
      }
    },
    "better-auth:generate": {
      "executor": "nx:run-commands",
      "options": {
        "command": "pnpm run better-auth:generate",
        "cwd": "tools/postgresql/better-auth-db"
      }
    },
    "backup": {
      "executor": "nx:run-commands",
      "options": {
        "command": "bash scripts/backup-db.sh",
        "cwd": "tools/postgresql"
      }
    },
    "restore": {
      "executor": "nx:run-commands",
      "options": {
        "command": "bash scripts/restore-db.sh",
        "cwd": "tools/postgresql"
      }
    }
  },
  "tags": ["type:tool", "scope:database", "stack:postgresql"]
}
```

### 8. Git Ignore Configuration

**File: `tools/postgresql/.gitignore`**

```gitignore
# Environment files
.env
.env.local
.env.*.local

# Database data (handled by Docker volumes)
data/
pgdata/

# Backups (too large for git)
backups/*.sql
backups/*.dump

# Prisma
better-auth-db/prisma/generated/
better-auth-db/node_modules/

# Logs
*.log
logs/

# OS files
.DS_Store
Thumbs.db
```

### 9. Setup Scripts

**File: `tools/postgresql/scripts/backup-db.sh`**

```bash
#!/bin/bash
# Backup Better Auth Database

set -e

# Source environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="backups/better_auth_db_${TIMESTAMP}.sql"

echo "Creating backup of Better Auth database..."

docker exec monorepo-postgres pg_dump \
    -U "${BETTER_AUTH_DB_USER}" \
    -d "${BETTER_AUTH_DB_NAME}" \
    > "${BACKUP_FILE}"

echo "Backup created successfully: ${BACKUP_FILE}"

# Compress the backup
gzip "${BACKUP_FILE}"
echo "Backup compressed: ${BACKUP_FILE}.gz"

# Keep only last 10 backups
ls -t backups/better_auth_db_*.sql.gz | tail -n +11 | xargs -r rm
echo "Cleaned up old backups (kept last 10)"
```

**File: `tools/postgresql/scripts/restore-db.sh`**

```bash
#!/bin/bash
# Restore Better Auth Database from backup

set -e

# Source environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Check if backup file is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <backup-file.sql.gz>"
    echo "Available backups:"
    ls -1 backups/better_auth_db_*.sql.gz 2>/dev/null || echo "No backups found"
    exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "${BACKUP_FILE}" ]; then
    echo "Error: Backup file not found: ${BACKUP_FILE}"
    exit 1
fi

echo "Restoring Better Auth database from ${BACKUP_FILE}..."

# Decompress if needed
if [[ "${BACKUP_FILE}" == *.gz ]]; then
    gunzip -k "${BACKUP_FILE}"
    BACKUP_FILE="${BACKUP_FILE%.gz}"
fi

# Drop existing database and recreate
docker exec -i monorepo-postgres psql \
    -U "${POSTGRES_USER}" \
    -c "DROP DATABASE IF EXISTS ${BETTER_AUTH_DB_NAME};"

docker exec -i monorepo-postgres psql \
    -U "${POSTGRES_USER}" \
    -c "CREATE DATABASE ${BETTER_AUTH_DB_NAME} OWNER ${BETTER_AUTH_DB_USER};"

# Restore the backup
docker exec -i monorepo-postgres psql \
    -U "${BETTER_AUTH_DB_USER}" \
    -d "${BETTER_AUTH_DB_NAME}" \
    < "${BACKUP_FILE}"

echo "Database restored successfully!"

# Clean up decompressed file if it was compressed
if [[ "$1" == *.gz ]]; then
    rm "${BACKUP_FILE}"
fi
```

Make scripts executable:

```bash
chmod +x tools/postgresql/scripts/*.sh
```

### 10. Documentation

**File: `tools/postgresql/README.md`**

```markdown
# PostgreSQL Database Infrastructure

This directory contains the PostgreSQL database infrastructure for the monorepo, including configuration for Better Auth and future databases.

## Quick Start

### 1. Initial Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your local settings
nano .env

# Start PostgreSQL container
npx nx start postgresql

# Verify PostgreSQL is running
docker ps | grep monorepo-postgres
```

### 2. Better Auth Database Setup

```bash
# Navigate to Better Auth database directory
cd better-auth-db

# Install Prisma dependencies
pnpm install

# Generate Prisma Client
pnpm run prisma:generate

# Initialize Prisma migrations (after Better Auth CLI generates schema)
pnpm run prisma:migrate

# Open Prisma Studio to view data
pnpm run prisma:studio
```

## Using Better Auth CLI

The Better Auth CLI will generate the complete database schema based on your Better Auth configuration.

```bash
# From better-auth-db directory
# Point to your auth service configuration
npx @better-auth/cli generate --config ../../../services/auth-service/src/auth.ts

# Apply migrations
npx @better-auth/cli migrate
```

## Available Nx Commands

```bash
# Start PostgreSQL
npx nx start postgresql

# Stop PostgreSQL
npx nx stop postgresql

# Restart PostgreSQL
npx nx restart postgresql

# View logs
npx nx logs postgresql

# Generate Prisma Client
npx nx prisma:generate postgresql

# Run Prisma migrations
npx nx prisma:migrate postgresql

# Open Prisma Studio
npx nx prisma:studio postgresql

# Generate Better Auth schema
npx nx better-auth:generate postgresql

# Backup database
npx nx backup postgresql

# Restore database (requires backup file path)
npx nx restore postgresql
```

## Database Access

### PostgreSQL

- **Host**: localhost
- **Port**: 5432
- **Database**: better_auth_db
- **User**: better_auth_user
- **Password**: (see .env file)

### pgAdmin

- **URL**: <http://localhost:5050>
- **Email**: (see .env file)
- **Password**: (see .env file)

## Connection String

```bash
DATABASE_URL="postgresql://better_auth_user:better_auth_password@localhost:5432/better_auth_db?schema=public"
```

## Backup and Restore

### Create Backup

```bash
npx nx backup postgresql
```

Backups are stored in `backups/` with timestamp.

### Restore from Backup

```bash
bash scripts/restore-db.sh backups/better_auth_db_YYYYMMDD_HHMMSS.sql.gz
```

## Production Deployment

For production deployment:

```bash
# Use production compose file
docker-compose -f docker-compose.yaml -f docker-compose.prod.yaml up -d

# Ensure environment variables are properly set
# Use strong passwords and secure connection strings
# Enable SSL/TLS for database connections
```

## Prisma Workflows

### Development

```bash
# Make schema changes in schema.prisma
# Generate migration
pnpm run prisma:migrate

# Apply to database
pnpm run prisma:migrate:deploy

# Regenerate Prisma Client
pnpm run prisma:generate
```

### Production

```bash
# Only apply migrations (don't create new ones)
pnpm run prisma:migrate:deploy
```

## Troubleshooting

### Container won't start

```bash
# Check logs
docker logs monorepo-postgres

# Verify ports are not in use
lsof -i :5432

# Reset and start fresh
npx nx stop postgresql
docker volume rm postgresql_postgres-data
npx nx start postgresql
```

### Connection refused

```bash
# Verify container is running
docker ps | grep monorepo-postgres

# Check health status
docker inspect monorepo-postgres | grep -A 10 Health

# Verify environment variables
cat .env
```

### Prisma Client issues

```bash
# Regenerate Prisma Client
cd better-auth-db
pnpm run prisma:generate

# If schema is out of sync
pnpm run prisma:push
```

## Security Considerations

- Never commit `.env` files
- Use strong passwords in production
- Enable SSL/TLS for production connections
- Restrict PostgreSQL port access (127.0.0.1 in production)
- Regularly backup production databases
- Rotate credentials periodically

## Directory Structure

```plaintext
postgresql/
├── docker-compose.yaml           # Local development config
├── docker-compose.prod.yaml      # Production overrides
├── .env.example                  # Environment template
├── .env                          # Local environment (gitignored)
├── .gitignore
├── README.md                     # This file
├── project.json                  # Nx configuration
├── init-scripts/                 # Database initialization
│   └── 01-create-databases.sql
├── backups/                      # Database backups
│   └── .gitkeep
├── scripts/                      # Utility scripts
│   ├── backup-db.sh
│   └── restore-db.sh
└── better-auth-db/               # Better Auth database
    ├── prisma/
    │   ├── schema.prisma
    │   └── migrations/
    ├── .env
    ├── package.json
    └── README.md
```

## Next Steps

1. Set up authentication service in `services/auth-service`
2. Configure Better Auth to use this Prisma setup
3. Run Better Auth CLI to generate complete schema
4. Create initial migration
5. Integrate with NestJS microservices

## References

- [Prisma Documentation](https://www.prisma.io/docs)
- [Better Auth Prisma Adapter](https://www.better-auth.com/docs/adapters/prisma)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

- - -

```markdown

**File: `tools/postgresql/better-auth-db/README.md`**

```

# Better Auth Database

PostgreSQL database with Prisma ORM configured for Better Auth.

## Initial Setup

```bash
# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env

# Ensure PostgreSQL is running
npx nx start postgresql

# Generate Prisma Client
pnpm run prisma:generate
```

## Prisma Commands

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

## Implementation Steps

### Phase 1: Infrastructure Setup (Day 1)

1. **Create Directory Structure**

   ```bash
   mkdir -p tools/postgresql/{init-scripts,backups,scripts,better-auth-db/prisma}
   ```

2. **Create Configuration Files**
   - Create `docker-compose.yaml` and `docker-compose.prod.yaml`
   - Create `.env.example` and initialize `.env`
   - Create `project.json` for Nx integration
   - Create `.gitignore`

3. **Create Initialization Script**
   - Create `init-scripts/01-create-databases.sql`

4. **Start PostgreSQL Container**

   ```bash
   cd tools/postgresql
   docker-compose up -d
   docker logs -f monorepo-postgres
   ```

5. **Verify Database Creation**

   ```bash
   docker exec -it monorepo-postgres psql -U postgres -c "\l"
   docker exec -it monorepo-postgres psql -U postgres -d better_auth_db -c "\dt"
   ```

### Phase 2: Prisma Setup (Day 1-2)

1. **Initialize Prisma Package**

   ```bash
   cd tools/postgresql/better-auth-db
   # Create package.json (use content from section 6 above)
   pnpm install
   ```

2. **Create Prisma Schema**
   - Create `prisma/schema.prisma` (use content from section 5)
   - Create `.env` with DATABASE_URL

3. **Generate Prisma Client**

   ```bash
   pnpm run prisma:generate
   ```

4. **Create Initial Migration**

   ```bash
   pnpm run prisma:migrate
   # Name: "init"
   ```

5. **Test Prisma Studio**

   ```bash
   pnpm run prisma:studio
   # Open http://localhost:5555
   ```

### Phase 3: Better Auth Integration (Day 2-3)

1. **Install Better Auth CLI**

   ```bash
   pnpm add -D @better-auth/cli -w
   ```

2. **Create Auth Service Stub** (if not exists)

   ```bash
   npx nx g @nx/nest:app auth-service
   ```

3. **Configure Better Auth Instance**
   - Create basic Better Auth configuration in auth service
   - Point to Prisma adapter

4. **Generate Better Auth Schema**

   ```bash
   cd tools/postgresql/better-auth-db
   npx @better-auth/cli generate --config ../../../services/auth-service/src/auth.ts
   ```

5. **Apply Schema Updates**

   ```bash
   pnpm run prisma:migrate
   # Name: "better-auth-schema"
   ```

### Phase 4: Scripts and Automation (Day 3)

1. **Create Backup Script**
   - Create `scripts/backup-db.sh` (use content from section 9)
   - Make executable: `chmod +x scripts/backup-db.sh`

2. **Create Restore Script**
   - Create `scripts/restore-db.sh`
   - Make executable: `chmod +x scripts/restore-db.sh`

3. **Test Backup/Restore**

   ```bash
   npx nx backup postgresql
   ls -lh backups/
   # Test restore with created backup
   ```

4. **Add Nx Commands**
   - Verify all Nx commands work as expected

   ```bash
   npx nx start postgresql
   npx nx logs postgresql
   npx nx prisma:studio postgresql
   ```

### Phase 5: Documentation and Testing (Day 3-4)

1. **Create Documentation**
   - Create `README.md` files (use content from section 10)
   - Document connection strings
   - Add troubleshooting guide

2. **Test Complete Workflow**
   - Fresh start from empty state
   - Run through all commands
   - Verify data persistence

3. **Create Seed Data** (optional)

   ```bash
   # Create seeds/seed.js with sample data
   pnpm run db:seed
   ```

4. **Update Monorepo Documentation**
   - Update `AGENTS.md` with PostgreSQL setup
   - Update root `README.md` if needed

### Phase 6: Integration with Services (Day 4-5)

1. **Install Prisma Client in Services**

   ```bash
   # In auth-service or email-microservice
   pnpm add @prisma/client
   ```

2. **Configure Prisma Client Path**
   - Update imports to use generated client
   - Set up proper client initialization

3. **Add Database Connection to Services**
   - Configure environment variables
   - Test connection from NestJS service

4. **Create Database Module**
   - Wrap Prisma Client in NestJS module
   - Provide as global service

## Validation and Testing

### Automated Tests

```bash
# Test database connectivity
docker exec monorepo-postgres pg_isready -U postgres

# Test Prisma client generation
cd tools/postgresql/better-auth-db
pnpm run prisma:generate

# Verify schema matches database
pnpm run prisma:validate
```

### Manual Verification Checklist

- [ ] PostgreSQL container starts successfully
- [ ] Database `better_auth_db` is created
- [ ] User `better_auth_user` has correct permissions
- [ ] pgAdmin is accessible at <http://localhost:5050>
- [ ] Prisma Client generates without errors
- [ ] Prisma Studio opens and displays tables
- [ ] Backup script creates valid backup files
- [ ] Restore script successfully restores database
- [ ] All Nx commands execute without errors
- [ ] Connection from NestJS service works
- [ ] Better Auth CLI generates schema correctly

## Security Checklist

- [ ] `.env` files are in `.gitignore`
- [ ] `.env.example` contains no secrets
- [ ] Strong passwords used (minimum 16 characters)
- [ ] PostgreSQL port bound to localhost in production
- [ ] SSL/TLS enabled for production connections
- [ ] Database user has minimal required permissions
- [ ] Backup files are excluded from version control
- [ ] Connection strings use environment variables

## Performance Considerations

1. **Connection Pooling**
   - Configure Prisma connection pool size

   ```typescript
   const prisma = new PrismaClient({
     datasources: {
       db: {
         url: process.env.DATABASE_URL,
       },
     },
     // Connection pool config
     log: ['query', 'error', 'warn'],
   });
   ```

2. **Indexes**
   - Add indexes for frequently queried fields
   - Email, userId, token fields should be indexed

3. **Query Optimization**
   - Use Prisma's `select` to fetch only needed fields
   - Implement pagination for large result sets

## Maintenance Tasks

### Daily

- Monitor container health
- Check available disk space for volumes

### Weekly

- Review database logs for errors
- Test backup and restore process
- Check for Prisma/PostgreSQL updates

### Monthly

- Rotate database credentials
- Review and optimize slow queries
- Clean up old backups

## Troubleshooting Guide

### Issue: Container fails to start

**Symptoms**: `docker-compose up` fails

**Solutions**:

1. Check if port 5432 is already in use

   ```bash
   lsof -i :5432
   ```

2. Verify Docker daemon is running
3. Check Docker logs: `docker logs monorepo-postgres`
4. Remove old volumes: `docker volume prune`

### Issue: Prisma can't connect to database

**Symptoms**: `Error: P1001: Can't reach database server`

**Solutions**:

1. Verify PostgreSQL is running: `docker ps`
2. Check DATABASE_URL in `.env`
3. Verify network connectivity
4. Check PostgreSQL logs

### Issue: Migration fails

**Symptoms**: Prisma migration errors

**Solutions**:

1. Check database permissions
2. Verify schema.prisma syntax
3. Run `prisma:validate`
4. Reset database if needed (dev only): `prisma:reset`

### Issue: Better Auth CLI fails

**Symptoms**: Schema generation fails

**Solutions**:

1. Verify Better Auth config path is correct
2. Check that auth service is properly configured
3. Ensure all Better Auth dependencies are installed
4. Review Better Auth documentation for configuration

## Future Enhancements

1. **Multi-Database Support**
   - Add additional databases as needed
   - Create templates for new database setup

2. **Monitoring**
   - Integrate with Prometheus for metrics
   - Set up Grafana dashboards
   - Add alerting for critical issues

3. **Replication**
   - Set up read replicas for scaling
   - Configure replication lag monitoring

4. **Migration Management**
   - Automated migration deployment
   - Rollback capabilities
   - Migration testing in CI/CD

5. **Data Retention**
   - Implement data archiving strategy
   - Set up automated cleanup jobs
   - GDPR compliance for user data

## References

- [Prisma Documentation](https://www.prisma.io/docs)
- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Better Auth Prisma Adapter](https://www.better-auth.com/docs/adapters/prisma)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Nx Documentation](https://nx.dev/docs)

## Related Documentation

- [Better Auth Setup Guide](../../services/auth-service/README.md)
- [Database Architecture](../../docs/monorepo/architecture/decisions/adr-NNNN-postgresql-prisma-setup.md)
- [Authentication Epic](../../docs/monorepo/epics/centralized-authentication/epic.md)

## Support

For issues or questions:

1. Check this documentation
2. Review Better Auth documentation
3. Check Prisma documentation
4. Review PostgreSQL logs
5. Consult the team

- - -

**Last Updated**: 2025-10-13
**Author**: AI Assistant
**Version**: 1.0.0
