import express from "express";
import bcrypt from "bcryptjs";
import prisma from "../config/db.js";
import { signToken } from "../utils/jwt.js";

const router = express.Router();

/* ======================================================
   REGISTER (PUBLIC)
   → Creates USER with PENDING status
====================================================== */
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const exists = await prisma.user.findUnique({
      where: { email },
    });

    if (exists) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "USER",
        status: "PENDING",
      },
    });

    res.json({
      message: "Account created successfully. Await admin approval.",
    });
  } catch (err) {
    console.error("REGISTER error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

/* ======================================================
   LOGIN (PUBLIC)
   → Only APPROVED users can log in
====================================================== */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // ⛔ Approval gate
    if (user.status !== "APPROVED") {
      return res.status(403).json({
        error:
          user.status === "PENDING"
            ? "Account awaiting admin approval"
            : "Account blocked by admin",
      });
    }

    // ✅ Generate JWT
    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // ✅ Send user object for frontend context
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("LOGIN error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
