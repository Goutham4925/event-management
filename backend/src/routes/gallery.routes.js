import express from "express";
import prisma from "../../prisma/client.js";
import upload from "../middlewares/upload.js";
import cloudinary from "../config/cloudinary.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ================= ADD IMAGE TO EVENT ================= */
router.post(
  "/:eventId",
  protect,
  upload.single("image"),
  async (req, res) => {
    const result = await cloudinary.uploader.upload_stream(
      { folder: "events" },
      async (error, result) => {
        if (error) throw error;

        const image = await prisma.galleryImage.create({
          data: {
            imageUrl: result.secure_url,
            eventId: req.params.eventId,
          },
        });

        res.json(image);
      }
    );

    result.end(req.file.buffer);
  }
);

/* ================= DELETE IMAGE ================= */
router.delete("/:id", protect, async (req, res) => {
  await prisma.galleryImage.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

export default router;
