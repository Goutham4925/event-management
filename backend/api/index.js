import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "../routes/auth.routes.js";
import eventRoutes from "../routes/events.routes.js";
import galleryRoutes from "../routes/gallery.routes.js";
import testimonialRoutes from "../routes/testimonials.routes.js";
import settingsRoutes from "../routes/settings.routes.js";
import statsRoutes from "../routes/stats.routes.js";
import userRoutes from "../routes/users.routes.js";
import aboutRoutes from "../routes/about.route.js";
import contactRoutes from "../routes/contact.route.js";
import contactPageRoutes from "../routes/contactPage.route.js";
import categoryRoutes from "../routes/categories.route.js";
import pageHeroRoutes from "../routes/pageHero.route.js";

dotenv.config();

const app = express();

/* ================= CORS ================= */
const allowedOrigins = [
  "https://event-management-okn1.vercel.app",
  "http://localhost:5173"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow server-to-server / Postman
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.options("*", cors());
/* ======================================= */

app.use(express.json());

/* ============== ROUTES ============== */
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
/* ==================================== */

/* Health Check */
app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "OK" });
});

/* Global Error Handler (prevents silent 500 crashes) */
app.use((err, req, res, _next) => {
  console.error("Server Error:", err);
  res.status(500).json({
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

/* ===== SERVERLESS EXPORT ===== */
const handler = serverless(app);
export { handler };
export default handler;
