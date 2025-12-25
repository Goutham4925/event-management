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
   FORM SHAPE
===================================================== */
type SettingsForm = {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;

  aboutHeading: string;
  aboutText: string;
  aboutImage1: string;
  aboutImage2: string;

  portfolioTitle: string;
  portfolioSubtitle: string;
  portfolioDescription: string;

  testimonialTitle: string;
  testimonialSubtitle: string;

  ctaTitle: string;
  ctaSubtitle: string;
};

const emptySettings: SettingsForm = {
  heroBadge: "",
  heroTitle: "",
  heroSubtitle: "",
  heroImage: "",

  aboutHeading: "",
  aboutText: "",
  aboutImage1: "",
  aboutImage2: "",

  portfolioTitle: "",
  portfolioSubtitle: "",
  portfolioDescription: "",

  testimonialTitle: "",
  testimonialSubtitle: "",

  ctaTitle: "",
  ctaSubtitle: "",
};

const ManageSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [settings, setSettings] = useState<SettingsForm>(emptySettings);

  /* ================= LOAD SETTINGS ================= */
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
          aboutImage1: data.aboutImage1 ?? "",
          aboutImage2: data.aboutImage2 ?? "",

          portfolioTitle: data.portfolioTitle ?? "",
          portfolioSubtitle: data.portfolioSubtitle ?? "",
          portfolioDescription: data.portfolioDescription ?? "",

          testimonialTitle: data.testimonialTitle ?? "",
          testimonialSubtitle: data.testimonialSubtitle ?? "",

          ctaTitle: data.ctaTitle ?? "",
          ctaSubtitle: data.ctaSubtitle ?? "",
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

  /* ================= TEXT CHANGE ================= */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= IMAGE UPLOAD HANDLER ================= */
  const uploadImage = async (
    file: File,
    endpoint: string,
    field: "heroImage" | "aboutImage1" | "aboutImage2"
  ) => {
    setIsUploading(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/settings/${endpoint}`,
        {
          method: "POST",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Upload failed");

      const updated = await res.json();

      setSettings((prev) => ({
        ...prev,
        [field]: updated[field],
      }));

      toast({
        title: "Image uploaded",
        description: "Image updated successfully",
      });
    } catch {
      toast({
        title: "Upload failed",
        description: "Could not upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  /* ================= SAVE TEXT SETTINGS ================= */
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

          aboutHeading: settings.aboutHeading,
          aboutText: settings.aboutText,

          portfolioTitle: settings.portfolioTitle,
          portfolioSubtitle: settings.portfolioSubtitle,
          portfolioDescription: settings.portfolioDescription,

          testimonialTitle: settings.testimonialTitle,
          testimonialSubtitle: settings.testimonialSubtitle,

          ctaTitle: settings.ctaTitle,
          ctaSubtitle: settings.ctaSubtitle,
        },
        token || undefined
      );

      toast({
        title: "Saved",
        description: "Settings updated successfully",
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

        {/* HERO */}
        <Section title="Hero Section">
          <Input name="heroBadge" value={settings.heroBadge} onChange={handleChange} />
          <Input name="heroTitle" value={settings.heroTitle} onChange={handleChange} />
          <Textarea name="heroSubtitle" value={settings.heroSubtitle} onChange={handleChange} />

          {settings.heroImage && (
            <img src={settings.heroImage} className="rounded-lg max-h-56 object-cover" />
          )}

          <Input
            type="file"
            accept="image/*"
            onChange={(e) =>
              e.target.files &&
              uploadImage(e.target.files[0], "hero-image", "heroImage")
            }
          />
        </Section>

        {/* ABOUT */}
        <Section title="About Section">
          <Input name="aboutHeading" value={settings.aboutHeading} onChange={handleChange} />
          <Textarea name="aboutText" value={settings.aboutText} onChange={handleChange} />

          <div className="grid grid-cols-2 gap-4">
            {[1, 2].map((i) => {
              const field = i === 1 ? "aboutImage1" : "aboutImage2";
              return (
                <div key={i} className="space-y-2">
                  {settings[field] && (
                    <img
                      src={settings[field]}
                      className="rounded-lg h-40 w-full object-cover"
                    />
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      e.target.files &&
                      uploadImage(
                        e.target.files[0],
                        `about-image-${i}`,
                        field as any
                      )
                    }
                  />
                </div>
              );
            })}
          </div>

          {isUploading && (
            <p className="text-sm text-muted-foreground">Uploading image…</p>
          )}
        </Section>

        {/* PORTFOLIO */}
        <Section title="Portfolio Section">
          <Input name="portfolioTitle" value={settings.portfolioTitle} onChange={handleChange} />
          <Input name="portfolioSubtitle" value={settings.portfolioSubtitle} onChange={handleChange} />
          <Textarea name="portfolioDescription" value={settings.portfolioDescription} onChange={handleChange} />
        </Section>

        {/* TESTIMONIAL */}
        <Section title="Testimonials Section">
          <Input name="testimonialTitle" value={settings.testimonialTitle} onChange={handleChange} />
          <Textarea name="testimonialSubtitle" value={settings.testimonialSubtitle} onChange={handleChange} />
        </Section>

        {/* CTA */}
        <Section title="CTA Section">
          <Input name="ctaTitle" value={settings.ctaTitle} onChange={handleChange} />
          <Textarea name="ctaSubtitle" value={settings.ctaSubtitle} onChange={handleChange} />
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
