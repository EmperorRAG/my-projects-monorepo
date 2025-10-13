-- Create Better Auth Database
CREATE DATABASE better_auth_db;

-- Create dedicated user for Better Auth with CREATEDB permission (needed for Prisma shadow database)
CREATE USER better_auth_user WITH PASSWORD 'better_auth_password' CREATEDB;

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
