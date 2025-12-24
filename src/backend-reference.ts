// Backend folder structure reference
// This file documents the Node.js + Express backend structure you requested.
// Lovable runs React frontend only - use this as a reference for your backend setup.

/*
backend/
├── src/
│   ├── app.js              # Express app configuration
│   ├── server.js           # Server entry point
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── events.routes.js
│   │   ├── gallery.routes.js
│   │   ├── testimonials.routes.js
│   │   └── settings.routes.js
│   ├── controllers/        # Business logic (implement later)
│   ├── middlewares/
│   │   └── auth.middleware.js
│   ├── prisma/
│   │   └── schema.prisma
│   └── config/
│       └── db.js
├── .env.example
└── package.json

--- PRISMA SCHEMA (prisma/schema.prisma) ---

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Admin {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
}

model Event {
  id          String   @id @default(cuid())
  title       String
  description String
  category    String
  date        DateTime
  coverImage  String
  client      String
  gallery     GalleryImage[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model GalleryImage {
  id       String  @id @default(cuid())
  imageUrl String
  eventId  String?
  event    Event?  @relation(fields: [eventId], references: [id])
}

model Testimonial {
  id      String @id @default(cuid())
  name    String
  role    String
  message String
}

model SiteSettings {
  id           String @id @default("settings")
  heroTitle    String
  heroSubtitle String
  aboutText    String
  contactEmail String
  contactPhone String
  address      String
  socialLinks  Json
}

--- .env.example ---

DATABASE_URL="postgresql://user:password@host:5432/dbname"
JWT_SECRET="your-jwt-secret-here"
PORT=3001

*/

export const backendStructure = {
  note: "See comments above for full backend structure and Prisma schema",
};
