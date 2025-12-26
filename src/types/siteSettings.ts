export interface SiteSettings {
  id: string;

  /* BRAND / FOOTER */
  brandLogo: string;
  brandSubtitle: string;
  // Hero
  heroBadge?: string | null;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;

  // About
    aboutHeading: string;
    aboutText: string;
    aboutImage1: string;    
    aboutImage2: string;

  // Portfolio
  portfolioTitle: string;
  portfolioSubtitle: string;
  portfolioDescription: string;

  // Testimonials
  testimonialTitle: string;
  testimonialSubtitle: string;

  // CTA
  ctaTitle: string;
  ctaSubtitle: string;

  privacyPolicyHtml: string;
  termsHtml: string;
  
  // Contact
  contactEmail: string;
  contactPhone: string;
  address: string;

  // Social
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };

  
  createdAt: string;
  updatedAt: string;
}
