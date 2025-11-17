/*
 * Maintain a single Prisma Client instance across hot reloads to prevent
 * exhausting database connections during development.
 */
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    ...(process.env.NODE_ENV === 'development' ? { log: ['query'] } : {}),
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
