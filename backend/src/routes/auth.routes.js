import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/db.js";

const router = express.Router();

/**
 * POST /api/auth/login
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) return res.status(401).json({ message: "Invalid credentials" });

  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: admin.id, email: admin.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token });
});

export default router;
