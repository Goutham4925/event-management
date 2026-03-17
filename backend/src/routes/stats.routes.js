import express from "express";
import prisma from "../../prisma/client.js";
import { formatPrismaError } from "../utils/error.js";

const router = express.Router();

/* ================= GET ================= */
router.get("/", async (req, res) => {
  try {
    const { page } = req.query;

    const stats = await prisma.stat.findMany({
      where: page ? { page } : undefined,
      orderBy: { order: "asc" },
    });

    res.json(stats);
  } catch (err) {
    console.error("GET /stats error:", err);

    res.status(500).json({
      error: "Failed to fetch stats",
      details: formatPrismaError(err),
    });
  }
});

/* ================= CREATE ================= */
router.post("/", async (req, res) => {
  const { label, value, page } = req.body;

  const stat = await prisma.stat.create({
    data: { label, value, page, order: 0 },
  });

  res.json(stat);
});

/* ================= UPDATE (THIS ONE IS OFTEN MISSING ❌) ================= */
router.put("/:id", async (req, res) => {
  const { id } = req.params;

  const stat = await prisma.stat.update({
    where: { id },
    data: req.body,
  });

  res.json(stat);
});

/* ================= DELETE ================= */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  await prisma.stat.delete({ where: { id } });

  res.json({ success: true });
});

export default router;
