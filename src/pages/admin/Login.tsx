import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await login(formData.email, formData.password);
    
    if (success) {
      toast({
        title: "Welcome back!",
        description: "You have been logged in successfully.",
      });
      navigate('/admin/dashboard');
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Try admin@example.com / password123",
        variant: "destructive",
      });
    }
  };

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
          <span className="text-3xl font-serif font-light text-foreground ml-1">
            Events
          </span>
          <p className="text-muted-foreground mt-2">Admin Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-card rounded-lg border border-border p-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Lock className="text-primary" size={28} />
          </div>

          <h1 className="font-serif text-2xl font-bold text-foreground text-center mb-2">
            Welcome Back
          </h1>
          <p className="text-muted-foreground text-center text-sm mb-8">
            Sign in to access the admin dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                  required
                  className="pl-10 bg-background"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="pl-10 pr-10 bg-background"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 rounded-lg bg-secondary/50 border border-border">
            <p className="text-sm text-muted-foreground text-center">
              <span className="font-medium text-foreground">Demo Credentials:</span><br />
              Email: admin@example.com<br />
              Password: password123
            </p>
          </div>
        </div>

        {/* Back to Site Link */}
        <p className="text-center mt-6">
          <a href="/" className="text-muted-foreground hover:text-primary transition-colors text-sm">
            ← Back to Website
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
