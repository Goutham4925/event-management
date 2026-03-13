import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import eventRoutes from "./routes/events.routes.js";
import galleryRoutes from "./routes/gallery.routes.js";
import testimonialRoutes from "./routes/testimonials.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import statsRoutes from "./routes/stats.routes.js";
import userRoutes from "./routes/users.routes.js";
import aboutRoutes from "./routes/about.route.js";
import contactRoutes from "./routes/contact.route.js";
import contactPageRoutes from "./routes/contactPage.route.js";
import categoryRoutes from "./routes/categories.route.js";
import pageHeroRoutes from "./routes/pageHero.route.js";
import prisma from "./config/db.js";

dotenv.config();

const app = express();

/* ================= CORS ================= */
const allowedOrigins = [
  "https://event-management-okn1.vercel.app",
  "https://blackbellproductions.com",
  "https://www.blackbellproductions.com",
  "http://localhost:5173",
  "http://localhost:3001",
  "http://localhost:8080",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
/* ======================================= */

/* ================= MIDDLEWARE ================= */
app.use(express.json());
/* ============================================== */


/* ================= ROOT ROUTE ================= */
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    service: "Black Bell Productions API",
    message: "API is running",
    endpoints: [
      "/api/events",
      "/api/settings",
      "/api/categories",
      "/api/gallery",
      "/api/testimonials",
      "/api/stats",
      "/api/contact",
      "/api/contact-page",
      "/api/about",
    ],
  });
});
/* ============================================= */


/* ================= API ROUTES ================= */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/contact-page", contactPageRoutes);
app.use("/api/page-hero", pageHeroRoutes);
/* ============================================= */


/* ================= HEALTH CHECK ================= */
app.get("/api/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: "OK",
      database: "awake",
      service: "Black Bell Productions API",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});
/* =============================================== */


/* ================= 404 HANDLER ================= */
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});
/* =============================================== */


export default app;