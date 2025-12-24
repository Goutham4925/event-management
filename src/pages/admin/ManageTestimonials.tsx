import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { testimonials as initialTestimonials, Testimonial } from '@/data/mockData';

const ManageTestimonials = () => {
  const { toast } = useToast();
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const openEditDialog = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      role: testimonial.role,
      message: testimonial.message,
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingTestimonial(null);
    setFormData({
      name: '',
      role: '',
      message: '',
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTestimonial) {
      setTestimonials(prev => prev.map(t =>
        t.id === editingTestimonial.id
          ? { ...t, ...formData }
          : t
      ));
      toast({
        title: "Testimonial Updated",
        description: "The testimonial has been updated successfully.",
      });
    } else {
      const newTestimonial: Testimonial = {
        id: String(Date.now()),
        ...formData,
      };
      setTestimonials(prev => [newTestimonial, ...prev]);
      toast({
        title: "Testimonial Created",
        description: "The new testimonial has been added successfully.",
      });
    }
    
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
    toast({
      title: "Testimonial Deleted",
      description: "The testimonial has been removed.",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">Manage Testimonials</h1>
            <p className="text-muted-foreground mt-1">
              Add and manage client testimonials.
            </p>
          </div>
          
          <Button variant="gold" onClick={openCreateDialog}>
            <Plus size={18} />
            Add Testimonial
          </Button>
        </div>

        {/* Testimonials Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-card rounded-lg border border-border p-6 relative group"
            >
              {/* Actions */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEditDialog(testimonial)}
                >
                  <Pencil size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDelete(testimonial.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>

              {/* Content */}
              <p className="text-foreground italic mb-4 pr-16">
                "{testimonial.message}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center">
                  <span className="text-primary-foreground font-semibold">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-foreground">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {testimonials.length === 0 && (
          <div className="text-center py-12 bg-card rounded-lg border border-border">
            <p className="text-muted-foreground">No testimonials yet.</p>
          </div>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl">
                {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Client Name
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Emily Thompson"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Role / Company
                </label>
                <Input
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="Bride, CEO of Company, etc."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Testimonial Message
                </label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="What did the client say about your service?"
                  rows={4}
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="gold">
                  {editingTestimonial ? 'Update' : 'Add Testimonial'}
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
