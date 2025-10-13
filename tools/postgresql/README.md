# PostgreSQL Database Infrastructure

This directory contains the PostgreSQL database infrastructure for the monorepo, including configuration for Better Auth and future databases.

## Implementation Status

✅ **Phase 1: Infrastructure Setup - COMPLETE**

- PostgreSQL 16-alpine container running and healthy
- Database `better_auth_db` created successfully
- User `better_auth_user` configured with full permissions
- Extensions `uuid-ossp` and `pgcrypto` installed
- Nx project configuration with 10 targets operational
- Docker Compose configuration tested and working

✅ **Phase 2: Prisma Setup - COMPLETE**

- Prisma dependencies installed at monorepo root (@prisma/client, prisma)
- Prisma schema created with Better Auth models (User, Account, Session, Verification)
- Prisma Client generated to `./prisma/generated/client`
- Initial migration created and applied successfully
- Database tables created and verified
- Prisma Studio tested and operational (<http://localhost:5555>)

✅ **Phase 3: Better Auth Integration - COMPLETE**

- Better Auth packages installed (better-auth v1.3.27, @better-auth/cli v1.3.27)
- NestJS authentication microservice created: `services/my-nest-js-auth-microservice`
- Better Auth configuration with Prisma adapter completed
- Better Auth CLI schema generation successful
- Authentication endpoints exposed at `/api/auth/*`
- Service documentation and README created

⚠️ **Known Issue**: pgAdmin container experiencing restart loop (non-blocking, PostgreSQL fully functional)

🔄 **Next Phase**: Phase 4 - Scripts and Automation

## Quick Start

### 1. Initial Setup

```bash
# Copy environment template (already done during Phase 1 setup)
# Edit .env with your settings if needed
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

# Install Prisma dependencies (Phase 2)
pnpm install

# Generate Prisma Client (Phase 2)
pnpm run prisma:generate

# Initialize Prisma migrations (Phase 2 - after Better Auth CLI generates schema)
pnpm run prisma:migrate

# Open Prisma Studio to view data (Phase 2)
pnpm run prisma:studio
```

## Using Better Auth CLI

The Better Auth CLI will generate the complete database schema based on your Better Auth configuration.

```bash
# From better-auth-db directory (Phase 3)
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

# Generate Prisma Client (Phase 2+)
npx nx prisma:generate postgresql

# Run Prisma migrations (Phase 2+)
npx nx prisma:migrate postgresql

# Open Prisma Studio (Phase 2+)
npx nx prisma:studio postgresql

# Generate Better Auth schema (Phase 3+)
npx nx better-auth:generate postgresql

# Backup database (Phase 4+)
npx nx backup postgresql

# Restore database (Phase 4+)
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

## Implementation Status

- ✅ **Phase 1: Infrastructure Setup (COMPLETED)**
  - Directory structure created
  - Docker Compose configuration
  - Environment files
  - Nx project configuration
  - Database initialization script

- ⏳ **Phase 2: Prisma Setup (PENDING)**
  - Prisma package initialization
  - Schema creation
  - Client generation

- ⏳ **Phase 3: Better Auth Integration (PENDING)**
  - Better Auth CLI installation
  - Schema generation

- ⏳ **Phase 4: Scripts and Automation (PENDING)**
  - Backup/restore scripts

- ⏳ **Phase 5: Documentation and Testing (PENDING)**
- ⏳ **Phase 6: Integration with Services (PENDING)**

## Next Steps

1. Complete Phase 2: Set up Prisma ORM
2. Complete Phase 3: Integrate Better Auth CLI
3. Complete Phase 4: Create backup/restore scripts
4. Set up authentication service in `services/auth-service`
5. Run Better Auth CLI to generate complete schema
6. Create initial migration
7. Integrate with NestJS microservices

## References

- [Prisma Documentation](https://www.prisma.io/docs)
- [Better Auth Prisma Adapter](https://www.better-auth.com/docs/adapters/prisma)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Implementation Plan](../../docs/tools/postgresql/features/better-auth-database/implementation-plan.md)

## Support

For issues or questions:

1. Check this documentation
2. Review implementation plan
3. Review Better Auth documentation
4. Check Prisma documentation
5. Review PostgreSQL logs
6. Consult the team

---

**Last Updated**: 2025-10-13
**Phase**: 1 - Infrastructure Setup Complete
**Version**: 1.0.0
