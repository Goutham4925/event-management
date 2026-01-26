import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";

import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiGetPublic, apiPostPublic } from "@/lib/api";

/* ================= TYPES ================= */
type ContactPage = {
  badge?: string;
  title: string;
  subtitle?: string;

  email?: string;
  phone?: string;
  address?: string;

  eventTypes?: string[];
};

const Contact = () => {
  const { toast } = useToast();

  const [page, setPage] = useState<ContactPage | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    message: "",
  });

  /* ================= LOAD PAGE CONTENT ================= */
  useEffect(() => {
    apiGetPublic<ContactPage | null>("/contact-page")
      .then((res) => {
        setPage(
          res ?? {
            badge: "Get in Touch",
            title: "Contact Us",
            subtitle: "",
            email: "",
            phone: "",
            address: "",
            eventTypes: [],
          }
        );
      })
      .catch(() => {
        setPage({
          badge: "Get in Touch",
          title: "Contact Us",
          subtitle: "",
          email: "",
          phone: "",
          address: "",
          eventTypes: [],
        });
      });
  }, []);


  /* ================= HANDLERS ================= */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      await apiPostPublic("/contact", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        eventType: formData.eventType || null,
        message: formData.message.trim(),
      });

      toast({
        title: "Message Sent!",
        description: "Thank you for reaching out. We'll get back to you shortly.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        eventType: "",
        message: "",
      });
    } catch (err: any) {
      toast({
        title: "Submission failed",
        description:
          err?.message || "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!page) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Loading contact page...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* ================= HERO ================= */}
      <section className="pt-32 pb-20 bg-card">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            {page.badge && (
              <span className="text-primary text-sm tracking-widest uppercase mb-4 block">
                {page.badge}
              </span>
            )}

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {page.title}
            </h1>

            {page.subtitle && (
              <p className="text-muted-foreground text-lg">
                {page.subtitle}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="py-24">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16">
          {/* ================= INFO ================= */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl font-bold mb-8">
              Contact Information
            </h2>

            <div className="space-y-6 mb-12">
              {page.email && (
                <a
                  href={`mailto:${page.email}`}
                  className="flex gap-4 p-4 bg-card border rounded-lg hover:border-primary/50"
                >
                  <Mail className="text-primary" />
                  <div>
                    <h3 className="font-semibold">Email Us</h3>
                    <p className="text-muted-foreground">{page.email}</p>
                  </div>
                </a>
              )}

              {page.phone && (
                <a
                  href={`tel:${page.phone}`}
                  className="flex gap-4 p-4 bg-card border rounded-lg hover:border-primary/50"
                >
                  <Phone className="text-primary" />
                  <div>
                    <h3 className="font-semibold">Call Us</h3>
                    <p className="text-muted-foreground">{page.phone}</p>
                  </div>
                </a>
              )}

              {page.address && (
                <div className="flex gap-4 p-4 bg-card border rounded-lg">
                  <MapPin className="text-primary" />
                  <div>
                    <h3 className="font-semibold">Visit Us</h3>
                    <p className="text-muted-foreground">{page.address}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* ================= FORM ================= */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-card border rounded-lg p-8">
              <h2 className="font-serif text-2xl font-bold mb-6">
                Send Us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                  />

                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    className="
                      h-10 w-full rounded-md border border-input bg-background
                      px-3 py-2 text-sm
                      ring-offset-background
                      focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                      disabled:cursor-not-allowed disabled:opacity-50
                    "
                  >
                    <option value="">Event Type</option>
                    {page.eventTypes?.map((e) => (
                      <option key={e} value={e}>
                        {e}
                      </option>
                    ))}
                  </select>
                </div>

                <Textarea
                  name="message"
                  rows={5}
                  placeholder="Tell us about your event..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                />

                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send size={18} className="mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
