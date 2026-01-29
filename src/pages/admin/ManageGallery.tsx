import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Upload, Trash2 } from "lucide-react";

import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiGet, apiUpload, apiDelete } from "@/lib/api";
import { Event } from "@/types/event";

type GalleryImage = {
  id: string;
  imageUrl: string;
  event?: { id: string; title: string };
};

const ManageGallery = () => {
  const { toast } = useToast();
  const token = localStorage.getItem("token")!;

  const [events, setEvents] = useState<Event[]>([]);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedEvent, setSelectedEvent] = useState("");

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    const [ev, imgs] = await Promise.all([
      apiGet<Event[]>("/events"),
      apiGet<GalleryImage[]>("/gallery"),
    ]);
    setEvents(ev);
    setImages(imgs);
  }

  async function uploadImage(file: File) {
    if (!selectedEvent) {
      toast({
        title: "Select an event first",
        variant: "destructive",
      });
      return;
    }

    const fd = new FormData();
    fd.append("image", file);

    await apiUpload(`/gallery/${selectedEvent}`, fd, token);
    toast({ title: "Image uploaded" });
    loadAll();
  }

  async function remove(id: string) {
    if (!confirm("Delete image?")) return;
    await apiDelete(`/gallery/${id}`, token);
    toast({ title: "Image deleted" });
    loadAll();
  }

  return (
    <AdminLayout>
      {/* 🔒 ISOLATION WRAPPER */}
      <div className="w-full flex justify-center">
        <div className="w-full max-w-6xl flex flex-col gap-10">

          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl font-bold">
                Manage Gallery
              </h1>
              <p className="text-muted-foreground">
                Upload and manage gallery images by event.
              </p>
            </div>

            {/* <Button variant="gold" asChild>
              <label className="flex items-center gap-2 cursor-pointer">
                <Upload size={18} />
                Upload Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files && uploadImage(e.target.files[0])
                  }
                />
              </label>
            </Button> */}
          </div>

          {/* EVENT SELECT */}
          <div className="max-w-md">
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="w-full h-10 border rounded-md px-3 bg-background"
            >
              <option value="">Select Work</option>
              {events.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.title}
                </option>
              ))}
            </select>
          </div>

          {/* UPLOAD DROPZONE (FIXED) */}
          <motion.label
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-card border-2 border-dashed border-border rounded-lg p-14
                       flex flex-col items-center justify-center text-center
                       hover:border-primary/60 transition cursor-pointer"
          >
            <Upload className="mb-4 text-muted-foreground" size={48} />
            <h3 className="font-medium mb-1">
              Drop image here or click to upload
            </h3>
            <p className="text-muted-foreground text-sm">
              JPG, PNG, WebP up to 5MB
            </p>

            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) =>
                e.target.files && uploadImage(e.target.files[0])
              }
            />
          </motion.label>

          {/* GALLERY GRID */}
          <div>
            <h2 className="font-serif text-xl font-bold mb-6">
              Current Images ({images.length})
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="relative group aspect-square rounded-lg overflow-hidden bg-secondary"
                >
                  <img
                    src={img.imageUrl}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-background/80 opacity-0
                                  group-hover:opacity-100 transition
                                  flex items-center justify-center">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => remove(img.id)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {images.length === 0 && (
              <div className="text-center py-12 border rounded-lg mt-6">
                <p className="text-muted-foreground">
                  No images uploaded yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageGallery;
