import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Image,
  MessageSquare,
  TrendingUp,
  ArrowUpRight,
  Mail,
} from "lucide-react";
import { Link } from "react-router-dom";

import AdminLayout from "@/components/AdminLayout";
import { apiGet, apiGetAuth } from "@/lib/api";

/* ================= TYPES ================= */
type Event = {
  id: string;
  title: string;
  coverImage: string;
  date: string;
  category?: string;
};

type ContactMessage = {
  id: string;
  status: "NEW" | "READ" | "REPLIED";
};

const Dashboard = () => {
  const token = localStorage.getItem("token")!;

  const [events, setEvents] = useState<Event[]>([]);
  const [galleryCount, setGalleryCount] = useState(0);
  const [testimonialCount, setTestimonialCount] = useState(0);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [statsCount, setStatsCount] = useState(0);

  /* ================= LOAD DASHBOARD DATA ================= */
  useEffect(() => {
    async function loadDashboard() {
      const [
        ev,
        gallery,
        testimonials,
        contactMessages,
        stats,
      ] = await Promise.all([
        apiGet<Event[]>("/events"),
        apiGet<any[]>("/gallery"),
        apiGet<any[]>("/testimonials"),
        apiGetAuth<ContactMessage[]>("/contact", token),
        apiGet<any[]>("/stats"),
      ]);

      setEvents(ev || []);
      setGalleryCount(gallery?.length || 0);
      setTestimonialCount(testimonials?.length || 0);
      setMessages(contactMessages || []);
      setStatsCount(stats?.length || 0);
    }

    loadDashboard();
  }, []);

  const newMessages = messages.filter((m) => m.status === "NEW").length;
  const recentEvents = events.slice(0, 5);

  /* ================= STATS CARDS ================= */
  const stats = [
    {
      title: "Total Events",
      value: events.length,
      icon: Calendar,
      link: "/admin/events",
    },
    {
      title: "Gallery Images",
      value: galleryCount,
      icon: Image,
      link: "/admin/gallery",
    },
    {
      title: "Testimonials",
      value: testimonialCount,
      icon: MessageSquare,
      link: "/admin/testimonials",
    },
    {
      title: "New Enquiries",
      value: newMessages,
      icon: Mail,
      link: "/admin/messages",
      highlight: true,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* ================= HEADER ================= */}
        <div>
          <h1 className="font-serif text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your website activity
          </p>
        </div>

        {/* ================= STATS GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={stat.link}
                className={`block bg-card border rounded-lg p-6 hover:border-primary transition ${
                  stat.highlight ? "border-primary/50" : ""
                }`}
              >
                <div className="flex justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <stat.icon className="text-primary" />
                  </div>
                  <ArrowUpRight className="text-muted-foreground" />
                </div>

                <div className="text-3xl font-serif font-bold">
                  {stat.value}
                </div>
                <p className="text-sm text-muted-foreground">
                  {stat.title}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* ================= RECENT EVENTS ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border rounded-lg"
        >
          <div className="p-6 border-b flex justify-between">
            <h2 className="font-serif text-xl font-bold">
              Recent Events
            </h2>
            <Link
              to="/admin/events"
              className="text-primary text-sm hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="divide-y">
            {recentEvents.map((event) => (
              <div
                key={event.id}
                className="p-4 flex gap-4 items-center"
              >
                <img
                  src={event.coverImage}
                  className="w-16 h-12 rounded object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium">{event.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}

            {events.length === 0 && (
              <p className="p-6 text-muted-foreground">
                No events yet
              </p>
            )}
          </div>
        </motion.div>

        {/* ================= QUICK ACTIONS ================= */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link
            to="/admin/events"
            className="bg-card border rounded-lg p-6 text-center hover:border-primary"
          >
            <Calendar className="mx-auto mb-3 text-primary" size={32} />
            <p className="font-medium">Add Event</p>
          </Link>

          <Link
            to="/admin/gallery"
            className="bg-card border rounded-lg p-6 text-center hover:border-primary"
          >
            <Image className="mx-auto mb-3 text-primary" size={32} />
            <p className="font-medium">Upload Images</p>
          </Link>

          <Link
            to="/admin/messages"
            className="bg-card border rounded-lg p-6 text-center hover:border-primary"
          >
            <Mail className="mx-auto mb-3 text-primary" size={32} />
            <p className="font-medium">View Enquiries</p>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
