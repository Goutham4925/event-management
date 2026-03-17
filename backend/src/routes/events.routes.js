import express from "express";
import prisma from "../config/db.js";
import { protect } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.js";
import cloudinary from "../config/cloudinary.js";
import { formatPrismaError } from "../utils/error.js";

const router = express.Router();

/* ===============================
   GET ALL EVENTS (PUBLIC)
================================ */
router.get("/", async (_req, res) => {
  try {

    res.setHeader(
      "Cache-Control",
      "s-maxage=60, stale-while-revalidate"
    );

    const events = await prisma.event.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        date: true,
        client: true,
        coverImage: true,
        featured: true,
        createdAt: true
      }
    });

    res.json(events);

  } catch (err) {
    console.error("GET /events error:", err);

    res.status(500).json({
      error: "Failed to fetch events",
      details: formatPrismaError(err),
    });
  }
});

/* ===============================
   GET SINGLE EVENT (PUBLIC)
================================ */
router.get("/:id", async (req, res) => {
  try {

    res.setHeader(
      "Cache-Control",
      "s-maxage=60, stale-while-revalidate"
    );

    const event = await prisma.event.findUnique({
      where: { id: req.params.id },

      // load gallery only when needed
      include: {
        gallery: true,
      },
    });

    if (!event) {
      return res.status(404).json({
        error: "Event not found",
      });
    }

    res.json(event);

  } catch (err) {
    console.error("GET /events/:id error:", err);

    res.status(500).json({
      error: "Failed to fetch event",
      details: formatPrismaError(err),
    });
  }
});


/* ===============================
   UPLOAD EVENT COVER (ADMIN)
================================ */
router.post(
  "/upload-cover",
  protect,
  upload.single("image"),
  async (req, res) => {
    try {

      if (!req.file) {
        return res.status(400).json({
          error: "No image uploaded",
        });
      }

      const result = await new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "events/covers",
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        stream.end(req.file.buffer);
      });

      res.json({
        url: result.secure_url,
      });

    } catch (err) {
      console.error("UPLOAD COVER error:", err);

      res.status(500).json({
        error: "Image upload failed",
      });
    }
  }
);


/* ===============================
   CREATE EVENT (ADMIN)
================================ */
router.post("/", protect, async (req, res) => {
  try {

    const event = await prisma.event.create({
      data: req.body,
    });

    res.json(event);

  } catch (err) {
    console.error("POST /events error:", err);

    res.status(500).json({
      error: "Failed to create event",
    });
  }
});


/* ===============================
   UPDATE EVENT (ADMIN)
================================ */
router.put("/:id", protect, async (req, res) => {
  try {

    const event = await prisma.event.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.json(event);

  } catch (err) {
    console.error("PUT /events error:", err);

    res.status(500).json({
      error: "Failed to update event",
    });
  }
});


/* ===============================
   DELETE EVENT (ADMIN)
================================ */
router.delete("/:id", protect, async (req, res) => {
  try {

    await prisma.event.delete({
      where: { id: req.params.id },
    });

    res.json({
      success: true,
    });

  } catch (err) {
    console.error("DELETE /events error:", err);

    res.status(500).json({
      error: "Failed to delete event",
    });
  }
});

export default router;
