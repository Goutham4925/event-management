import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { useEffect, useState } from "react";

import { apiGet } from "@/lib/api";
import LegalModal from "@/components/ui/LegalModal";

/* ================= TYPES ================= */
type Category = {
  id: string;
  name: string;
};

type ContactPage = {
  email?: string;
  phone?: string;
  address?: string;
};

type SocialLinks = {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
};

type SiteSettings = {
  brandLogo?: string;
  brandSubtitle?: string;
  socialLinks?: SocialLinks;

  privacyPolicyHtml?: string;
  termsHtml?: string;
};
/* ================= URL NORMALIZER ================= */
function normalizeUrl(url?: string) {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
}

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const [categories, setCategories] = useState<Category[]>([]);
  const [contact, setContact] = useState<ContactPage | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  const [legalOpen, setLegalOpen] = useState<"privacy" | "terms" | null>(null);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    async function loadFooterData() {
      try {
        const [cats, contactPage, siteSettings] = await Promise.all([
          apiGet<Category[]>("/categories"),
          apiGet<ContactPage | null>("/contact-page"),
          apiGet<SiteSettings>("/settings"),
        ]);

        setCategories(cats ?? []);
        setContact(contactPage);
        setSettings(siteSettings);
      } catch (err) {
        console.error("Failed to load footer data", err);
      }
    }

    loadFooterData();
  }, []);

  return (
    <>
      <footer className="bg-card border-t border-border">
        <div className="container mx-auto px-4 py-16">

          {/* ================= GRID ================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

            {/* ================= BRAND ================= */}
            <div className="space-y-4">
              <Link to="/" className="inline-block">
                {settings?.brandLogo ? (
                  <img
                    src={settings.brandLogo}
                    alt="Brand Logo"
                    className="h-12 object-contain"
                  />
                ) : (
                  <span className="text-2xl font-serif font-bold text-gradient-gold">
                    Brand
                  </span>
                )}
              </Link>

              {settings?.brandSubtitle && (
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {settings.brandSubtitle}
                </p>
              )}

              {/* ================= SOCIAL LINKS ================= */}
              <div className="flex space-x-4 pt-2">
                {settings?.socialLinks?.facebook && (
                  <a
                    href={normalizeUrl(settings.socialLinks.facebook)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    <Facebook size={20} />
                  </a>
                )}

                {settings?.socialLinks?.instagram && (
                  <a
                    href={normalizeUrl(settings.socialLinks.instagram)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    <Instagram size={20} />
                  </a>
                )}

                {settings?.socialLinks?.twitter && (
                  <a
                    href={normalizeUrl(settings.socialLinks.twitter)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    <Twitter size={20} />
                  </a>
                )}

                {settings?.socialLinks?.linkedin && (
                  <a
                    href={normalizeUrl(settings.socialLinks.linkedin)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    <Linkedin size={20} />
                  </a>
                )}
              </div>
            </div>

            {/* ================= QUICK LINKS ================= */}
            <div>
              <h4 className="font-serif text-lg font-semibold mb-6">
                Quick Links
              </h4>
              <nav className="space-y-3">
                {[
                  { name: "Home", path: "/" },
                  { name: "About Us", path: "/about" },
                  { name: "Our Work", path: "/works" },
                  { name: "Gallery", path: "/gallery" },
                  { name: "Testimonials", path: "/testimonials" },
                  { name: "Contact", path: "/contact" },
                ].map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="block text-muted-foreground hover:text-primary transition text-sm"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* ================= SERVICES ================= */}
            <div>
              <h4 className="font-serif text-lg font-semibold mb-6">
                Services
              </h4>
              <ul className="space-y-3">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      to={`/works?category=${encodeURIComponent(cat.name)}`}
                      className="text-muted-foreground text-sm hover:text-primary transition"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ================= CONTACT ================= */}
            <div>
              <h4 className="font-serif text-lg font-semibold mb-6">
                Contact Us
              </h4>

              <div className="space-y-4">
                {contact?.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex gap-3 text-muted-foreground hover:text-primary transition"
                  >
                    <Mail size={18} />
                    <span className="text-sm">{contact.email}</span>
                  </a>
                )}

                {contact?.phone && (
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex gap-3 text-muted-foreground hover:text-primary transition"
                  >
                    <Phone size={18} />
                    <span className="text-sm">{contact.phone}</span>
                  </a>
                )}

                {contact?.address && (
                  <div className="flex gap-3 text-muted-foreground">
                    <MapPin size={18} />
                    <span className="text-sm">{contact.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ================= BOTTOM BAR ================= */}
          <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              © {currentYear} Ineffable Design Solutions. All rights reserved.
            </p>

            <div className="flex gap-6 text-sm text-muted-foreground">
              <button
                onClick={() => setLegalOpen("privacy")}
                className="hover:text-primary transition"
              >
                Privacy Policy
              </button>

              <button
                onClick={() => setLegalOpen("terms")}
                className="hover:text-primary transition"
              >
                Terms & Conditions
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* ================= LEGAL MODALS ================= */}
      <LegalModal
        open={legalOpen === "privacy"}
        title="Privacy Policy"
        content={settings?.privacyPolicyHtml}
        onClose={() => setLegalOpen(null)}
      />

      <LegalModal
        open={legalOpen === "terms"}
        title="Terms & Conditions"
        content={settings?.termsHtml}
        onClose={() => setLegalOpen(null)}
      />
    </>
  );
};

export default Footer;
