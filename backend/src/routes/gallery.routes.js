import express from "express";
import prisma from "../config/db.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  const images = await prisma.galleryImage.findMany();
  res.json(images);
});

router.post("/", protect, async (req, res) => {
  const image = await prisma.galleryImage.create({ data: req.body });
  res.json(image);
});

router.delete("/:id", protect, async (req, res) => {
  await prisma.galleryImage.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

export default router;
