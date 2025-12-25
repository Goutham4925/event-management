-- CreateTable
CREATE TABLE "ContactPage" (
    "id" TEXT NOT NULL DEFAULT 'contact',
    "badge" TEXT,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "eventTypes" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactPage_pkey" PRIMARY KEY ("id")
);
