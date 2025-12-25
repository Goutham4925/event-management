import express from "express";
import bcrypt from "bcryptjs";
import prisma from "../config/db.js";
import { signToken } from "../utils/jwt.js";

const router = express.Router();

/* ===============================
   REGISTER (PUBLIC)
================================ */
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        status: "PENDING",
        role: "USER",
      },
    });

    res.json({
      message: "Account created. Await admin approval.",
    });
  } catch (err) {
    console.error("REGISTER error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

/* ===============================
   LOGIN (PUBLIC)
================================ */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (user.status !== "APPROVED") {
      return res.status(403).json({
        error:
          user.status === "PENDING"
            ? "Account awaiting admin approval"
            : "Account blocked",
      });
    }

    const token = signToken(user);

    res.json({
      token,
      role: user.role,
    });
  } catch (err) {
    console.error("LOGIN error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
