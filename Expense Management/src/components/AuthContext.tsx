import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'employee' | 'manager' | 'admin';
  managerId?: string;
  country: string;
  companyId: string;
}

interface Company {
  id: string;
  name: string;
  defaultCurrency: string;
  country: string;
}

interface AuthContextType {
  user: User | null;
  company: Company | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (fullName: string, email: string, password: string, country: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    email: 'john.employee@company.com',
    fullName: 'John Employee',
    role: 'employee',
    managerId: '2',
    country: 'US',
    companyId: 'company1'
  },
  {
    id: '2',
    email: 'jane.manager@company.com',
    fullName: 'Jane Manager',
    role: 'manager',
    country: 'US',
    companyId: 'company1'
  },
  {
    id: '3',
    email: 'bob.admin@company.com',
    fullName: 'Bob Admin',
    role: 'admin',
    country: 'US',
    companyId: 'company1'
  }
];

const mockCompanies: Company[] = [
  {
    id: 'company1',
    name: 'Acme Corp',
    defaultCurrency: 'USD',
    country: 'US'
  }
];

const countryToCurrency: Record<string, string> = {
  'US': 'USD',
  'UK': 'GBP',
  'CA': 'CAD',
  'DE': 'EUR',
  'FR': 'EUR',
  'JP': 'JPY',
  'AU': 'AUD',
  'IN': 'INR'
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      const userCompany = mockCompanies.find(c => c.id === userData.companyId);
      setCompany(userCompany || null);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      const userCompany = mockCompanies.find(c => c.id === foundUser.companyId);
      setCompany(userCompany || null);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const signup = async (fullName: string, email: string, password: string, country: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    if (mockUsers.find(u => u.email === email)) {
      return false;
    }

    // Create new company for first user
    const newCompany: Company = {
      id: `company_${Date.now()}`,
      name: `${fullName.split(' ')[0]}'s Company`,
      defaultCurrency: countryToCurrency[country] || 'USD',
      country: country
    };

    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      fullName,
      role: 'admin', // First user becomes admin
      country,
      companyId: newCompany.id
    };

    // In real app, this would be saved to database
    mockUsers.push(newUser);
    mockCompanies.push(newCompany);

    setUser(newUser);
    setCompany(newCompany);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    setCompany(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{
      user,
      company,
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