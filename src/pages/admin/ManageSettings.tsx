import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Save } from "lucide-react";

import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiGet, apiPut } from "@/lib/api";
import { SiteSettings } from "@/types/siteSettings";

/* =====================================================
   FORM SHAPE (FLAT FOR UI)
===================================================== */
type SettingsForm = {
  // Hero
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;

  // About
  aboutHeading: string;
  aboutText: string;
  vision: string;
  mission: string;

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

  // Contact
  contactEmail: string;
  contactPhone: string;
  address: string;

  // Social
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
};

const emptySettings: SettingsForm = {
  heroBadge: "",
  heroTitle: "",
  heroSubtitle: "",
  heroImage: "",

  aboutHeading: "",
  aboutText: "",
  vision: "",
  mission: "",

  portfolioTitle: "",
  portfolioSubtitle: "",
  portfolioDescription: "",

  testimonialTitle: "",
  testimonialSubtitle: "",

  ctaTitle: "",
  ctaSubtitle: "",

  contactEmail: "",
  contactPhone: "",
  address: "",

  facebook: "",
  instagram: "",
  twitter: "",
  linkedin: "",
};

const ManageSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<SettingsForm>(emptySettings);

  /* =====================================================
     LOAD SETTINGS
  ===================================================== */
  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await apiGet<SiteSettings>("/settings");

        setSettings({
          heroBadge: data.heroBadge ?? "",
          heroTitle: data.heroTitle ?? "",
          heroSubtitle: data.heroSubtitle ?? "",
          heroImage: data.heroImage ?? "",

          aboutHeading: data.aboutHeading ?? "",
          aboutText: data.aboutText ?? "",
          vision: data.vision ?? "",
          mission: data.mission ?? "",

          portfolioTitle: data.portfolioTitle ?? "",
          portfolioSubtitle: data.portfolioSubtitle ?? "",
          portfolioDescription: data.portfolioDescription ?? "",

          testimonialTitle: data.testimonialTitle ?? "",
          testimonialSubtitle: data.testimonialSubtitle ?? "",

          ctaTitle: data.ctaTitle ?? "",
          ctaSubtitle: data.ctaSubtitle ?? "",

          contactEmail: data.contactEmail ?? "",
          contactPhone: data.contactPhone ?? "",
          address: data.address ?? "",

          facebook: (data.socialLinks as any)?.facebook ?? "",
          instagram: (data.socialLinks as any)?.instagram ?? "",
          twitter: (data.socialLinks as any)?.twitter ?? "",
          linkedin: (data.socialLinks as any)?.linkedin ?? "",
        });
      } catch {
        toast({
          title: "Error",
          description: "Failed to load site settings",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, [toast]);

  /* =====================================================
     HANDLE CHANGE
  ===================================================== */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  /* =====================================================
     SAVE SETTINGS
  ===================================================== */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const token = localStorage.getItem("token");

      await apiPut(
        "/settings",
        {
          heroBadge: settings.heroBadge,
          heroTitle: settings.heroTitle,
          heroSubtitle: settings.heroSubtitle,
          heroImage: settings.heroImage,

          aboutHeading: settings.aboutHeading,
          aboutText: settings.aboutText,
          vision: settings.vision,
          mission: settings.mission,

          portfolioTitle: settings.portfolioTitle,
          portfolioSubtitle: settings.portfolioSubtitle,
          portfolioDescription: settings.portfolioDescription,

          testimonialTitle: settings.testimonialTitle,
          testimonialSubtitle: settings.testimonialSubtitle,

          ctaTitle: settings.ctaTitle,
          ctaSubtitle: settings.ctaSubtitle,

          contactEmail: settings.contactEmail,
          contactPhone: settings.contactPhone,
          address: settings.address,

          socialLinks: {
            facebook: settings.facebook,
            instagram: settings.instagram,
            twitter: settings.twitter,
            linkedin: settings.linkedin,
          },
        },
        token || undefined
      );

      toast({
        title: "Saved",
        description: "Site settings updated successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return null;

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">

        <Section title="Hero Section">
          <Input name="heroBadge" value={settings.heroBadge} onChange={handleChange} />
          <Input name="heroTitle" value={settings.heroTitle} onChange={handleChange} />
          <Textarea name="heroSubtitle" value={settings.heroSubtitle} onChange={handleChange} />
          <Input name="heroImage" value={settings.heroImage} onChange={handleChange} />
        </Section>

        <Section title="About Section">
          <Input name="aboutHeading" value={settings.aboutHeading} onChange={handleChange} />
          <Textarea name="aboutText" value={settings.aboutText} onChange={handleChange} />
        </Section>

        <Section title="Portfolio Section">
          <Input name="portfolioTitle" value={settings.portfolioTitle} onChange={handleChange} />
          <Input name="portfolioSubtitle" value={settings.portfolioSubtitle} onChange={handleChange} />
          <Textarea name="portfolioDescription" value={settings.portfolioDescription} onChange={handleChange} />
        </Section>

        <Section title="Testimonials Section">
          <Input name="testimonialTitle" value={settings.testimonialTitle} onChange={handleChange} />
          <Textarea name="testimonialSubtitle" value={settings.testimonialSubtitle} onChange={handleChange} />
        </Section>

        <Section title="CTA Section">
          <Input name="ctaTitle" value={settings.ctaTitle} onChange={handleChange} />
          <Textarea name="ctaSubtitle" value={settings.ctaSubtitle} onChange={handleChange} />
        </Section>

        <Section title="Contact Information">
          <Input name="contactEmail" value={settings.contactEmail} onChange={handleChange} />
          <Input name="contactPhone" value={settings.contactPhone} onChange={handleChange} />
          <Textarea name="address" value={settings.address} onChange={handleChange} />
        </Section>

        <Section title="Social Links">
          <Input name="facebook" value={settings.facebook} onChange={handleChange} />
          <Input name="instagram" value={settings.instagram} onChange={handleChange} />
          <Input name="twitter" value={settings.twitter} onChange={handleChange} />
          <Input name="linkedin" value={settings.linkedin} onChange={handleChange} />
        </Section>

        <div className="flex justify-end">
          <Button type="submit" variant="gold" disabled={isSaving}>
            <Save size={16} className="mr-2" />
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default ManageSettings;

/* =====================================================
   SECTION WRAPPER
===================================================== */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border p-6 rounded-lg space-y-4"
    >
      <h2 className="font-serif text-xl font-bold">{title}</h2>
      {children}
    </motion.div>
  );
}
