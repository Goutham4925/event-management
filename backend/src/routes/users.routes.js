import express from "express";
import prisma from "../config/db.js";
import { protect } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/admin.middleware.js";

const router = express.Router();

/* ===============================
   GET ALL USERS (ADMIN)
================================ */
router.get("/", protect, requireAdmin, async (_req, res) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });
  res.json(users);
});

/* ===============================
   APPROVE USER
================================ */
router.put("/:id/approve", protect, requireAdmin, async (req, res) => {
  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { status: "APPROVED" },
  });
  res.json(user);
});

/* ===============================
   BLOCK USER
================================ */
router.put("/:id/block", protect, requireAdmin, async (req, res) => {
  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { status: "BLOCKED" },
  });
  res.json(user);
});

/* ===============================
   PROMOTE TO ADMIN
================================ */
router.put("/:id/promote", protect, requireAdmin, async (req, res) => {
  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { role: "ADMIN" },
  });
  res.json(user);
});


/* ===============================
   UNBLOCK USER
================================ */
router.put("/:id/unblock", protect, requireAdmin, async (req, res) => {
  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { status: "APPROVED" },
  });
  res.json(user);
});

/* ===============================
   DELETE USER (ADMIN)
================================ */
router.delete("/:id", protect, requireAdmin, async (req, res) => {
  try {
    // req.user is set by protect middleware
    if (req.user.id === req.params.id) {
      return res.status(400).json({
        error: "You cannot delete your own account",
      });
    }

    await prisma.user.delete({
      where: { id: req.params.id },
    });

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE USER error:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
});


/* ===============================
   DELETE USER
================================ */
router.delete("/:id", protect, requireAdmin, async (req, res) => {
  await prisma.user.delete({
    where: { id: req.params.id },
  });
  res.json({ success: true });
});


export default router;
