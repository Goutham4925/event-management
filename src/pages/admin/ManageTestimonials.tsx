import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Star } from "lucide-react";

import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";

type Testimonial = {
  id: string;
  name: string;
  role: string;
  message: string;
  featured: boolean;
};

const ManageTestimonials = () => {
  const { toast } = useToast();
  const token = localStorage.getItem("token")!;

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);

  const [form, setForm] = useState({
    name: "",
    role: "",
    message: "",
    featured: false,
  });

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await apiGet<Testimonial[]>("/testimonials");
    setTestimonials(data);
  }

  function openCreate() {
    setEditing(null);
    setForm({ name: "", role: "", message: "", featured: false });
    setOpen(true);
  }

  function openEdit(t: Testimonial) {
    setEditing(t);
    setForm(t);
    setOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();

    if (editing) {
      await apiPut(`/testimonials/${editing.id}`, form, token);
      toast({ title: "Testimonial updated" });
    } else {
      await apiPost("/testimonials", form, token);
      toast({ title: "Testimonial created" });
    }

    setOpen(false);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete testimonial?")) return;
    await apiDelete(`/testimonials/${id}`, token);
    toast({ title: "Deleted" });
    load();
  }

  return (
    <AdminLayout>
      <div className="space-y-8">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-serif text-3xl font-bold">Manage Testimonials</h1>
            <p className="text-muted-foreground">
              Control which testimonials appear on the homepage
            </p>
          </div>

          <Button variant="gold" onClick={openCreate}>
            <Plus size={18} /> Add Testimonial
          </Button>
        </div>

        {/* GRID */}
        <motion.div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-card border rounded-lg p-6 relative group"
            >
              {/* ACTIONS */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100">
                <Button size="icon" variant="ghost" onClick={() => openEdit(t)}>
                  <Pencil size={16} />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-destructive"
                  onClick={() => remove(t.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>

              {/* CONTENT */}
              <p className="italic mb-4">“{t.message}”</p>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{t.name}</h4>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </div>

                {t.featured && (
                  <Star className="text-primary fill-primary" size={18} />
                )}
              </div>
            </div>
          ))}
        </motion.div>

        {/* DIALOG */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editing ? "Edit Testimonial" : "Add Testimonial"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={save} className="space-y-4 mt-4">
              <Input
                placeholder="Client Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />

              <Input
                placeholder="Role / Company"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                required
              />

              <Textarea
                placeholder="Client feedback"
                rows={4}
                value={form.message}
                onChange={(e) =>
                  setForm({ ...form, message: e.target.value })
                }
                required
              />

              {/* FEATURED TOGGLE */}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) =>
                    setForm({ ...form, featured: e.target.checked })
                  }
                />
                Feature on homepage
              </label>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="ghost" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button variant="gold" type="submit">
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

export default ManageTestimonials;
