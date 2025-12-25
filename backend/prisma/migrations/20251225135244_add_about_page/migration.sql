-- CreateTable
CREATE TABLE "AboutPage" (
    "id" TEXT NOT NULL DEFAULT 'about',
    "heroTitle" TEXT NOT NULL,
    "heroSubtitle" TEXT NOT NULL,
    "storyTitle" TEXT,
    "storyContent" TEXT,
    "vision" TEXT,
    "mission" TEXT,
    "yearsExperience" INTEGER,
    "heroImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutPage_pkey" PRIMARY KEY ("id")
);
