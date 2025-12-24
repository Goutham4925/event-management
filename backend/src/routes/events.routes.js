import express from "express";
import prisma from "../config/db.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  const events = await prisma.event.findMany({
    include: { gallery: true },
    orderBy: { createdAt: "desc" }
  });
  res.json(events);
});

router.post("/", protect, async (req, res) => {
  const event = await prisma.event.create({ data: req.body });
  res.json(event);
});

router.put("/:id", protect, async (req, res) => {
  const event = await prisma.event.update({
    where: { id: req.params.id },
    data: req.body
  });
  res.json(event);
});

router.delete("/:id", protect, async (req, res) => {
  await prisma.event.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

export default router;
