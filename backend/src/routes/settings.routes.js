import express from "express";
import prisma from "../../prisma/client.js";
import cloudinary from "../config/cloudinary.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

/* =====================================================
   GET SETTINGS (SAFE)
===================================================== */
router.get("/", async (_req, res) => {
  try {
    let settings = await prisma.siteSettings.findUnique({
      where: { id: "settings" },
    });

    // ✅ Create default row if missing
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          id: "settings",

          // BRAND
          brandLogo: "",
          brandSubtitle: "",

          // HERO
          heroBadge: "",
          heroTitle: "Your Event, Perfectly Planned",
          heroSubtitle: "We design unforgettable experiences",
          heroImage: "",

          // ABOUT
          aboutHeading: "About Us",
          aboutText: "",
          aboutImage1: "",
          aboutImage2: "",

          // PORTFOLIO
          portfolioTitle: "Our Portfolio",
          portfolioSubtitle: "Featured Events",
          portfolioDescription: "",

          // TESTIMONIALS
          testimonialTitle: "Testimonials",
          testimonialSubtitle: "What our clients say",

          // CTA
          ctaTitle: "Start Planning Your Event",
          ctaSubtitle: "Let’s make something unforgettable",

          // CONTACT (footer fallback)
          contactEmail: "",
          contactPhone: "",
          address: "",

          // SOCIAL
          socialLinks: {},
        },
      });
    }

    res.json(settings);
  } catch (err) {
    console.error("GET /settings error:", err);
    res.status(500).json({ error: "Failed to load settings" });
  }
});

/* =====================================================
   UPDATE SETTINGS (TEXT + JSON)
===================================================== */
router.put("/", async (req, res) => {
  try {
    const data = req.body;

    const settings = await prisma.siteSettings.upsert({
      where: { id: "settings" },
      update: {
        ...data,
        socialLinks: data.socialLinks ?? {},
      },
      create: {
        id: "settings",
        ...data,
        socialLinks: data.socialLinks ?? {},
      },
    });

    res.json(settings);
  } catch (err) {
    console.error("PUT /settings error:", err);
    res.status(500).json({ error: "Failed to update settings" });
  }
});

/* =====================================================
   UPLOAD BRAND LOGO (NEW ✅)
   POST /api/settings/brand-logo
===================================================== */
router.post(
  "/brand-logo",
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // 🔹 Upload to Cloudinary
      const stream = cloudinary.uploader.upload_stream(
        { folder: "site/brand" },
        async (error, result) => {
          if (error) throw error;

          const updated = await prisma.siteSettings.upsert({
            where: { id: "settings" },
            update: { brandLogo: result.secure_url },
            create: {
              id: "settings",
              brandLogo: result.secure_url,
              heroTitle: "Your Event, Perfectly Planned",
              heroSubtitle: "We design unforgettable experiences",
              ctaTitle: "Start Planning Your Event",
              ctaSubtitle: "Let’s make something unforgettable",
            },
          });

          res.json({ brandLogo: updated.brandLogo });
        }
      );

      stream.end(req.file.buffer);
    } catch (err) {
      console.error("Brand logo upload error:", err);
      res.status(500).json({ error: "Image upload failed" });
    }
  }
);

/* =====================================================
   UPLOAD HERO IMAGE
===================================================== */
router.post(
  "/hero-image",
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const stream = cloudinary.uploader.upload_stream(
        { folder: "hero" },
        async (error, result) => {
          if (error) throw error;

          const updated = await prisma.siteSettings.upsert({
            where: { id: "settings" },
            update: { heroImage: result.secure_url },
            create: {
              id: "settings",
              heroImage: result.secure_url,
              heroTitle: "Your Event, Perfectly Planned",
              heroSubtitle: "We design unforgettable experiences",
              ctaTitle: "Start Planning Your Event",
              ctaSubtitle: "Let’s make something unforgettable",
            },
          });

          res.json(updated);
        }
      );

      stream.end(req.file.buffer);
    } catch (err) {
      console.error("Hero upload error:", err);
      res.status(500).json({ error: "Image upload failed" });
    }
  }
);

/* =====================================================
   UPLOAD ABOUT IMAGE 1
===================================================== */
router.post(
  "/about-image-1",
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const stream = cloudinary.uploader.upload_stream(
        { folder: "about" },
        async (error, result) => {
          if (error) throw error;

          const updated = await prisma.siteSettings.update({
            where: { id: "settings" },
            data: { aboutImage1: result.secure_url },
          });

          res.json(updated);
        }
      );

      stream.end(req.file.buffer);
    } catch (err) {
      console.error("About image 1 upload error:", err);
      res.status(500).json({ error: "Upload failed" });
    }
  }
);

/* =====================================================
   UPLOAD ABOUT IMAGE 2
===================================================== */
router.post(
  "/about-image-2",
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const stream = cloudinary.uploader.upload_stream(
        { folder: "about" },
        async (error, result) => {
          if (error) throw error;

          const updated = await prisma.siteSettings.update({
            where: { id: "settings" },
            data: { aboutImage2: result.secure_url },
          });

          res.json(updated);
        }
      );

      stream.end(req.file.buffer);
    } catch (err) {
      console.error("About image 2 upload error:", err);
      res.status(500).json({ error: "Upload failed" });
    }
  }
);

export default router;
