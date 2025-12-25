import express from "express";
import prisma from "../config/db.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ===============================
   GET TESTIMONIALS
   ?featured=true → homepage
================================ */
router.get("/", async (req, res) => {
  const { featured } = req.query;

  const testimonials = await prisma.testimonial.findMany({
    where: featured === "true" ? { featured: true } : undefined,
    orderBy: { createdAt: "desc" },
  });

  res.json(testimonials);
});

/* ===============================
   CREATE (ADMIN)
================================ */
router.post("/", protect, async (req, res) => {
  const testimonial = await prisma.testimonial.create({
    data: {
      name: req.body.name,
      role: req.body.role,
      message: req.body.message,
      rating: req.body.rating ?? null,
      featured: req.body.featured ?? false,
    },
  });

  res.json(testimonial);
});

/* ===============================
   UPDATE (ADMIN)
================================ */
router.put("/:id", protect, async (req, res) => {
  const testimonial = await prisma.testimonial.update({
    where: { id: req.params.id },
    data: {
      name: req.body.name,
      role: req.body.role,
      message: req.body.message,
      rating: req.body.rating ?? null,
      featured: req.body.featured ?? false,
    },
  });

  res.json(testimonial);
});

/* ===============================
   DELETE (ADMIN)
================================ */
router.delete("/:id", protect, async (req, res) => {
  await prisma.testimonial.delete({
    where: { id: req.params.id },
  });

  res.json({ success: true });
});

export default router;