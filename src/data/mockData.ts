import heroWedding from '@/assets/hero-wedding.jpg';
import eventCorporate from '@/assets/event-corporate.jpg';
import eventGardenWedding from '@/assets/event-garden-wedding.jpg';
import eventBirthday from '@/assets/event-birthday.jpg';
import eventLaunch from '@/assets/event-launch.jpg';
import eventBeach from '@/assets/event-beach.jpg';

export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  coverImage: string;
  client: string;
  gallery: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  message: string;
  avatar?: string;
}

export interface SiteSettings {
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  vision: string;
  mission: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export const events: Event[] = [
  {
    id: '1',
    title: 'Elegant Garden Wedding',
    description: 'A breathtaking outdoor ceremony set in a stunning garden venue, featuring a romantic floral arch, elegant white seating arrangements, and golden hour lighting that created an unforgettable atmosphere for Emily and James\'s special day.',
    category: 'Wedding',
    date: '2024-06-15',
    coverImage: eventGardenWedding,
    client: 'Emily & James Thompson',
    gallery: [eventGardenWedding, heroWedding, eventBeach],
  },
  {
    id: '2',
    title: 'Corporate Excellence Gala',
    description: 'An exceptional corporate gala event held in a prestigious venue, featuring dramatic stage lighting, sophisticated dining arrangements, and world-class entertainment for over 500 distinguished guests.',
    category: 'Corporate',
    date: '2024-05-20',
    coverImage: eventCorporate,
    client: 'Morgan Stanley',
    gallery: [eventCorporate, eventLaunch],
  },
  {
    id: '3',
    title: 'Luxurious Beach Wedding',
    description: 'A romantic destination wedding on pristine sandy shores, complete with tiki torches, flowing white linens, and a spectacular sunset ceremony that captured the essence of barefoot luxury.',
    category: 'Wedding',
    date: '2024-04-10',
    coverImage: eventBeach,
    client: 'Sarah & Michael Rivera',
    gallery: [eventBeach, eventGardenWedding],
  },
  {
    id: '4',
    title: 'Grand Ballroom Reception',
    description: 'An opulent wedding reception in a historic ballroom, adorned with crystal chandeliers, gold accents, and elaborate floral arrangements that created a truly magical celebration.',
    category: 'Wedding',
    date: '2024-03-25',
    coverImage: heroWedding,
    client: 'Victoria & Christopher Lane',
    gallery: [heroWedding, eventGardenWedding],
  },
  {
    id: '5',
    title: 'Golden Anniversary Celebration',
    description: 'An intimate yet glamorous celebration marking 50 years of love, featuring elegant gold décor, balloon garlands, and a stunning dessert display that honored a lifetime of memories.',
    category: 'Birthday',
    date: '2024-02-14',
    coverImage: eventBirthday,
    client: 'The Henderson Family',
    gallery: [eventBirthday],
  },
  {
    id: '6',
    title: 'Luxury Product Launch',
    description: 'A sophisticated product launch event in a modern gallery space, featuring minimalist design, dramatic spotlighting, and an exclusive atmosphere that perfectly showcased the client\'s premium brand.',
    category: 'Corporate',
    date: '2024-01-30',
    coverImage: eventLaunch,
    client: 'Luxe Brands International',
    gallery: [eventLaunch, eventCorporate],
  },
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Emily Thompson',
    role: 'Bride',
    message: 'Absolutely magical! The team transformed our vision into reality. Every detail was perfect, from the floral arrangements to the lighting. Our guests are still talking about our wedding.',
  },
  {
    id: '2',
    name: 'Richard Morgan',
    role: 'CEO, Morgan Stanley',
    message: 'Impeccable professionalism and creativity. They handled our corporate gala flawlessly, managing every aspect with precision. Truly a world-class event management company.',
  },
  {
    id: '3',
    name: 'Sarah Rivera',
    role: 'Bride',
    message: 'Our beach wedding was a dream come true. The attention to detail and the way they captured our personal style was remarkable. We couldn\'t have asked for a better team.',
  },
  {
    id: '4',
    name: 'Victoria Lane',
    role: 'Bride',
    message: 'From the first consultation to the last dance, everything was handled with grace and expertise. Our ballroom reception exceeded all expectations.',
  },
  {
    id: '5',
    name: 'Jennifer Henderson',
    role: 'Event Host',
    message: 'They made my parents\' 50th anniversary absolutely unforgettable. The golden theme was executed to perfection, and the emotional touches throughout the evening were beautiful.',
  },
];

export const siteSettings: SiteSettings = {
  heroTitle: 'Crafting Unforgettable Moments',
  heroSubtitle: 'Luxury event management for weddings, corporate gatherings, and celebrations that leave lasting impressions.',
  aboutText: 'With over a decade of experience in luxury event management, we specialize in creating bespoke experiences that exceed expectations. Our team of dedicated professionals brings creativity, precision, and passion to every event we curate. From intimate gatherings to grand celebrations, we transform visions into reality with meticulous attention to detail.',
  vision: 'To be the premier choice for discerning clients seeking extraordinary event experiences that celebrate life\'s most precious moments.',
  mission: 'We are committed to delivering unparalleled event experiences through innovative design, flawless execution, and personalized service that honors each client\'s unique story.',
  contactEmail: 'hello@eleganceevents.com',
  contactPhone: '+1 (555) 123-4567',
  address: '123 Luxury Lane, Suite 500, Beverly Hills, CA 90210',
  socialLinks: {
    facebook: 'https://facebook.com/eleganceevents',
    instagram: 'https://instagram.com/eleganceevents',
    twitter: 'https://twitter.com/eleganceevents',
    linkedin: 'https://linkedin.com/company/eleganceevents',
  },
};

export const galleryImages = [
  heroWedding,
  eventCorporate,
  eventGardenWedding,
  eventBirthday,
  eventLaunch,
  eventBeach,
];
