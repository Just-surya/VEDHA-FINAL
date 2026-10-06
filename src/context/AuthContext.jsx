import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

const STORAGE_KEY = 'vedha_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  const login = async (username, password) => {
    setLoading(true);
    try {
      // Allow slight network delay simulation for authentic experience
      await new Promise(resolve => setTimeout(resolve, 300));

      // Try checking with API endpoint first
      let staffMember = null;
      try {
        const res = await api.get('/staff');
        if (Array.isArray(res.data)) {
          staffMember = res.data.find(
            s => s.username === username.trim() && s.password === password.trim()
          );
        }
      } catch {
        // Fallback to demo credential check if server request fails
      }

      // Check credentials
      if (!staffMember) {
        if (username.trim() === 'admin' && password.trim() === 'admin123') {
          staffMember = {
            id: '1',
            username: 'admin',
            name: 'Staff Administrator',
            role: 'Academic Coordinator',
            department: 'Senior Secondary',
          };
        }
      }

      if (staffMember) {
        const userData = {
          id: staffMember.id,
          username: staffMember.username,
          name: staffMember.name || 'Staff Member',
          role: staffMember.role || 'Staff Coordinator',
          token: `token-${Date.now()}`,
          signedInAt: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        setUser(userData);
        return { success: true, user: userData };
      } else {
        throw new Error('Invalid credentials. Please verify your username and password.');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
