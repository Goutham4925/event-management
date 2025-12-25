import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, Eye, EyeOff, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loginSuccess } = useAuth();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint =
        mode === "login" ? "/auth/login" : "/auth/register";

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Request failed");
      }

      // ✅ LOGIN FLOW
      if (mode === "login") {
        loginSuccess(data.token, data.user);

        toast({
          title: "Welcome back!",
          description: "You are now logged in.",
        });

        navigate("/admin/dashboard", { replace: true });
      }

      // ✅ SIGNUP FLOW
      if (mode === "signup") {
        toast({
          title: "Account created",
          description:
            "Your account is pending admin approval. You will be able to log in once approved.",
        });

        setFormData({ email: "", password: "" });
        setMode("login");
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-3xl font-serif font-bold text-gradient-gold">
            Elegance
          </span>
          <span className="text-3xl font-serif font-light ml-1">
            Events
          </span>
          <p className="text-muted-foreground mt-2">
            {mode === "login" ? "Admin Portal" : "Create Account"}
          </p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-lg border p-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6">
            {mode === "login" ? (
              <Lock className="text-primary" size={28} />
            ) : (
              <UserPlus className="text-primary" size={28} />
            )}
          </div>

          <h1 className="font-serif text-2xl font-bold text-center mb-6">
            {mode === "login" ? "Sign In" : "Sign Up"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={18}
                />
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="pl-10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={18}
                />
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="gold"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Sign In"
                : "Create Account"}
            </Button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <button
              onClick={() =>
                setMode(mode === "login" ? "signup" : "login")
              }
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {mode === "login"
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
