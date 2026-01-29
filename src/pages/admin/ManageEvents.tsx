import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

import {
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  apiUpload,
} from "@/lib/api";

/* =====================================================
   TYPES
===================================================== */
type Event = {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  client: string;
  coverImage: string;
  featured: boolean;
};

type Category = {
  id: string;
  name: string;
};

/* =====================================================
   COMPONENT
===================================================== */
const ManageEvents = () => {
  const { toast } = useToast();
  const token = localStorage.getItem("token");

  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    client: "",
    coverImage: "",
    featured: false,
  });

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    loadEvents();
    loadCategories();
  }, []);

  async function loadEvents() {
    try {
      const data = await apiGet<Event[]>("/events");
      setEvents(data);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive",
      });
    }
  }

  async function loadCategories() {
    try {
      const data = await apiGet<Category[]>("/categories");
      setCategories(data);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      });
    }
  }

  /* ================= FORM ================= */
  function openCreate() {
    setEditing(null);
    setForm({
      title: "",
      description: "",
      category: "",
      date: "",
      client: "",
      coverImage: "",
      featured: false,
    });
    setOpen(true);
  }

  function openEdit(event: Event) {
    setEditing(event);
    setForm({
      title: event.title,
      description: event.description,
      category: event.category,
      date: event.date.slice(0, 10),
      client: event.client,
      coverImage: event.coverImage,
      featured: !!event.featured,
    });
    setOpen(true);
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const target = e.target as HTMLInputElement;
    const name = target.name;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  /* ================= IMAGE UPLOAD ================= */
  async function uploadCover(file: File) {
    if (!token) return;

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);

      const res = await apiUpload<{ url: string }>(
        "/events/upload-cover",
        fd,
        token
      );

      setForm((prev) => ({ ...prev, coverImage: res.url }));
    } catch {
      toast({
        title: "Upload failed",
        description: "Could not upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  }

  /* ================= SAVE ================= */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;

    try {
      const payload = {
        ...form,
        date: new Date(form.date),
      };

      if (editing) {
        await apiPut(`/events/${editing.id}`, payload, token);
        toast({ title: "Work updated" });
      } else {
        await apiPost("/events", payload, token);
        toast({ title: "Work created" });
      }

      setOpen(false);
      loadEvents();
    } catch {
      toast({
        title: "Error",
        description: "Failed to save event",
        variant: "destructive",
      });
    }
  }

  /* ================= DELETE ================= */
  async function remove(id: string) {
    if (!token) return;
    if (!confirm("Delete this event?")) return;

    await apiDelete(`/events/${id}`, token);
    toast({ title: "Event deleted" });
    loadEvents();
  }

  const filtered = events.filter(
    (e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.category.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= UI ================= */
  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="font-serif text-3xl font-bold">Manage Works</h1>
          <Button variant="gold" onClick={openCreate}>
            <Plus size={18} /> Add Work
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
          <Input
            placeholder="Search works..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Table */}
        <motion.div className="bg-card border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="p-4 text-left">Work</th>
                <th className="p-4">Category</th>
                <th className="p-4">Date</th>
                <th className="p-4">Client</th>
                <th className="p-4 text-right"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id} className="border-b hover:bg-secondary/30">
                  <td className="p-4 flex gap-3 items-center">
                    {e.coverImage && (
                      <img
                        src={e.coverImage}
                        className="w-14 h-10 rounded object-cover"
                      />
                    )}
                    <div className="flex items-center gap-2">
                      <span>{e.title}</span>
                      {e.featured && (
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">{e.category}</td>
                  <td className="p-4">
                    {new Date(e.date).toLocaleDateString()}
                  </td>
                  <td className="p-4">{e.client}</td>
                  <td className="p-4 text-right space-x-2">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(e)}>
                      <Pencil size={16} />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => remove(e.id)}>
                      <Trash2 size={16} className="text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editing ? "Edit Work" : "Create Work"}
              </DialogTitle>
              <DialogDescription>
                Fill in the details below
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input name="title" value={form.title} onChange={handleChange} placeholder="Title" />
              <Textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" />

              <div className="grid grid-cols-2 gap-4">
                <Input name="client" value={form.client} onChange={handleChange} placeholder="Client" />
                <Input type="date" name="date" value={form.date} onChange={handleChange} />
              </div>

              {/* ✅ Styled Category Dropdown */}
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full h-10 rounded-md border border-border bg-background px-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* Featured */}
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={handleChange}
                />
                <span className="text-sm">Feature this work</span>
              </label>

              {form.coverImage && (
                <img src={form.coverImage} className="rounded-md max-h-48" />
              )}

              <Input type="file" accept="image/*" onChange={(e) => e.target.files && uploadCover(e.target.files[0])} />

              <div className="flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="gold">
                  Save
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default ManageEvents;
