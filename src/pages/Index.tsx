import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";

import Layout from "@/components/Layout";
import SectionTitle from "@/components/SectionTitle";
import EventCard from "@/components/EventCard";
import TestimonialCard from "@/components/TestimonialCard";
import { Button } from "@/components/ui/button";

import { apiGet } from "@/lib/api";
import heroFallback from "@/assets/hero-wedding.jpg";

import { SiteSettings } from "@/types/siteSettings";
import { Event } from "@/types/event";
import { Testimonial } from "@/types/testimonial";
import { Stat } from "@/types/stat";

const Index = () => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    async function loadHomeData() {
      try {
        const [settings, allEvents, ts, st] = await Promise.all([
          apiGet<SiteSettings>("/settings"),
          apiGet<Event[]>("/events"), // ✅ FETCH ALL EVENTS
          apiGet<Testimonial[]>("/testimonials?featured=true"),
          apiGet<Stat[]>("/stats?page=HOME"),
        ]);

        // ✅ OPTION A: FILTER FEATURED EVENTS HERE
        const featuredEvents = allEvents.filter((e) => e.featured);

        setSiteSettings(settings);
        setEvents(featuredEvents);
        setTestimonials(ts || []);
        setStats(st || []);
      } catch (err) {
        console.error("Failed to load home data", err);
      }
    }

    loadHomeData();
  }, []);

  if (!siteSettings) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Loading site...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* ================= HERO ================= */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={siteSettings.heroImage || heroFallback}
            alt="Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-hero" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-4xl mx-auto"
          >
            {siteSettings.heroBadge && (
              <span className="inline-block text-primary text-sm tracking-[0.3em] uppercase mb-6">
                {siteSettings.heroBadge}
              </span>
            )}

            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              {siteSettings.heroTitle}
            </h1>

            <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto mb-10">
              {siteSettings.heroSubtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md mx-auto">
            <Link to="/works" className="w-full sm:w-auto flex-1">
              <Button variant="hero" size="xl" className="w-full">
                View Our Work
              </Button>
            </Link>

            <Link to="/contact" className="w-full sm:w-auto flex-1">
              <Button variant="hero-outline" size="xl" className="w-full">
                Get in Touch
              </Button>
            </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      {stats.length > 0 && (
        <section className="py-20 bg-card border-y border-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-serif font-bold text-gradient-gold mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground text-sm uppercase tracking-wide">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= FEATURED EVENTS ================= */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <SectionTitle
            subtitle={siteSettings.portfolioTitle}
            title={siteSettings.portfolioSubtitle}
            description={siteSettings.portfolioDescription}
          />

          {events.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              No featured works yet
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {events.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </div>
          )}

          <div className="text-center">
            <Link to="/works">
              <Button variant="gold-outline" size="lg">
                View All Works <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary uppercase tracking-widest text-sm block mb-3">
              About Us
            </span>
            <h2 className="font-serif text-4xl font-bold mb-6">
              {siteSettings.aboutHeading}
            </h2>
            <p className="text-muted-foreground text-lg mb-6">
              {siteSettings.aboutText}
            </p>
            <Link to="/about">
              <Button variant="gold-outline" size="lg">
                Learn More About Us <ArrowRight size={18} />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {siteSettings.aboutImage1 && (
              <div className="aspect-[3/4] rounded-lg overflow-hidden">
                <img
                  src={siteSettings.aboutImage1}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            )}

            {siteSettings.aboutImage2 && (
              <div className="aspect-[3/4] rounded-lg overflow-hidden mt-8">
                <img
                  src={siteSettings.aboutImage2}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <SectionTitle
            subtitle={siteSettings.testimonialTitle}
            title={siteSettings.testimonialSubtitle}
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <TestimonialCard key={t.id} testimonial={t} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-24 bg-card relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
        <div className="container mx-auto text-center relative z-10">
          <div className="flex justify-center mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={24} className="text-primary fill-primary" />
            ))}
          </div>

          <h2 className="font-serif text-4xl font-bold mb-6">
            {siteSettings.ctaTitle}
          </h2>

          <p className="text-muted-foreground mb-10">
            {siteSettings.ctaSubtitle}
          </p>

          <Link to="/contact">
            <Button variant="gold" size="xl">
              Start Planning Your Event
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
