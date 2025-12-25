import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import Layout from "@/components/Layout";
import EventCard from "@/components/EventCard";
import { apiGet } from "@/lib/api";

import { Event } from "@/types/event";

/* =====================================================
   CONSTANTS
===================================================== */
const CATEGORIES = ["All", "Wedding", "Corporate", "Birthday"];

const Works = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  /* ================= LOAD EVENTS ================= */
  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await apiGet<Event[]>("/events");
        setEvents(data);
      } catch (err) {
        console.error("Failed to load events", err);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  /* ================= FILTER ================= */
  const filteredEvents =
    selectedCategory === "All"
      ? events
      : events.filter((e) => e.category === selectedCategory);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Loading events…</p>
        </div>
      </Layout>
    );
  }

  /* ================= UI ================= */
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
            <span className="text-primary text-sm font-medium tracking-widest uppercase mb-4 block">
              Our Portfolio
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Events We’ve Crafted
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Explore our collection of meticulously planned and flawlessly
              executed events.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================= FILTER + GRID ================= */}
      <section className="py-24">
        <div className="container mx-auto px-4">

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium uppercase tracking-wide transition-all ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground shadow-gold"
                    : "bg-card border border-border text-muted-foreground hover:border-primary hover:text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Events Grid */}
          <motion.div
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </motion.div>

          {/* Empty State */}
          {filteredEvents.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                No events found in this category.
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Works;
