# PostgreSQL Quick Reference

## Status: Phase 1 Complete ✅

## Quick Commands

### Container Management

```bash
npx nx start postgresql      # Start PostgreSQL + pgAdmin
npx nx stop postgresql       # Stop containers
npx nx restart postgresql    # Restart containers
npx nx logs postgresql       # View PostgreSQL logs
```

### Database Access

```bash
# Direct psql access
docker exec -it monorepo-postgres psql -U better_auth_user -d better_auth_db

# List databases
docker exec monorepo-postgres psql -U postgres -c "\l"

# List tables (after Phase 2)
docker exec monorepo-postgres psql -U better_auth_user -d better_auth_db -c "\dt"

# Check extensions
docker exec monorepo-postgres psql -U postgres -d better_auth_db -c "\dx"
```

### Connection Info

```
Host:     localhost
Port:     5432
Database: better_auth_db
User:     better_auth_user
Password: See .env file

Connection String:
postgresql://better_auth_user:better_auth_password@localhost:5432/better_auth_db?schema=public
```

### Prisma Commands (Phase 2+)

```bash
npx nx prisma:generate postgresql   # Generate Prisma Client
npx nx prisma:migrate postgresql    # Run migrations
npx nx prisma:studio postgresql     # Open Prisma Studio (http://localhost:5555)
```

### Better Auth Commands (Phase 3+)

```bash
npx nx better-auth:generate postgresql  # Generate Better Auth schema
```

### Backup/Restore (Phase 4)

```bash
npx nx backup postgresql            # Create backup
npx nx restore postgresql           # Restore from backup
```

## File Locations

```
tools/postgresql/
├── .env                          # Local environment (DO NOT COMMIT)
├── .env.example                  # Environment template
├── docker-compose.yaml           # Main Docker config
├── docker-compose.prod.yaml      # Production overrides
├── project.json                  # Nx configuration
├── README.md                     # Full documentation
├── PHASE1-COMPLETE.md            # Phase 1 summary
├── init-scripts/
│   └── 01-create-databases.sql   # DB initialization script
└── better-auth-db/               # Ready for Phase 2
    └── prisma/                   # Prisma setup (Phase 2)
```

## Current Status

✅ **Completed**: Phase 1 - Infrastructure Setup

- PostgreSQL 16-alpine running
- Database: better_auth_db created
- User: better_auth_user configured
- Extensions: uuid-ossp, pgcrypto installed
- Nx integration: 10 targets available

🔄 **Next**: Phase 2 - Prisma Setup

- Create better-auth-db/package.json
- Install Prisma dependencies
- Create schema.prisma
- Generate Prisma Client
- Create initial migration

⚠️ **Known Issues**: pgAdmin restarting (non-blocking)

## Health Check

```bash
# Verify PostgreSQL is healthy
docker exec monorepo-postgres pg_isready -U postgres

# Expected output: /var/run/postgresql:5432 - accepting connections
```

## Troubleshooting

### Container not running?

```bash
docker ps -a | grep monorepo-postgres
docker logs monorepo-postgres
```

### Can't connect?

```bash
# Check environment variables
cat tools/postgresql/.env

# Verify port is open
netstat -an | grep 5432
```

### Reset everything

```bash
npx nx stop postgresql
docker volume rm postgresql_postgres-data
npx nx start postgresql
```

## Documentation

- **Full Setup**: [README.md](./README.md)
- **Phase 1 Complete**: [PHASE1-COMPLETE.md](./PHASE1-COMPLETE.md)
- **Implementation Plan**: [docs/tools/postgresql/features/better-auth-database/implementation-plan.md](../../docs/tools/postgresql/features/better-auth-database/implementation-plan.md)

## Support

Issues? Check:

1. Container status: `docker ps | grep postgres`
2. Logs: `npx nx logs postgresql`
3. Environment: `cat .env`
4. Documentation: README.md

---

**Last Updated**: October 13, 2025
**Phase**: 1 of 6 Complete
