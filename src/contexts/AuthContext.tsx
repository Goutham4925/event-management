import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Admin {
  id: string;
  email: string;
}

interface AuthContextType {
  admin: Admin | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedAdmin = localStorage.getItem('admin');
    const token = localStorage.getItem('token');
    
    if (storedAdmin && token) {
      setAdmin(JSON.parse(storedAdmin));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulated auth - in production, this would call your backend API
    // Demo credentials: admin@example.com / password123
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'admin@example.com' && password === 'password123') {
      const adminData: Admin = {
        id: '1',
        email: email,
      };
      
      // Simulated JWT token
      const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo';
      
      localStorage.setItem('admin', JSON.stringify(adminData));
      localStorage.setItem('token', fakeToken);
      setAdmin(adminData);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    localStorage.removeItem('admin');
    localStorage.removeItem('token');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
