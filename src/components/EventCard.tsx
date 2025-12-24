import { Link } from "react-router-dom";
import { Calendar, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import type { Event } from "@/types/event";

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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Link
        to={`/works/${event.id}`}
        className="group block bg-card rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-all duration-500"
      >
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={event.coverImage}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 text-xs font-medium tracking-wider uppercase bg-primary/90 text-primary-foreground rounded-full">
              {event.category}
            </span>
          </div>

          {/* Arrow Icon */}
          <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
            <ArrowUpRight size={18} className="text-primary-foreground" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-3">
          <h3 className="font-serif text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-1">
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
