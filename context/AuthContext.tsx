'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../lib/api';

export interface User {
  _id: string;
  matricNo: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'admin' | 'lecturer';
  department: string;
  level: number;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (matricNo: string, password: string) => Promise<{ success: boolean; user?: User; message?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; user?: User; message?: string }>;
  logout: () => void;
  loading: boolean;
}

export interface RegisterData {
  matricNo: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  department: string;
  level: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get<ApiResponse<{ user: User }>>('/auth/me');
      setUser(response.data.data?.user || null);
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (matricNo: string, password: string) => {
    try {
      const response = await api.post<ApiResponse<{ user: User; token: string }>>('/auth/login', { 
        matricNo, 
        password 
      });
      
      const { user, token } = response.data.data!;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      return { success: true, user };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await api.post<ApiResponse<{ user: User; token: string }>>('/auth/register', userData);
      const { user, token } = response.data.data!;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      return { success: true, user };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}