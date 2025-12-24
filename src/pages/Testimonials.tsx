import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import SectionTitle from '@/components/SectionTitle';
import TestimonialCard from '@/components/TestimonialCard';
import { testimonials } from '@/data/mockData';

const Testimonials = () => {
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
              Testimonials
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Client Love
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Hear from the couples and companies who trusted us with their most precious moments.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <SectionTitle
            subtitle="Our Track Record"
            title="Numbers That Speak"
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
            {[
              { value: '500+', label: 'Happy Clients' },
              { value: '4.9', label: 'Average Rating' },
              { value: '100%', label: 'Would Recommend' },
              { value: '50+', label: 'Five-Star Reviews' },
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

export default Testimonials;
