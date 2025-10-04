import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'employee' | 'manager' | 'admin';
  username: string;
  company?: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (userData: any) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in by checking for token and fetching user data
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const userData = await apiService.getCurrentUser();
          setUser({
            id: userData.id,
            email: userData.email,
            fullName: userData.fullName,
            role: userData.role as 'employee' | 'manager' | 'admin',
            username: userData.username,
            company: userData.company
          });
        } catch (error) {
          console.error('Auth check failed:', error);
          // Token might be expired or invalid
          apiService.logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const loginData = await apiService.login(username, password);
      
      // Set user data from login response
      const userInfo: User = {
        id: loginData.user.id,
        email: loginData.user.email,
        fullName: loginData.user.fullName,
        role: loginData.user.role as 'employee' | 'manager' | 'admin',
        username: loginData.user.username,
        company: loginData.user.company
      };
      
      setUser(userInfo);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    companyName?: string;
    country?: string;
  }): Promise<boolean> => {
    try {
      setLoading(true);
      const signupData = await apiService.register(userData);
      
      // Set user data from signup response
      const userInfo: User = {
        id: signupData.user.id,
        email: signupData.user.email,
        fullName: signupData.user.fullName,
        role: signupData.user.role as 'employee' | 'manager' | 'admin',
        username: signupData.user.username,
        company: signupData.user.company
      };
      
      setUser(userInfo);
      return true;
    } catch (error) {
      console.error('Signup failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      signup,
      logout
    }}>
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