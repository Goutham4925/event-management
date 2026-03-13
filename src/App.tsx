import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import ScrollToTop from "@/components/ui/ScrollToTop";

// ✅ Eager load — no lazy() so it's included in the main bundle
import Index from "./pages/Index";

/* ================= LAZY LOADED PAGES ================= */

/* PUBLIC */
const About = lazy(() => import("./pages/About"));
const Works = lazy(() => import("./pages/Works"));
const EventDetails = lazy(() => import("./pages/EventDetails"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Testimonials = lazy(() => import("./pages/Testimonials"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

/* ADMIN */
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const ManageEvents = lazy(() => import("./pages/admin/ManageEvents"));
const ManageGallery = lazy(() => import("./pages/admin/ManageGallery"));
const ManageTestimonials = lazy(() => import("./pages/admin/ManageTestimonials"));
const ManageSettings = lazy(() => import("./pages/admin/ManageSettings"));
const AdminStats = lazy(() => import("./pages/admin/Stats"));
const ManageUsers = lazy(() => import("./pages/admin/ManageUsers"));
const ManageAbout = lazy(() => import("./pages/admin/ManageAbout"));
const ManageMessages = lazy(() => import("./pages/admin/ManageMessages"));
const ManageContactPage = lazy(() => import("./pages/admin/ManageContactPage"));
const ManageCategories = lazy(() => import("./pages/admin/ManageCategories"));
const ManageWorksHero = lazy(() => import("./pages/admin/ManageWorksHero"));
const ManageGalleryHero = lazy(() => import("./pages/admin/ManageGalleryHero"));
const ManageTestimonialsHero = lazy(() => import("./pages/admin/ManageTestimonialsHero"));

/* ================= PREFETCH HELPER ================= */

// Silently prefetch public pages after the homepage has loaded
const prefetchPublicRoutes = () => {
  import("./pages/About");
  import("./pages/Works");
  import("./pages/Gallery");
  import("./pages/Testimonials");
  import("./pages/Contact");
};

/* ================= QUERY CLIENT ================= */

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

/* ================= APP ================= */

const App = () => {
  useEffect(() => {
    // Wait until the browser is idle before prefetching other routes
    if ("requestIdleCallback" in window) {
      requestIdleCallback(prefetchPublicRoutes);
    } else {
      // Fallback for Safari
      setTimeout(prefetchPublicRoutes, 2000);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />

          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <ScrollToTop />

            <Suspense
              fallback={
                <div className="h-screen flex items-center justify-center">
                  Loading...
                </div>
              }
            >
              <Routes>
                {/* ================= PUBLIC ================= */}
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/works" element={<Works />} />
                <Route path="/works/:id" element={<EventDetails />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/testimonials" element={<Testimonials />} />
                <Route path="/contact" element={<Contact />} />

                {/* ================= ADMIN LOGIN ================= */}
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* ================= ADMIN (PROTECTED) ================= */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/events"
                  element={
                    <ProtectedRoute>
                      <ManageEvents />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/categories"
                  element={
                    <ProtectedRoute>
                      <ManageCategories />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/gallery"
                  element={
                    <ProtectedRoute>
                      <ManageGallery />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/testimonials"
                  element={
                    <ProtectedRoute>
                      <ManageTestimonials />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/settings"
                  element={
                    <ProtectedRoute>
                      <ManageSettings />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/stats"
                  element={
                    <ProtectedRoute>
                      <AdminStats />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute>
                      <ManageUsers />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/about"
                  element={
                    <ProtectedRoute>
                      <ManageAbout />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/messages"
                  element={
                    <ProtectedRoute>
                      <ManageMessages />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/contact-page"
                  element={
                    <ProtectedRoute>
                      <ManageContactPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/works-hero"
                  element={
                    <ProtectedRoute>
                      <ManageWorksHero />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/gallery-hero"
                  element={
                    <ProtectedRoute>
                      <ManageGalleryHero />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/testimonials-hero"
                  element={
                    <ProtectedRoute>
                      <ManageTestimonialsHero />
                    </ProtectedRoute>
                  }
                />

                {/* ================= REDIRECT ================= */}
                <Route
                  path="/admin"
                  element={<Navigate to="/admin/login" replace />}
                />

                {/* ================= 404 ================= */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;