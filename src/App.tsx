import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// ================= PUBLIC PAGES =================
import Index from "./pages/Index";
import About from "./pages/About";
import Works from "./pages/Works";
import EventDetails from "./pages/EventDetails";
import Gallery from "./pages/Gallery";
import Testimonials from "./pages/Testimonials";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// ================= ADMIN PAGES =================
import AdminLogin from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import ManageEvents from "./pages/admin/ManageEvents";
import ManageGallery from "./pages/admin/ManageGallery";
import ManageTestimonials from "./pages/admin/ManageTestimonials";
import ManageSettings from "./pages/admin/ManageSettings";
import AdminStats from "./pages/admin/Stats";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageAbout from "./pages/admin/ManageAbout"; 
import ManageMessages from "./pages/admin/ManageMessages";
import ManageContactPage from "./pages/admin/ManageContactPage";
import ManageCategories from "./pages/admin/ManageCategories";
import ManageWorksHero from "./pages/admin/ManageWorksHero";
import ManageGalleryHero from "./pages/admin/ManageGalleryHero";
import ManageTestimonialsHero from "./pages/admin/ManageTestimonialsHero";

/* ----------------------------
   GLOBAL UTIL
---------------------------- */
import ScrollToTop from "@/components/ui/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
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

            {/* ✅ NEW ABOUT PAGE ADMIN */}
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
            <Route path="/admin" element={<Navigate to="/admin/login" replace />} />

            {/* ================= 404 ================= */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
