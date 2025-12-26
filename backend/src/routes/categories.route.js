import express from "express";
import prisma from "../config/db.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ===============================
   GET ALL CATEGORIES (PUBLIC)
================================ */
router.get("/", async (_req, res) => {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
  });
  res.json(categories);
});

/* ===============================
   CREATE CATEGORY (ADMIN)
================================ */
router.post("/", protect, async (req, res) => {
  const { name, order } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Category name is required" });
  }

  const slug = name.toLowerCase().replace(/\s+/g, "-");

  const category = await prisma.category.create({
    data: { name, slug, order },
  });

  res.json(category);
});

/* ===============================
   UPDATE CATEGORY (ADMIN)
================================ */
router.put("/:id", protect, async (req, res) => {
  const { name, order } = req.body;

  const slug = name?.toLowerCase().replace(/\s+/g, "-");

  const category = await prisma.category.update({
    where: { id: req.params.id },
    data: {
      name,
      slug,
      order,
    },
  });

  res.json(category);
});

/* ===============================
   DELETE CATEGORY (ADMIN)
================================ */
router.delete("/:id", protect, async (req, res) => {
  await prisma.category.delete({
    where: { id: req.params.id },
  });

  res.json({ success: true });
});

export default router;
