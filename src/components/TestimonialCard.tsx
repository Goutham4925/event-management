import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import type { Testimonial } from '@/data/mockData';

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
}

const TestimonialCard = ({ testimonial, index }: TestimonialCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-card rounded-lg border border-border p-8 relative group hover:border-primary/30 transition-all duration-500"
    >
      {/* Quote Icon */}
      <div className="absolute -top-4 left-8">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-gold">
          <Quote size={14} className="text-primary-foreground" />
        </div>
      </div>

      {/* Content */}
      <div className="pt-4">
        <p className="text-foreground leading-relaxed italic mb-6">
          "{testimonial.message}"
        </p>

        <div className="flex items-center space-x-4">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center">
            <span className="text-primary-foreground font-serif font-semibold text-lg">
              {testimonial.name.charAt(0)}
            </span>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-serif font-semibold text-foreground">
              {testimonial.name}
            </h4>
            <p className="text-muted-foreground text-sm">
              {testimonial.role}
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Element */}
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-primary/5 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
};

export default TestimonialCard;
