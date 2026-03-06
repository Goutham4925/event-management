import app from "./app.js";
import cron from "node-cron";
import prisma from "./config/db.js";

const PORT = process.env.PORT || 10000;

/* ================= SERVER START ================= */

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

/* ================= DB KEEP ALIVE ================= */
/* Runs every 10 minutes to prevent Aiven free DB cold start */

cron.schedule("*/10 * * * *", async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    // console.log("🟢 Database keep-alive ping sent");
  } catch (error) {
    // console.error("🔴 Keep-alive error:", error.message);
  }
});