import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import Layout from "@/components/Layout";
import SectionTitle from "@/components/SectionTitle";
import TestimonialCard from "@/components/TestimonialCard";

import { apiGet } from "@/lib/api";
import { Testimonial } from "@/types/testimonial";
import { Stat } from "@/types/stat";
import { PageHero } from "@/types/pageHero";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [hero, setHero] = useState<PageHero | null>(null);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    async function loadData() {
      try {
        const [ts, st, heroData] = await Promise.all([
          apiGet<Testimonial[]>("/testimonials"),
          apiGet<Stat[]>("/stats?page=TESTIMONIALS"),
          apiGet<PageHero>("/page-hero/TESTIMONIALS"),
        ]);

        setTestimonials(ts || []);
        setStats(st || []);
        setHero(heroData);
      } catch (err) {
        console.error("Failed to load testimonials page", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  /* ================= SAFE LOADING ================= */
  if (loading || !hero) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Loading testimonials…</p>
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

      {/* ================= TESTIMONIALS ================= */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                index={index}
              />
            ))}
          </div>

          {testimonials.length === 0 && (
            <p className="text-center text-muted-foreground mt-12">
              No testimonials yet
            </p>
          )}
        </div>
      </section>

      {/* ================= STATS (FROM DB) ================= */}
      {stats.length > 0 && (
        <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <SectionTitle
              subtitle="Our Track Record"
              title="Numbers That Speak"
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
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
                  <div className="text-muted-foreground text-sm tracking-wide uppercase">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default Testimonials;
