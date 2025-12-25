import express from "express";
import prisma from "../config/db.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ===============================
   CREATE MESSAGE (PUBLIC)
================================ */
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, eventType, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        error: "Name, email, and message are required",
      });
    }

    const contact = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        eventType: eventType || null,
        message,
      },
    });

    return res.status(201).json({
      success: true,
      contact,
    });
  } catch (err) {
    console.error("CONTACT CREATE ERROR:", err);
    return res.status(500).json({
      error: "Failed to submit contact message",
    });
  }
});

/* ===============================
   GET ALL MESSAGES (ADMIN)
================================ */
router.get("/", protect, async (_req, res) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });

    return res.json(messages);
  } catch (err) {
    console.error("CONTACT FETCH ERROR:", err);
    return res.status(500).json({
      error: "Failed to fetch contact messages",
    });
  }
});

/* ===============================
   UPDATE STATUS (ADMIN)
================================ */
router.put("/:id/status", protect, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["NEW", "READ", "REPLIED"].includes(status)) {
      return res.status(400).json({
        error: "Invalid status value",
      });
    }

    const updated = await prisma.contactMessage.update({
      where: { id: req.params.id },
      data: { status },
    });

    return res.json(updated);
  } catch (err) {
    console.error("CONTACT STATUS UPDATE ERROR:", err);
    return res.status(500).json({
      error: "Failed to update message status",
    });
  }
});

/* ===============================
   DELETE MESSAGE (ADMIN)
================================ */
router.delete("/:id", protect, async (req, res) => {
  try {
    await prisma.contactMessage.delete({
      where: { id: req.params.id },
    });

    return res.json({ success: true });
  } catch (err) {
    console.error("CONTACT DELETE ERROR:", err);
    return res.status(500).json({
      error: "Failed to delete message",
    });
  }
});

export default router;
