import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Demo mode - set to true to preview without backend
const DEMO_MODE = true;

const demoUsers = {
  admin: {
    id: 1,
    username: 'admin',
    email: 'admin@demo.com',
    first_name: 'Admin',
    last_name: 'User',
    role: 'ADMIN',
    company: 1,
    company_name: 'Demo Company',
  },
  manager: {
    id: 2,
    username: 'manager',
    email: 'manager@demo.com',
    first_name: 'Manager',
    last_name: 'User',
    role: 'MANAGER',
    company: 1,
    company_name: 'Demo Company',
  },
  employee: {
    id: 3,
    username: 'employee',
    email: 'employee@demo.com',
    first_name: 'Employee',
    last_name: 'User',
    role: 'EMPLOYEE',
    company: 1,
    company_name: 'Demo Company',
    manager: 2,
    manager_name: 'Manager User',
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      if (!DEMO_MODE) {
        const token = localStorage.getItem('access_token');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    if (DEMO_MODE) {
      // Demo login - accept any of: admin, manager, employee
      const demoUser = demoUsers[username.toLowerCase()];
      if (demoUser) {
        setUser(demoUser);
        localStorage.setItem('user', JSON.stringify(demoUser));
        localStorage.setItem('demo_mode', 'true');
        return;
      }
      throw new Error('Demo users: admin, manager, or employee');
    }

    const response = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/auth/login/`, {
      username,
      password,
    });
    const { access, refresh } = response.data;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
    
    const userResponse = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/users/me/`);
    setUser(userResponse.data);
    localStorage.setItem('user', JSON.stringify(userResponse.data));
  };

  const signup = async (data) => {
    if (DEMO_MODE) {
      const newUser = {
        id: 1,
        username: data.username,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        role: 'ADMIN',
        company: 1,
        company_name: data.company_name,
      };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('demo_mode', 'true');
      return;
    }

    const response = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/auth/signup/`, data);
    const { tokens, user: userData } = response.data;
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    localStorage.setItem('user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`;
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('demo_mode');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
