import express from "express";
import prisma from "../config/db.js";
import { protect } from "../middlewares/auth.middleware.js";
import { formatPrismaError } from "../utils/error.js";

const router = express.Router();

/* ===============================
   GET HERO (PUBLIC)
   /api/page-hero/:id
================================ */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const hero = await prisma.pageHero.upsert({
      where: { id },
      update: {},
      create: {
        id,
        badge: "Our Portfolio",
        title: "Events We've Crafted",
        subtitle: "Explore our curated experiences",
      },
    });

    res.json(hero);
  } catch (err) {
    console.error("GET /page-hero/:id error:", err);

    res.status(500).json({
      error: "Failed to fetch page hero",
      details: formatPrismaError(err),
    });
  }
});

/* ===============================
   UPSERT HERO (ADMIN)
================================ */
router.put("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;

    const hero = await prisma.pageHero.upsert({
      where: { id },
      update: req.body,
      create: {
        id,
        ...req.body,
      },
    });

    res.json(hero);
  } catch (err) {
    console.error("PUT /page-hero/:id error:", err);

    res.status(500).json({
      error: "Failed to update page hero",
      details: formatPrismaError(err),
    });
  }
});

export default router;
