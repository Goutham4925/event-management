import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["error"],
  });

// Always cache the Prisma instance
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma;
}

export default prisma;