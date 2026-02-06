import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import Layout from "@/components/Layout";
import Lightbox from "@/components/Lightbox";
import { apiGet } from "@/lib/api";
import { optimizeImage } from "@/lib/optimizeImage";
import { PageHero } from "@/types/pageHero";

/* =========================
   TYPES
========================= */
type GalleryImage = {
  id: string;
  imageUrl: string;
};

const Gallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [hero, setHero] = useState<PageHero | null>(null);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    async function loadData() {
      try {
        const [imagesData, heroData] = await Promise.all([
          apiGet<GalleryImage[]>("/gallery"),
          apiGet<PageHero>("/page-hero/GALLERY"),
        ]);

        setImages(imagesData);
        setHero(heroData);
      } catch (err) {
        console.error("Failed to load gallery page", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  /* ================= LIGHTBOX ================= */
  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  /* ================= SAFE LOADING ================= */
  if (loading || !hero) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Loading gallery…</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* ================= HERO ================= */}
      <section className="pt-32 pb-20 bg-card">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            {hero.badge && (
              <span className="text-primary text-sm font-medium tracking-widest uppercase mb-4 block">
                {hero.badge}
              </span>
            )}

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              {hero.title}
            </h1>

            {hero.subtitle && (
              <p className="text-muted-foreground text-lg leading-relaxed">
                {hero.subtitle}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* ================= GALLERY GRID ================= */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img, index) => {
              const isFeatured = index % 5 === 0;

              return (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className={`relative overflow-hidden rounded-lg cursor-pointer group ${
                    isFeatured ? "md:col-span-2 md:row-span-2" : ""
                  }`}
                  onClick={() => openLightbox(index)}
                >
                  <div className={isFeatured ? "aspect-square" : "aspect-[4/3]"}>
                    <img
                      src={optimizeImage(
                        img.imageUrl,
                        isFeatured ? 900 : 600
                      )}
                      alt={`Gallery image ${index + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-background/0 group-hover:bg-background/30 transition-colors duration-300 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-50 group-hover:scale-100">
                      <svg
                        className="w-5 h-5 text-primary-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                        />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= LIGHTBOX ================= */}
      <Lightbox
        images={images.map((i) => i.imageUrl)} // original full image
        currentIndex={currentIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={nextImage}
        onPrev={prevImage}
      />
    </Layout>
  );
};

export default Gallery;
