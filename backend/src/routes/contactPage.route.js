import express from "express";
import prisma from "../config/db.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ===============================
   GET CONTACT PAGE (PUBLIC)
================================ */
router.get("/", async (_req, res) => {
  const page = await prisma.contactPage.findUnique({
    where: { id: "contact" },
  });

  res.json(page);
});

/* ===============================
   UPDATE CONTACT PAGE (ADMIN)
================================ */
router.put("/", protect, async (req, res) => {
  const data = req.body;

  const page = await prisma.contactPage.upsert({
    where: { id: "contact" },
    update: data,
    create: { id: "contact", ...data },
  });

  res.json(page);
});

export default router;
