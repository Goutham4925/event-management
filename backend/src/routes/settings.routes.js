import express from "express";
import prisma from "../../prisma/client.js";

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

          heroBadge: "",
          heroTitle: "Your Event, Perfectly Planned",
          heroSubtitle: "We design unforgettable experiences",
          heroImage: "",

          aboutHeading: "About Us",
          aboutText: "",

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
    res.status(500).json({ error: "Failed to load settings" });
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
    res.status(500).json({ error: "Failed to update settings" });
  }
});

export default router;
