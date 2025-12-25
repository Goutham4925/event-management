import express from "express";
import prisma from "../../prisma/client.js";
import upload from "../middlewares/upload.js";
import cloudinary from "../config/cloudinary.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ===============================
   GET ALL GALLERY IMAGES (PUBLIC)
================================ */
router.get("/", async (_req, res) => {
  const images = await prisma.galleryImage.findMany({
    include: {
      event: {
        select: { id: true, title: true, category: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  res.json(images);
});

/* ===============================
   ADD IMAGE TO EVENT (ADMIN)
================================ */
router.post(
  "/:eventId",
  protect,
  upload.single("image"),
  async (req, res) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "events" },
      async (error, result) => {
        if (error) return res.status(500).json({ error: "Upload failed" });

        const image = await prisma.galleryImage.create({
          data: {
            imageUrl: result.secure_url,
            eventId: req.params.eventId,
          },
        });

        res.json(image);
      }
    );

    stream.end(req.file.buffer);
  }
);

/* ===============================
   DELETE IMAGE (ADMIN)
================================ */
router.delete("/:id", protect, async (req, res) => {
  await prisma.galleryImage.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

export default router;
