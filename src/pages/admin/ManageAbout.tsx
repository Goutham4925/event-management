import { useEffect, useState } from "react";
import { Save, Upload, Plus, Trash2 } from "lucide-react";

import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiGet, apiPut } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

/* ================= TYPES ================= */
type AboutValue = {
  icon: string;
  title: string;
  description?: string;
};

type AboutPage = {
  heroTitle: string;
  heroSubtitle: string;

  storyTitle?: string;
  storyContent?: string;

  vision?: string;
  mission?: string;

  /* ✅ NEW */
  valuesSectionTitle?: string;
  valuesSectionSubtitle?: string;

  values?: AboutValue[];

  heroImage?: string;
  yearsExperience?: number;
};

const ICON_OPTIONS = [
  "Heart",
  "Award",
  "Target",
  "Eye",
  "Star",
  "Sparkles",
  "Users",
];

const ManageAbout = () => {
  const { toast } = useToast();
  const token = localStorage.getItem("token")!;

  const [about, setAbout] = useState<AboutPage | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  /* ================= LOAD ================= */
  useEffect(() => {
    apiGet<AboutPage>("/about").then(setAbout);
  }, []);

  /* ================= SAVE ================= */
  async function saveAbout() {
    if (!about) return;

    try {
      setSaving(true);
      await apiPut("/about", about, token);
      toast({ title: "About page updated successfully" });
    } catch {
      toast({
        title: "Error",
        description: "Failed to save About page",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }

  /* ================= HERO IMAGE UPLOAD ================= */
  async function uploadHeroImage(file: File) {
    setUploading(true);

    try {
      const fd = new FormData();
      fd.append("image", file);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/about/upload-hero`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        }
      );

      if (!res.ok) throw new Error();

      const data = await res.json();

      setAbout((prev) =>
        prev ? { ...prev, heroImage: data.heroImage } : prev
      );

      toast({ title: "Hero image uploaded" });
    } catch {
      toast({
        title: "Upload failed",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  }

  if (!about) return null;

  return (
    <AdminLayout>
      <div className="max-w-5xl space-y-8">

        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold">About Page</h1>
            <p className="text-muted-foreground">
              Manage About page content
            </p>
          </div>

          <Button onClick={saveAbout} disabled={saving}>
            <Save size={18} className="mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {/* ================= HERO ================= */}
        <section className="bg-card border rounded-lg p-6 space-y-4">
          <h2 className="font-semibold text-lg">Hero Section</h2>

          <Input
            placeholder="Hero Title"
            value={about.heroTitle}
            onChange={(e) =>
              setAbout({ ...about, heroTitle: e.target.value })
            }
          />

          <Textarea
            placeholder="Hero Subtitle"
            value={about.heroSubtitle}
            onChange={(e) =>
              setAbout({ ...about, heroSubtitle: e.target.value })
            }
          />

          <div className="space-y-2">
            {about.heroImage && (
              <img
                src={about.heroImage}
                className="rounded-lg max-h-56 object-cover"
              />
            )}

            <label className="inline-flex items-center gap-2 cursor-pointer text-sm">
              <Upload size={16} />
              {uploading ? "Uploading..." : "Upload Hero Image"}
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files && uploadHeroImage(e.target.files[0])
                }
              />
            </label>
          </div>
        </section>

        {/* ================= STORY ================= */}
        <section className="bg-card border rounded-lg p-6 space-y-4">
          <h2 className="font-semibold text-lg">Our Story</h2>

          <Input
            placeholder="Story Title"
            value={about.storyTitle || ""}
            onChange={(e) =>
              setAbout({ ...about, storyTitle: e.target.value })
            }
          />

          <Textarea
            rows={5}
            placeholder="Story Content"
            value={about.storyContent || ""}
            onChange={(e) =>
              setAbout({ ...about, storyContent: e.target.value })
            }
          />
        </section>

        {/* ================= VISION & MISSION ================= */}
        <section className="bg-card border rounded-lg p-6 space-y-4">
          <h2 className="font-semibold text-lg">
            Vision & Mission
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Vision
              </label>
              <Textarea
                rows={4}
                placeholder="Describe your vision"
                value={about.vision || ""}
                onChange={(e) =>
                  setAbout({ ...about, vision: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Mission
              </label>
              <Textarea
                rows={4}
                placeholder="Describe your mission"
                value={about.mission || ""}
                onChange={(e) =>
                  setAbout({ ...about, mission: e.target.value })
                }
              />
            </div>
          </div>
        </section>


        {/* ================= VALUES SECTION HEADER ================= */}
        <section className="bg-card border rounded-lg p-6 space-y-4">
          <h2 className="font-semibold text-lg">Values Section</h2>

          <Input
            placeholder="Values Section Title (e.g. What Drives Us)"
            value={about.valuesSectionTitle || ""}
            onChange={(e) =>
              setAbout({ ...about, valuesSectionTitle: e.target.value })
            }
          />

          <Textarea
            placeholder="Values Section Subtitle (e.g. Our Core Beliefs)"
            value={about.valuesSectionSubtitle || ""}
            onChange={(e) =>
              setAbout({ ...about, valuesSectionSubtitle: e.target.value })
            }
          />
        </section>

        {/* ================= VALUES (DYNAMIC LIST) ================= */}
        <section className="bg-card border rounded-lg p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Values Items</h3>
            <Button
              size="sm"
              onClick={() =>
                setAbout({
                  ...about,
                  values: [
                    ...(about.values || []),
                    { icon: "Heart", title: "", description: "" },
                  ],
                })
              }
            >
              <Plus size={16} /> Add Value
            </Button>
          </div>

          {(about.values || []).map((v, i) => (
            <div
              key={i}
              className="grid md:grid-cols-4 gap-4 items-start border rounded-lg p-4"
            >
              <select
                value={v.icon}
                onChange={(e) => {
                  const values = [...(about.values || [])];
                  values[i].icon = e.target.value;
                  setAbout({ ...about, values });
                }}
                className="border rounded-md px-3 py-2 bg-background"
              >
                {ICON_OPTIONS.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>

              <Input
                placeholder="Title"
                value={v.title}
                onChange={(e) => {
                  const values = [...(about.values || [])];
                  values[i].title = e.target.value;
                  setAbout({ ...about, values });
                }}
              />

              <Textarea
                rows={2}
                placeholder="Description"
                value={v.description || ""}
                onChange={(e) => {
                  const values = [...(about.values || [])];
                  values[i].description = e.target.value;
                  setAbout({ ...about, values });
                }}
              />

              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  setAbout({
                    ...about,
                    values: about.values?.filter((_, idx) => idx !== i),
                  })
                }
              >
                <Trash2 size={16} className="text-destructive" />
              </Button>
            </div>
          ))}
        </section>

        {/* ================= EXPERIENCE ================= */}
        <section className="bg-card border rounded-lg p-6">
          <Input
            type="number"
            placeholder="Years of Experience"
            value={about.yearsExperience || ""}
            onChange={(e) =>
              setAbout({
                ...about,
                yearsExperience: Number(e.target.value),
              })
            }
          />
        </section>
        
      </div>
    </AdminLayout>
  );
};

export default ManageAbout;
