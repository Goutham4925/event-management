import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import Layout from "@/components/Layout";
import SectionTitle from "@/components/SectionTitle";
import { apiGet } from "@/lib/api";
import { iconMap } from "@/lib/iconMap";

import { Stat } from "@/types/stat";

/* ================= TYPES ================= */
type AboutValue = {
  icon: string;
  title: string;
  description?: string;
};

type AboutPage = {
  heroBadge?: string;
  heroTitle: string;
  heroSubtitle: string;

  storyBadge?: string;
  storyTitle?: string;
  storyContent?: string;

  vision?: string;
  mission?: string;

  /* ✅ NEW – dynamic icons */
  visionIcon?: string;   // e.g. "Eye"
  missionIcon?: string;  // e.g. "Target"

  heroImage?: string;
  yearsExperience?: number;

  valuesSectionTitle?: string;
  valuesSectionSubtitle?: string;

  values?: AboutValue[];
};

const About = () => {
  const [about, setAbout] = useState<AboutPage | null>(null);
  const [stats, setStats] = useState<Stat[]>([]);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    async function loadData() {
      const [aboutData, statsData] = await Promise.all([
        apiGet<AboutPage>("/about"),
        apiGet<Stat[]>("/stats?page=ABOUT"),
      ]);

      setAbout(aboutData);
      setStats(statsData || []);
    }

    loadData();
  }, []);

  if (!about) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Loading about page...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* ================= HERO ================= */}
      <section className="pt-32 pb-20 bg-card">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <span className="text-primary text-sm tracking-widest uppercase mb-4 block">
              {about.heroBadge}
            </span>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {about.heroTitle}
            </h1>

            <p className="text-muted-foreground text-lg">
              {about.heroSubtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================= STORY ================= */}
      <section className="py-24">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary uppercase tracking-widest text-sm block mb-3">
              {about.storyBadge}
            </span>

            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
              {about.storyTitle}
            </h2>

            <p className="text-muted-foreground leading-relaxed">
              {about.storyContent}
            </p>
          </motion.div>

          {about.heroImage && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-lg overflow-hidden">
                <img
                  src={about.heroImage}
                  className="w-full h-full object-cover"
                />
              </div>

              {about.yearsExperience && (
                <div className="absolute -bottom-8 -left-8 bg-card p-6 rounded-lg border shadow-elevated">
                  <div className="text-4xl font-serif font-bold text-gradient-gold">
                    {about.yearsExperience}+
                  </div>
                  <div className="text-muted-foreground text-sm">
                    Years of Excellence
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* ================= VISION & MISSION (DYNAMIC ICONS) ================= */}
      {(about.vision || about.mission) && (
        <section className="py-24 bg-card">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12">

              {/* VISION */}
              {about.vision && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="bg-background p-8 rounded-lg border"
                >
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    {(() => {
                      const VisionIcon =
                        iconMap[about.visionIcon || "Eye"] || iconMap.Eye;
                      return <VisionIcon className="text-primary" size={24} />;
                    })()}
                  </div>

                  <h3 className="font-serif text-2xl font-bold mb-4">
                    Our Vision
                  </h3>

                  <p className="text-muted-foreground leading-relaxed">
                    {about.vision}
                  </p>
                </motion.div>
              )}

              {/* MISSION */}
              {about.mission && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="bg-background p-8 rounded-lg border"
                >
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    {(() => {
                      const MissionIcon =
                        iconMap[about.missionIcon || "Target"] || iconMap.Target;
                      return <MissionIcon className="text-primary" size={24} />;
                    })()}
                  </div>

                  <h3 className="font-serif text-2xl font-bold mb-4">
                    Our Mission
                  </h3>

                  <p className="text-muted-foreground leading-relaxed">
                    {about.mission}
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ================= VALUES ================= */}
      {about.values && about.values.length > 0 && (
        <section className="py-24">
          <div className="container mx-auto px-4">
            <SectionTitle
              subtitle={about.valuesSectionSubtitle || "Our Values"}
              title={about.valuesSectionTitle || "What Drives Us"}
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {about.values.map((value, index) => {
                const Icon = iconMap[value.icon] || iconMap.Heart;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center group"
                  >
                    <div className="w-16 h-16 mx-auto rounded-full bg-card border flex items-center justify-center mb-6 group-hover:border-primary transition-colors">
                      <Icon className="text-primary" size={28} />
                    </div>

                    <h3 className="font-serif text-xl font-semibold mb-2">
                      {value.title}
                    </h3>

                    {value.description && (
                      <p className="text-muted-foreground text-sm">
                        {value.description}
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ================= STATS ================= */}
      {stats.length > 0 && (
        <section className="py-24 bg-card">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-serif font-bold text-gradient-gold mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground text-sm uppercase">
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

export default About;
