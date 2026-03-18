import { PrismaClient } from '@prisma/client';
import { isProduction } from '../config/env.js';

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma || new PrismaClient({
    log: isProduction ? ['error'] : ['query', 'info', 'warn', 'error']
});

if (!isProduction) {
    globalForPrisma.prisma = prisma;
}
