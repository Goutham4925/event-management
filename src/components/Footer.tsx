import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { siteSettings } from '@/data/mockData';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-serif font-bold text-gradient-gold">
                Elegance
              </span>
              <span className="text-2xl font-serif font-light text-foreground ml-1">
                Events
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Crafting unforgettable moments through luxury event management. 
              From weddings to corporate gatherings, we bring your vision to life.
            </p>
            <div className="flex space-x-4 pt-2">
              {siteSettings.socialLinks.facebook && (
                <a
                  href={siteSettings.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors duration-300"
                  aria-label="Facebook"
                >
                  <Facebook size={20} />
                </a>
              )}
              {siteSettings.socialLinks.instagram && (
                <a
                  href={siteSettings.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors duration-300"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </a>
              )}
              {siteSettings.socialLinks.twitter && (
                <a
                  href={siteSettings.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors duration-300"
                  aria-label="Twitter"
                >
                  <Twitter size={20} />
                </a>
              )}
              {siteSettings.socialLinks.linkedin && (
                <a
                  href={siteSettings.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors duration-300"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={20} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-foreground mb-6">
              Quick Links
            </h4>
            <nav className="space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'About Us', path: '/about' },
                { name: 'Our Work', path: '/works' },
                { name: 'Gallery', path: '/gallery' },
                { name: 'Testimonials', path: '/testimonials' },
                { name: 'Contact', path: '/contact' },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block text-muted-foreground hover:text-primary transition-colors duration-300 text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-foreground mb-6">
              Services
            </h4>
            <ul className="space-y-3">
              {[
                'Wedding Planning',
                'Corporate Events',
                'Birthday Celebrations',
                'Product Launches',
                'Anniversary Parties',
                'Destination Events',
              ].map((service) => (
                <li
                  key={service}
                  className="text-muted-foreground text-sm"
                >
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-foreground mb-6">
              Contact Us
            </h4>
            <div className="space-y-4">
              <a
                href={`mailto:${siteSettings.contactEmail}`}
                className="flex items-start space-x-3 text-muted-foreground hover:text-primary transition-colors duration-300"
              >
                <Mail size={18} className="mt-0.5 flex-shrink-0" />
                <span className="text-sm">{siteSettings.contactEmail}</span>
              </a>
              <a
                href={`tel:${siteSettings.contactPhone}`}
                className="flex items-start space-x-3 text-muted-foreground hover:text-primary transition-colors duration-300"
              >
                <Phone size={18} className="mt-0.5 flex-shrink-0" />
                <span className="text-sm">{siteSettings.contactPhone}</span>
              </a>
              <div className="flex items-start space-x-3 text-muted-foreground">
                <MapPin size={18} className="mt-0.5 flex-shrink-0" />
                <span className="text-sm">{siteSettings.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-muted-foreground text-sm">
            © {currentYear} Elegance Events. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-primary transition-colors duration-300">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-primary transition-colors duration-300">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
