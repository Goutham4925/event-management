import { Link } from "react-router-dom";
import { Calendar, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Event } from "@/types/event";
import { optimizeImage } from "@/lib/optimizeImage";

interface EventCardProps {
  event: Event;
  index: number;
}

const EventCard = ({ event, index }: EventCardProps) => {
  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.div
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      viewport={{ once: true }}
    >
      <Link
        to={`/works/${event.id}`}
        className="
          group block rounded-xl overflow-hidden border border-border bg-card
          transition-all duration-500
          hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10
          hover:border-primary/50
        "
      >
        {/* ================= IMAGE ================= */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={optimizeImage(event.coverImage, 600)}
            alt={event.title}
            loading="lazy"
            decoding="async"
            className="
              w-full h-full object-cover
              transition-all duration-700
              group-hover:scale-110 group-hover:rotate-[0.5deg]
            "
          />

          {/* Gradient Overlay */}
          <div
            className="
              absolute inset-0
              bg-gradient-to-t from-background/95 via-background/30 to-transparent
              opacity-0 group-hover:opacity-100
              transition-opacity duration-500
            "
          />

          {/* Category Badge */}
          <div className="absolute top-4 left-4 z-10">
            <span
              className="
                px-3 py-1 text-xs font-medium uppercase tracking-wider
                bg-primary text-primary-foreground rounded-full
                shadow-md shadow-primary/30
                transition-all duration-300
                group-hover:scale-105
              "
            >
              {event.category}
            </span>
          </div>

          {/* Arrow CTA */}
          <div
            className="
              absolute bottom-4 right-4 z-10
              w-11 h-11 rounded-full bg-primary
              flex items-center justify-center
              opacity-0 translate-y-4 scale-90
              group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100
              transition-all duration-500
            "
          >
            <ArrowUpRight size={18} className="text-primary-foreground" />
          </div>
        </div>

        {/* ================= CONTENT ================= */}
        <div
          className="
            p-6 space-y-3
            transition-transform duration-500
            group-hover:-translate-y-1
          "
        >
          <h3
            className="
              font-serif text-xl font-semibold text-foreground
              transition-colors duration-300
              group-hover:text-primary
              line-clamp-1
            "
          >
            {event.title}
          </h3>

          <p className="text-muted-foreground text-sm line-clamp-2">
            {event.description}
          </p>

          <div className="flex items-center text-muted-foreground text-sm pt-2">
            <Calendar size={14} className="mr-2" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default EventCard;
