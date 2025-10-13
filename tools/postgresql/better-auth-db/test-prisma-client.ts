// Prisma Client Import Test
// This file verifies that the Prisma Client can be imported correctly

import { PrismaClient } from './prisma/generated/client';

console.log('✓ Prisma Client imported successfully');

const prisma = new PrismaClient();

console.log('✓ Prisma Client instance created');
console.log('Available models:', Object.keys(prisma));

// Export for use in services
export { PrismaClient } from './prisma/generated/client';
export const prismaClient = prisma;
