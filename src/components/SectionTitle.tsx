import { motion } from 'framer-motion';

interface SectionTitleProps {
  subtitle?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
}

const SectionTitle = ({ subtitle, title, description, align = 'center' }: SectionTitleProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={`max-w-2xl ${align === 'center' ? 'mx-auto text-center' : 'text-left'} mb-12`}
    >
      {subtitle && (
        <span className="text-primary text-sm font-medium tracking-widest uppercase mb-3 block">
          {subtitle}
        </span>
      )}
      <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-muted-foreground text-lg leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
};

export default SectionTitle;
