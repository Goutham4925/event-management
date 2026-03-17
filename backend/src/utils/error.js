import { Prisma } from "@prisma/client";

export function formatPrismaError(error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return {
      type: "prisma_known",
      code: error.code,
      message: error.message,
      meta: error.meta ?? null,
    };
  }

  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    return {
      type: "prisma_unknown",
      message: error.message,
    };
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return {
      type: "prisma_init",
      message: error.message,
    };
  }

  if (error instanceof Prisma.PrismaClientRustPanicError) {
    return {
      type: "prisma_panic",
      message: error.message,
    };
  }

  return {
    type: "unknown",
    message: error instanceof Error ? error.message : String(error),
  };
}
