import express from "express";
import prisma from "../config/db.js";
import { protect } from "../middlewares/auth.middleware.js";
import { formatPrismaError } from "../utils/error.js";

const router = express.Router();

/* ===============================
   GET CONTACT PAGE (PUBLIC)
================================ */
router.get("/", async (_req, res) => {
  try {
    const page = await prisma.contactPage.findUnique({
      where: { id: "contact" },
    });

    res.json(page);
  } catch (err) {
    console.error("GET /contact-page error:", err);

    res.status(500).json({
      error: "Failed to fetch contact page",
      details: formatPrismaError(err),
    });
  }
});

/* ===============================
   UPDATE CONTACT PAGE (ADMIN)
================================ */
router.put("/", protect, async (req, res) => {
  const data = req.body;

  const page = await prisma.contactPage.upsert({
    where: { id: "contact" },
    update: data,
    create: { id: "contact", ...data },
  });

  res.json(page);
});

export default router;
