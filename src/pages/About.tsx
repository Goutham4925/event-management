import { motion } from 'framer-motion';
import { Target, Eye, Heart, Award } from 'lucide-react';
import Layout from '@/components/Layout';
import SectionTitle from '@/components/SectionTitle';
import { siteSettings, events } from '@/data/mockData';

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-card">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="text-primary text-sm font-medium tracking-widest uppercase mb-4 block">
              About Us
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Crafting Excellence Since 2012
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              We are a team of passionate event professionals dedicated to transforming your visions into unforgettable experiences.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <span className="text-primary text-sm font-medium tracking-widest uppercase mb-3 block">
                Our Story
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
                A Passion for Perfection
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>{siteSettings.aboutText}</p>
                <p>
                  Founded by a team of creative visionaries and meticulous planners, Elegance Events 
                  has grown from a boutique agency to one of the most sought-after event management 
                  companies in the region. Our success is built on a foundation of trust, creativity, 
                  and an unwavering commitment to excellence.
                </p>
                <p>
                  Every event we create is a reflection of our clients' unique stories. We listen, 
                  we understand, and we deliver experiences that exceed expectations and create 
                  lasting memories.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-lg overflow-hidden">
                <img
                  src={events[0].coverImage}
                  alt="Our team at work"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-card p-6 rounded-lg shadow-elevated border border-border">
                <div className="text-4xl font-serif font-bold text-gradient-gold">12+</div>
                <div className="text-muted-foreground text-sm">Years of Excellence</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-background p-8 rounded-lg border border-border"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Eye className="text-primary" size={24} />
              </div>
              <h3 className="font-serif text-2xl font-bold text-foreground mb-4">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                {siteSettings.vision}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-background p-8 rounded-lg border border-border"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Target className="text-primary" size={24} />
              </div>
              <h3 className="font-serif text-2xl font-bold text-foreground mb-4">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                {siteSettings.mission}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <SectionTitle
            subtitle="Our Values"
            title="What Drives Us"
            description="The principles that guide every event we create."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Heart,
                title: 'Passion',
                description: 'We pour our hearts into every detail, treating your event as if it were our own.',
              },
              {
                icon: Award,
                title: 'Excellence',
                description: 'We strive for perfection in everything we do, from planning to execution.',
              },
              {
                icon: Target,
                title: 'Precision',
                description: 'Meticulous attention to detail ensures flawless event delivery every time.',
              },
              {
                icon: Eye,
                title: 'Innovation',
                description: 'We constantly push boundaries to create unique and memorable experiences.',
              },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-card border border-border flex items-center justify-center mb-6 group-hover:border-primary transition-colors duration-300">
                  <value.icon className="text-primary" size={28} />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Stats */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '25+', label: 'Team Members' },
              { value: '500+', label: 'Events Completed' },
              { value: '15+', label: 'Countries Served' },
              { value: '100%', label: 'Satisfaction Rate' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
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
    </Layout>
  );
};

export default About;
