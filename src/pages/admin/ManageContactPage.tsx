import { useEffect, useState } from "react";
import { Save, Plus, Trash2 } from "lucide-react";

import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiGet, apiPut } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

type ContactPage = {
  badge?: string;
  title: string;
  subtitle?: string;

  email?: string;
  phone?: string;
  address?: string;

  eventTypes?: string[];
};

const ManageContactPage = () => {
  const { toast } = useToast();
  const token = localStorage.getItem("token")!;
  const [data, setData] = useState<ContactPage | null>(null);
  const [saving, setSaving] = useState(false);

    useEffect(() => {
    apiGet<ContactPage | null>("/contact-page").then((res) => {
        setData(
        res ?? {
            badge: "Get in Touch",
            title: "Let’s Create Something Beautiful",
            subtitle: "Ready to start planning your event? We’d love to hear from you.",
            email: "",
            phone: "",
            address: "",
            eventTypes: [],
        }
        );
    });
    }, []);


  async function save() {
    try {
      setSaving(true);
      await apiPut("/contact-page", data, token);
      toast({ title: "Contact page updated" });
    } finally {
      setSaving(false);
    }
  }

  if (!data) return null;

  return (
    <AdminLayout>
      <div className="max-w-4xl space-y-8">

        {/* Header */}
        <div className="flex justify-between">
          <h1 className="font-serif text-3xl font-bold">Contact Page</h1>
          <Button onClick={save} disabled={saving}>
            <Save className="mr-2" /> Save
          </Button>
        </div>

        {/* Hero */}
        <section className="bg-card border rounded-lg p-6 space-y-4">
          <Input
            placeholder="Badge (Get in Touch)"
            value={data.badge || ""}
            onChange={(e) => setData({ ...data, badge: e.target.value })}
          />
          <Input
            placeholder="Title"
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
          />
          <Textarea
            placeholder="Subtitle"
            value={data.subtitle || ""}
            onChange={(e) => setData({ ...data, subtitle: e.target.value })}
          />
        </section>

        {/* Contact Info */}
        <section className="bg-card border rounded-lg p-6 space-y-4">
          <Input
            placeholder="Email"
            value={data.email || ""}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
          <Input
            placeholder="Phone"
            value={data.phone || ""}
            onChange={(e) => setData({ ...data, phone: e.target.value })}
          />
          <Textarea
            placeholder="Address"
            value={data.address || ""}
            onChange={(e) => setData({ ...data, address: e.target.value })}
          />
        </section>

        {/* Event Types */}
        <section className="bg-card border rounded-lg p-6 space-y-4">
          <div className="flex justify-between">
            <h3 className="font-semibold">Event Types</h3>
            <Button
              size="sm"
              onClick={() =>
                setData({
                  ...data,
                  eventTypes: [...(data.eventTypes || []), ""],
                })
              }
            >
              <Plus size={14} /> Add
            </Button>
          </div>

          {(data.eventTypes || []).map((t, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={t}
                onChange={(e) => {
                  const arr = [...(data.eventTypes || [])];
                  arr[i] = e.target.value;
                  setData({ ...data, eventTypes: arr });
                }}
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={() =>
                  setData({
                    ...data,
                    eventTypes: data.eventTypes?.filter((_, idx) => idx !== i),
                  })
                }
              >
                <Trash2 className="text-destructive" size={16} />
              </Button>
            </div>
          ))}
        </section>
      </div>
    </AdminLayout>
  );
};

export default ManageContactPage;
