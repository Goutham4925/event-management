import express from "express";
import prisma from "../config/db.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  const testimonials = await prisma.testimonial.findMany();
  res.json(testimonials);
});

router.post("/", protect, async (req, res) => {
  const testimonial = await prisma.testimonial.create({ data: req.body });
  res.json(testimonial);
});

router.delete("/:id", protect, async (req, res) => {
  await prisma.testimonial.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

export default router;
