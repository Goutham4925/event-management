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
   TYPES
===================================================== */
type SocialLinks = {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
};

type SettingsForm = {
  brandLogo: string;
  brandSubtitle: string;

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

  socialLinks: SocialLinks;

  privacyPolicyHtml: string;
  termsHtml: string;
};

/* ===================================================== */
const emptySettings: SettingsForm = {
  brandLogo: "",
  brandSubtitle: "",
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
  socialLinks: { facebook: "", instagram: "", twitter: "", linkedin: "" },
  privacyPolicyHtml: "",
  termsHtml: "",
};

const ManageSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [settings, setSettings] = useState<SettingsForm>(emptySettings);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await apiGet<SiteSettings>("/settings");
        setSettings({ ...emptySettings, ...data });
      } catch {
        toast({ title: "Error", description: "Failed to load settings", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, [toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (key: keyof SocialLinks, value: string) => {
    setSettings((prev) => ({ ...prev, socialLinks: { ...prev.socialLinks, [key]: value } }));
  };

  const uploadImage = async (
    file: File,
    endpoint: string,
    field: keyof Pick<SettingsForm, "brandLogo" | "heroImage" | "aboutImage1" | "aboutImage2">
  ) => {
    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/settings/${endpoint}`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
      });

      if (!res.ok) throw new Error();
      const updated = await res.json();

      setSettings((prev) => ({ ...prev, [field]: updated[field] }));
      toast({ title: "Image uploaded successfully" });
    } catch {
      toast({ title: "Image upload failed", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await apiPut("/settings", settings, token || undefined);
      toast({ title: "Settings saved successfully" });
    } catch {
      toast({ title: "Save failed", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">

        {/* BRAND */}
        <Section title="Brand & Footer">
          {settings.brandLogo && <img src={settings.brandLogo} className="h-20 object-contain" />}
          <Input type="file" accept="image/*" onChange={(e) => e.target.files && uploadImage(e.target.files[0], "brand-logo", "brandLogo")} />
          <Textarea name="brandSubtitle" placeholder="Footer brand subtitle" value={settings.brandSubtitle} onChange={handleChange} />
        </Section>

        {/* HERO */}
        <Section title="Hero Section">
          <Input name="heroBadge" value={settings.heroBadge} onChange={handleChange} />
          <Input name="heroTitle" value={settings.heroTitle} onChange={handleChange} />
          <Textarea name="heroSubtitle" value={settings.heroSubtitle} onChange={handleChange} />
          {settings.heroImage && <img src={settings.heroImage} className="rounded-lg max-h-56" />}
          <Input type="file" onChange={(e) => e.target.files && uploadImage(e.target.files[0], "hero-image", "heroImage")} />
        </Section>

        {/* ABOUT */}
        <Section title="About Section">
          <Input name="aboutHeading" value={settings.aboutHeading} onChange={handleChange} />
          <Textarea name="aboutText" value={settings.aboutText} onChange={handleChange} />

          {settings.aboutImage1 && <img src={settings.aboutImage1} className="h-32 rounded object-cover" />}
          <Input type="file" onChange={(e) => e.target.files && uploadImage(e.target.files[0], "about-image-1", "aboutImage1")} />

          {settings.aboutImage2 && <img src={settings.aboutImage2} className="h-32 rounded object-cover" />}
          <Input type="file" onChange={(e) => e.target.files && uploadImage(e.target.files[0], "about-image-2", "aboutImage2")} />
        </Section>

        {/* PORTFOLIO */}
        <Section title="Portfolio Section">
          <Input name="portfolioTitle" value={settings.portfolioTitle} onChange={handleChange} />
          <Input name="portfolioSubtitle" value={settings.portfolioSubtitle} onChange={handleChange} />
          <Textarea name="portfolioDescription" value={settings.portfolioDescription} onChange={handleChange} />
        </Section>

        {/* TESTIMONIALS */}
        <Section title="Testimonials Section">
          <Input name="testimonialTitle" value={settings.testimonialTitle} onChange={handleChange} />
          <Input name="testimonialSubtitle" value={settings.testimonialSubtitle} onChange={handleChange} />
        </Section>

        {/* CTA */}
        <Section title="CTA Section">
          <Input name="ctaTitle" value={settings.ctaTitle} onChange={handleChange} />
          <Textarea name="ctaSubtitle" value={settings.ctaSubtitle} onChange={handleChange} />
        </Section>

        {/* SOCIAL */}
        <Section title="Social Media Links">
          {(["facebook", "instagram", "twitter", "linkedin"] as const).map((key) => (
            <Input key={key} placeholder={`${key} URL`} value={settings.socialLinks[key] || ""} onChange={(e) => handleSocialChange(key, e.target.value)} />
          ))}
        </Section>

        {/* LEGAL */}
        <Section title="Legal Pages (HTML)">
          <Textarea rows={10} placeholder="Privacy Policy" value={settings.privacyPolicyHtml} onChange={(e) => setSettings((p) => ({ ...p, privacyPolicyHtml: e.target.value }))} />
          <Textarea rows={10} placeholder="Terms & Conditions" value={settings.termsHtml} onChange={(e) => setSettings((p) => ({ ...p, termsHtml: e.target.value }))} />
        </Section>

        <div className="flex justify-end">
          <Button variant="gold" type="submit" disabled={saving || uploading}>
            <Save size={16} className="mr-2" />
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default ManageSettings;

/* SECTION WRAPPER */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border rounded-lg p-6 space-y-4">
      <h2 className="font-serif text-xl font-bold">{title}</h2>
      {children}
    </motion.div>
  );
}
