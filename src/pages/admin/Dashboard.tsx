import { motion } from 'framer-motion';
import { Calendar, Image, MessageSquare, TrendingUp, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import { events, galleryImages, testimonials } from '@/data/mockData';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Events',
      value: events.length,
      icon: Calendar,
      change: '+12%',
      changeType: 'positive',
      link: '/admin/events',
    },
    {
      title: 'Gallery Images',
      value: galleryImages.length,
      icon: Image,
      change: '+8%',
      changeType: 'positive',
      link: '/admin/gallery',
    },
    {
      title: 'Testimonials',
      value: testimonials.length,
      icon: MessageSquare,
      change: '+5%',
      changeType: 'positive',
      link: '/admin/testimonials',
    },
    {
      title: 'Page Views',
      value: '12.5k',
      icon: TrendingUp,
      change: '+23%',
      changeType: 'positive',
      link: '#',
    },
  ];

  const recentEvents = events.slice(0, 5);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's an overview of your website.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                to={stat.link}
                className="block bg-card rounded-lg border border-border p-6 hover:border-primary/50 transition-colors duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <stat.icon className="text-primary" size={24} />
                  </div>
                  <ArrowUpRight className="text-muted-foreground group-hover:text-primary transition-colors" size={20} />
                </div>
                <div className="text-3xl font-serif font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">{stat.title}</span>
                  <span className={`text-xs font-medium ${
                    stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Recent Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-card rounded-lg border border-border"
        >
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-foreground">Recent Events</h2>
            <Link to="/admin/events" className="text-primary text-sm hover:underline">
              View All
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentEvents.map((event) => (
              <div key={event.id} className="p-4 flex items-center gap-4 hover:bg-secondary/50 transition-colors">
                <img
                  src={event.coverImage}
                  alt={event.title}
                  className="w-16 h-12 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">{event.category}</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(event.date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Link
            to="/admin/events"
            className="bg-card rounded-lg border border-border p-6 hover:border-primary/50 transition-colors text-center group"
          >
            <Calendar className="mx-auto mb-4 text-primary" size={32} />
            <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
              Add New Event
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Create a new event listing
            </p>
          </Link>

          <Link
            to="/admin/gallery"
            className="bg-card rounded-lg border border-border p-6 hover:border-primary/50 transition-colors text-center group"
          >
            <Image className="mx-auto mb-4 text-primary" size={32} />
            <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
              Upload Images
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Add photos to gallery
            </p>
          </Link>

          <Link
            to="/admin/settings"
            className="bg-card rounded-lg border border-border p-6 hover:border-primary/50 transition-colors text-center group"
          >
            <MessageSquare className="mx-auto mb-4 text-primary" size={32} />
            <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
              Update Settings
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Modify site content
            </p>
          </Link>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
