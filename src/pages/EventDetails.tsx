import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, ArrowRight } from 'lucide-react';
import Layout from '@/components/Layout';
import Lightbox from '@/components/Lightbox';
import { Button } from '@/components/ui/button';
import { events } from '@/data/mockData';

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const event = events.find(e => e.id === id);

  if (!event) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-4xl font-bold text-foreground mb-4">Event Not Found</h1>
            <Link to="/works">
              <Button variant="gold-outline">
                <ArrowLeft size={18} />
                Back to Works
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % event.gallery.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + event.gallery.length) % event.gallery.length);
  };

  // Find next and previous events
  const currentIndex = events.findIndex(e => e.id === id);
  const prevEvent = events[currentIndex - 1];
  const nextEvent = events[currentIndex + 1];

  return (
    <Layout>
      {/* Hero Image */}
      <section className="relative h-[70vh] min-h-[500px]">
        <img
          src={event.coverImage}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block px-4 py-1 text-xs font-medium tracking-wider uppercase bg-primary text-primary-foreground rounded-full mb-4">
                {event.category}
              </span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
                {event.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-foreground/80">
                <div className="flex items-center gap-2">
                  <Calendar size={18} />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User size={18} />
                  <span>{event.client}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                About This Event
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-12">
                {event.description}
              </p>
            </motion.div>
          </div>

          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="font-serif text-2xl font-bold text-foreground mb-8 text-center">
              Event Gallery
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {event.gallery.map((image, index) => (
                <div
                  key={index}
                  className="aspect-[4/3] rounded-lg overflow-hidden cursor-pointer group"
                  onClick={() => openLightbox(index)}
                >
                  <img
                    src={image}
                    alt={`${event.title} gallery image ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="mt-20 pt-12 border-t border-border">
            <div className="flex justify-between items-center">
              {prevEvent ? (
                <Link to={`/works/${prevEvent.id}`}>
                  <Button variant="ghost" className="gap-2">
                    <ArrowLeft size={18} />
                    <span className="hidden sm:inline">Previous Event</span>
                  </Button>
                </Link>
              ) : (
                <div />
              )}
              
              <Link to="/works">
                <Button variant="gold-outline">
                  View All Events
                </Button>
              </Link>

              {nextEvent ? (
                <Link to={`/works/${nextEvent.id}`}>
                  <Button variant="ghost" className="gap-2">
                    <span className="hidden sm:inline">Next Event</span>
                    <ArrowRight size={18} />
                  </Button>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <Lightbox
        images={event.gallery}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={nextImage}
        onPrev={prevImage}
      />
    </Layout>
  );
};

export default EventDetails;
