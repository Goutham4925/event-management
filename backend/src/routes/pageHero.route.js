import express from "express";
import prisma from "../config/db.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ===============================
   GET HERO (PUBLIC)
   /api/page-hero/:id
================================ */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const hero = await prisma.pageHero.upsert({
    where: { id },
    update: {},
    create: {
      id,
      badge: "Our Portfolio",
      title: "Events We’ve Crafted",
      subtitle: "Explore our curated experiences",
    },
  });

  res.json(hero);
});

/* ===============================
   UPSERT HERO (ADMIN)
================================ */
router.put("/:id", protect, async (req, res) => {
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
});

export default router;
