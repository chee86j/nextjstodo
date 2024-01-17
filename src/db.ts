/* What we are doing belowing is to make sure we only have one 
instance of Prisma Client in our application. We are doing this
by creating a global variable and assigning the Prisma Client to
it. We are also checking if the global variable already has a
Prisma Client assigned to it. If it does, we will use that one
instead of creating a new one.
*/
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as {
    prisma: PrismaClient | undefined
}

export const prisma = 
    globalForPrisma.prisma ??
    new PrismaClient({
        log: ['query'],
    })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma