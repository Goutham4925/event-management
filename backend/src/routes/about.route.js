import express from "express";
import prisma from "../config/db.js";
import upload from "../middlewares/upload.js";
import cloudinary from "../config/cloudinary.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ===============================
   GET ABOUT PAGE (PUBLIC)
================================ */
router.get("/", async (_req, res) => {
  const about = await prisma.aboutPage.findFirst();
  res.json(about);
});

/* ===============================
   UPDATE ABOUT PAGE (ADMIN)
================================ */
router.put("/", protect, async (req, res) => {
  const about = await prisma.aboutPage.upsert({
    where: { id: "about" },
    update: req.body,
    create: { id: "about", ...req.body },
  });

  res.json(about);
});

/* ===============================
   UPLOAD HERO IMAGE (ADMIN)
================================ */
router.post(
  "/upload-hero",
  protect,
  upload.single("image"),
  async (req, res) => {
    cloudinary.uploader
      .upload_stream({ folder: "about" }, async (err, result) => {
        if (err) throw err;

        const about = await prisma.aboutPage.upsert({
          where: { id: "about" },
          update: { heroImage: result.secure_url },
          create: {
            id: "about",
            heroImage: result.secure_url,
            heroTitle: "",
            heroSubtitle: "",
          },
        });

        res.json({ heroImage: about.heroImage });
      })
      .end(req.file.buffer);
  }
);

export default router;
