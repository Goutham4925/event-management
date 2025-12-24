import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Upload } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { galleryImages as initialImages } from '@/data/mockData';

const ManageGallery = () => {
  const { toast } = useToast();
  const [images, setImages] = useState<string[]>(initialImages);

  const handleDelete = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    toast({
      title: "Image Deleted",
      description: "The image has been removed from the gallery.",
    });
  };

  const handleUpload = () => {
    // Simulated upload
    toast({
      title: "Upload Feature",
      description: "This would connect to your backend storage for image uploads.",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">Manage Gallery</h1>
            <p className="text-muted-foreground mt-1">
              Upload and manage your gallery images.
            </p>
          </div>
          
          <Button variant="gold" onClick={handleUpload}>
            <Upload size={18} />
            Upload Images
          </Button>
        </div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-card rounded-lg border-2 border-dashed border-border p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
          onClick={handleUpload}
        >
          <Upload className="mx-auto mb-4 text-muted-foreground" size={48} />
          <h3 className="font-medium text-foreground mb-2">
            Drop images here or click to upload
          </h3>
          <p className="text-muted-foreground text-sm">
            Supports JPG, PNG, WebP up to 10MB each
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="font-serif text-xl font-bold text-foreground mb-6">
            Current Images ({images.length})
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative group aspect-square rounded-lg overflow-hidden bg-secondary"
              >
                <img
                  src={image}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(index)}
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {images.length === 0 && (
            <div className="text-center py-12 bg-card rounded-lg border border-border">
              <p className="text-muted-foreground">No images in gallery.</p>
            </div>
          )}
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default ManageGallery;
