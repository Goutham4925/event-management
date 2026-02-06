import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, User, ArrowLeft, ArrowRight } from "lucide-react";

import Layout from "@/components/Layout";
import Lightbox from "@/components/Lightbox";
import { Button } from "@/components/ui/button";
import { apiGet } from "@/lib/api";
import { optimizeImage } from "@/lib/optimizeImage";
import { Event } from "@/types/event";

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();

  const [events, setEvents] = useState<Event[]>([]);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  /* ================= LOAD EVENTS ================= */
  useEffect(() => {
    async function loadData() {
      try {
        const allEvents = await apiGet<Event[]>("/events");
        setEvents(allEvents);

        const found = allEvents.find((e) => e.id === id);
        setEvent(found || null);
      } catch (err) {
        console.error("Failed to load event", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Loading event…</p>
        </div>
      </Layout>
    );
  }

  if (!event) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center text-center">
          <h1 className="font-serif text-4xl font-bold mb-4">
            Event Not Found
          </h1>
          <Link to="/works">
            <Button variant="gold-outline">
              <ArrowLeft size={18} />
              Back to Works
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  /* ================= PREV / NEXT ================= */
  const currentIndex = events.findIndex((e) => e.id === event.id);
  const prevEvent = currentIndex > 0 ? events[currentIndex - 1] : null;
  const nextEvent =
    currentIndex < events.length - 1 ? events[currentIndex + 1] : null;

  /* ================= LIGHTBOX ================= */
  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    setCurrentImageIndex(
      (prev) => (prev + 1) % event.gallery.length
    );
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + event.gallery.length) %
        event.gallery.length
    );
  };

  return (
    <Layout>
      {/* ================= HERO ================= */}
      <section className="relative h-[70vh] min-h-[500px]">
        <img
          src={optimizeImage(event.coverImage, 1600)}
          alt={event.title}
          className="w-full h-full object-cover"
          fetchPriority="high"
          decoding="async"
        />

        <div className="absolute inset-0 bg-gradient-hero" />

        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block px-4 py-1 text-xs uppercase bg-primary text-primary-foreground rounded-full mb-4">
                {event.category}
              </span>

              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                {event.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-foreground/80">
                <div className="flex items-center gap-2">
                  <Calendar size={18} />
                  {formattedDate}
                </div>

                <div className="flex items-center gap-2">
                  <User size={18} />
                  {event.client}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="font-serif text-2xl font-bold mb-6">
              About This Event
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-12">
              {event.description}
            </p>
          </motion.div>
        </div>

        {/* ================= GALLERY ================= */}
        {event.gallery.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="container mx-auto px-4"
          >
            <h2 className="font-serif text-2xl font-bold text-center mb-8">
              Event Gallery
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {event.gallery.map((img, index) => (
                <div
                  key={img.id}
                  className="aspect-[4/3] rounded-lg overflow-hidden cursor-pointer group"
                  onClick={() => openLightbox(index)}
                >
                  <img
                    src={optimizeImage(img.imageUrl, 900)}
                    loading="lazy"
                    decoding="async"
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* NAVIGATION unchanged */}
      </section>

      <Lightbox
        images={event.gallery.map((g) => g.imageUrl)}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={nextImage}
        onPrev={prevImage}
      />
    </Layout>
  );
};

export default EventDetails;
