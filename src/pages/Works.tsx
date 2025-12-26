import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import Layout from "@/components/Layout";
import EventCard from "@/components/EventCard";
import { apiGet } from "@/lib/api";

import { Event } from "@/types/event";
import { PageHero } from "@/types/pageHero";

/* ================= TYPES ================= */
type Category = {
  id: string;
  name: string;
};

const Works = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [hero, setHero] = useState<PageHero | null>(null);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    async function loadData() {
      try {
        const [eventsData, categoriesData, heroData] = await Promise.all([
          apiGet<Event[]>("/events"),
          apiGet<Category[]>("/categories"),
          apiGet<PageHero | null>("/page-hero/WORKS"),
        ]);

        setEvents(eventsData);
        setHero(heroData);

        const categoryNames = categoriesData.map((c) => c.name);
        setCategories(["All", ...categoryNames]);
      } catch (err) {
        console.error("Failed to load works page", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
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
          <p className="text-muted-foreground">Loading works page…</p>
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
            {hero?.badge && (
              <span className="text-primary text-sm font-medium tracking-widest uppercase mb-4 block">
                {hero.badge}
              </span>
            )}

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {hero?.title || "Events We’ve Crafted"}
            </h1>

            {hero?.subtitle && (
              <p className="text-muted-foreground text-lg leading-relaxed">
                {hero.subtitle}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* ================= FILTER + GRID ================= */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          {/* ================= CATEGORY FILTER ================= */}
          {categories.length > 1 && (
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              {categories.map((category) => (
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
          )}

          {/* ================= EVENTS GRID ================= */}
          <motion.div
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </motion.div>

          {/* ================= EMPTY STATE ================= */}
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
