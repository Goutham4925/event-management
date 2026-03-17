import express from "express";
import prisma from "../../prisma/client.js";
import cloudinary from "../config/cloudinary.js";
import upload from "../middlewares/upload.js";
import { formatPrismaError } from "../utils/error.js";

const router = express.Router();

/* =====================================================
   GET SETTINGS (CACHED)
===================================================== */
router.get("/", async (_req, res) => {
  try {

    // Vercel Edge Cache
    res.setHeader(
      "Cache-Control",
      "s-maxage=60, stale-while-revalidate"
    );

    let settings = await prisma.siteSettings.findUnique({
      where: { id: "settings" },
    });

    // Create default row if missing
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          id: "settings",

          brandLogo: "",
          brandSubtitle: "",

          heroBadge: "",
          heroTitle: "Your Event, Perfectly Planned",
          heroSubtitle: "We design unforgettable experiences",
          heroImage: "",

          aboutHeading: "About Us",
          aboutText: "",
          aboutImage1: "",
          aboutImage2: "",

          portfolioTitle: "Our Portfolio",
          portfolioSubtitle: "Featured Events",
          portfolioDescription: "",

          testimonialTitle: "Testimonials",
          testimonialSubtitle: "What our clients say",

          ctaTitle: "Start Planning Your Event",
          ctaSubtitle: "Let’s make something unforgettable",

          contactEmail: "",
          contactPhone: "",
          address: "",

          socialLinks: {},
        },
      });
    }

    res.json(settings);

  } catch (err) {
    console.error("GET /settings error:", err);

    res.status(500).json({
      error: "Failed to load settings",
      details: formatPrismaError(err),
    });
  }
});


/* =====================================================
   UPDATE SETTINGS
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

    res.status(500).json({
      error: "Failed to update settings",
      details: formatPrismaError(err),
    });
  }
});


/* =====================================================
   UPLOAD IMAGE HELPER
===================================================== */
const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {

    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    stream.end(buffer);
  });
};


/* =====================================================
   BRAND LOGO
===================================================== */
router.post("/brand-logo", upload.single("image"), async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const result = await uploadToCloudinary(
      req.file.buffer,
      "site/brand"
    );

    const updated = await prisma.siteSettings.upsert({
      where: { id: "settings" },
      update: { brandLogo: result.secure_url },
      create: {
        id: "settings",
        brandLogo: result.secure_url,
      },
    });

    res.json({ brandLogo: updated.brandLogo });

  } catch (err) {
    console.error("Brand logo upload error:", err);

    res.status(500).json({
      error: "Image upload failed",
    });
  }
});


/* =====================================================
   HERO IMAGE
===================================================== */
router.post("/hero-image", upload.single("image"), async (req, res) => {
  try {

    const result = await uploadToCloudinary(
      req.file.buffer,
      "hero"
    );

    const updated = await prisma.siteSettings.upsert({
      where: { id: "settings" },
      update: { heroImage: result.secure_url },
      create: {
        id: "settings",
        heroImage: result.secure_url,
      },
    });

    res.json(updated);

  } catch (err) {
    console.error("Hero upload error:", err);

    res.status(500).json({
      error: "Image upload failed",
    });
  }
});


/* =====================================================
   ABOUT IMAGE 1
===================================================== */
router.post("/about-image-1", upload.single("image"), async (req, res) => {
  try {

    const result = await uploadToCloudinary(
      req.file.buffer,
      "about"
    );

    const updated = await prisma.siteSettings.update({
      where: { id: "settings" },
      data: { aboutImage1: result.secure_url },
    });

    res.json(updated);

  } catch (err) {
    console.error("About image 1 upload error:", err);

    res.status(500).json({
      error: "Upload failed",
    });
  }
});


/* =====================================================
   ABOUT IMAGE 2
===================================================== */
router.post("/about-image-2", upload.single("image"), async (req, res) => {
  try {

    const result = await uploadToCloudinary(
      req.file.buffer,
      "about"
    );

    const updated = await prisma.siteSettings.update({
      where: { id: "settings" },
      data: { aboutImage2: result.secure_url },
    });

    res.json(updated);

  } catch (err) {
    console.error("About image 2 upload error:", err);

    res.status(500).json({
      error: "Upload failed",
    });
  }
});

export default router;
