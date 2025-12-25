import express from "express";
import prisma from "../config/db.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ===============================
   GET ALL EVENTS (PUBLIC)
================================ */
router.get("/", async (_req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: { gallery: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(events);
  } catch (err) {
    console.error("GET /events error:", err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

/* ===============================
   CREATE EVENT (ADMIN)
================================ */
router.post("/", protect, async (req, res) => {
  try {
    const event = await prisma.event.create({
      data: req.body,
    });
    res.json(event);
  } catch (err) {
    console.error("POST /events error:", err);
    res.status(500).json({ error: "Failed to create event" });
  }
});

/* ===============================
   UPDATE EVENT (ADMIN)
================================ */
router.put("/:id", protect, async (req, res) => {
  try {
    const event = await prisma.event.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(event);
  } catch (err) {
    console.error("PUT /events error:", err);
    res.status(500).json({ error: "Failed to update event" });
  }
});

/* ===============================
   DELETE EVENT (ADMIN)
================================ */
router.delete("/:id", protect, async (req, res) => {
  try {
    await prisma.event.delete({
      where: { id: req.params.id },
    });
    res.json({ success: true });
  } catch (err) {
    console.error("DELETE /events error:", err);
    res.status(500).json({ error: "Failed to delete event" });
  }
});

export default router;
