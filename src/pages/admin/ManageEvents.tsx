import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Search, X } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { events as initialEvents, Event } from '@/data/mockData';

const ManageEvents = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    date: '',
    client: '',
  });

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const openEditDialog = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      category: event.category,
      date: event.date,
      client: event.client,
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      category: '',
      date: '',
      client: '',
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingEvent) {
      // Update existing event
      setEvents(prev => prev.map(event =>
        event.id === editingEvent.id
          ? { ...event, ...formData }
          : event
      ));
      toast({
        title: "Event Updated",
        description: "The event has been updated successfully.",
      });
    } else {
      // Create new event
      const newEvent: Event = {
        id: String(Date.now()),
        ...formData,
        coverImage: events[0].coverImage, // Placeholder
        gallery: [],
      };
      setEvents(prev => [newEvent, ...prev]);
      toast({
        title: "Event Created",
        description: "The new event has been created successfully.",
      });
    }
    
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
    toast({
      title: "Event Deleted",
      description: "The event has been deleted successfully.",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">Manage Events</h1>
            <p className="text-muted-foreground mt-1">
              Create, edit, and manage your event listings.
            </p>
          </div>
          
          <Button variant="gold" onClick={openCreateDialog}>
            <Plus size={18} />
            Add Event
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card"
          />
        </div>

        {/* Events Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-card rounded-lg border border-border overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50 border-b border-border">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Event</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Category</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Client</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={event.coverImage}
                          alt={event.title}
                          className="w-12 h-10 rounded object-cover"
                        />
                        <span className="font-medium text-foreground">{event.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                        {event.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(event.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {event.client}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(event)}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(event.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No events found.</p>
            </div>
          )}
        </motion.div>

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl">
                {editingEvent ? 'Edit Event' : 'Create New Event'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Event Title
                </label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Elegant Garden Wedding"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select category</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Birthday">Birthday</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Date
                  </label>
                  <Input
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Client Name
                </label>
                <Input
                  name="client"
                  value={formData.client}
                  onChange={handleChange}
                  placeholder="Emily & James Thompson"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the event..."
                  rows={4}
                  required
                />
              </div>

              <div className="p-4 rounded-lg border-2 border-dashed border-border text-center">
                <p className="text-muted-foreground text-sm">
                  Image upload functionality would connect to your backend storage.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="gold">
                  {editingEvent ? 'Update Event' : 'Create Event'}
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
