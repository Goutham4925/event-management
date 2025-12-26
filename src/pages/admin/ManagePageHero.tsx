import { useEffect, useState } from "react";
import { Save } from "lucide-react";

import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiGet, apiPut } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

/* ================= TYPES ================= */
type PageHero = {
  badge?: string;
  title: string;
  subtitle?: string;
};

interface ManagePageHeroProps {
  pageId: "WORKS" | "GALLERY" | "TESTIMONIALS";
}


/* ================= COMPONENT ================= */
const ManagePageHero = ({ pageId }: ManagePageHeroProps) => {
  const { toast } = useToast();
  const token = localStorage.getItem("token")!;

  const [data, setData] = useState<PageHero | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD ================= */
  useEffect(() => {
    async function load() {
      try {
        const res = await apiGet<PageHero>(`/page-hero/${pageId}`);
        setData(
          res || {
            badge: "",
            title: "",
            subtitle: "",
          }
        );
      } catch {
        toast({
          title: "Error",
          description: "Failed to load page hero",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [pageId]);

  /* ================= SAVE ================= */
  async function save() {
    if (!data) return;

    try {
      setSaving(true);
      await apiPut(`/page-hero/${pageId}`, data, token);

      toast({
        title: "Saved successfully",
        description: `${pageId.toUpperCase()} page hero updated`,
      });
    } catch {
      toast({
        title: "Save failed",
        description: "Could not update page hero",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <AdminLayout>
        <p className="text-muted-foreground">Loading page hero…</p>
      </AdminLayout>
    );
  }

  if (!data) return null;

  /* ================= UI ================= */
  return (
    <AdminLayout>
      <div className="max-w-3xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold capitalize">
              {pageId} Page Hero
            </h1>
            <p className="text-muted-foreground">
              Manage hero content for the {pageId} page
            </p>
          </div>

          <Button onClick={save} disabled={saving}>
            <Save size={18} className="mr-2" />
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>

        {/* Hero Content */}
        <section className="bg-card border rounded-lg p-6 space-y-4">
          <Input
            placeholder="Badge (e.g. Our Portfolio)"
            value={data.badge || ""}
            onChange={(e) =>
              setData({ ...data, badge: e.target.value })
            }
          />

          <Input
            placeholder="Hero Title"
            value={data.title}
            onChange={(e) =>
              setData({ ...data, title: e.target.value })
            }
            required
          />

          <Textarea
            rows={4}
            placeholder="Hero Subtitle"
            value={data.subtitle || ""}
            onChange={(e) =>
              setData({ ...data, subtitle: e.target.value })
            }
          />
        </section>
      </div>
    </AdminLayout>
  );
};

export default ManagePageHero;
